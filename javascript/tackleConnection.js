function tackleConnection(username, server) {
    this.socket;
    this.address = server;
    this.username = username;
    this.userid;
    this.callbacks = {};
    this.userlist = [];
    var that = this;

    this.send = function (text) {
        console.log("SEND");
        console.log(text);
        this.socket.send(text);
    };

    this.onload = function () {
        var that = this;
        this.socket = io.connect(this.address, {
            'connect timeout': 5000,
            'reconnection limit': 0
        });
        this.socket.on('connect', function () {
            var s = {
                "type": "l",
                "name": that.username
            };
            that.send(JSON.stringify(s));
        });

        this.socket.on('disconnect', function (msg) {
            that.trigger('error', {
                "info": "disconnect"
            });
        });

        this.socket.on('message', function (msg) {
            var o = JSON.parse(msg);
            console.log("Receive");
            console.log(msg);
            switch (o.type) {
            case "l":
                that.userlist = o.ul;
                that.trigger('change', "-");
                break;
            case "m":
                that.trigger('msg', {
                    "data": o.msg,
                    "userid": o.userid
                });
                break;
            case "u":
                that.userid = o.id;
                break;
            }
        });

        this.socket.on('reconnect_failed', function () {
            that.trigger('error', {
                "info": "reconnect_failed"
            });
        });

        this.socket.on('connecting', function () {
            console.log('connecting');
        });

        this.socket.on('connect_failed', function () {
            that.trigger('error', {
                "info": "connect_failed"
            });
        });
        this.socket.on('error', function (data) {
            that.trigger('error', {
                "info": "connect_failed"
            });
        });

        this.socket.on('reconnect', function () {
            console.log('reconnect');
        });

        this.socket.on('reconnecting', function () {
            that.trigger('error', {
                "info": "reconnecting"
            });
        });
    };

    this.on = function (object, callback) { // Need in nodejs
        this.callbacks[object] = callback;
    };

    this.trigger = function (object, data) { // Need in nodejs
        if (object in that.callbacks) {
            that.callbacks[object](data);
        }
    };

    this.connect = function () { // Need in nodejs
        if (this.username.length > 0) {
            this.onload();
        }
    };

    this.sendToUser = function (uid, data) { // Need in nodejs
        console.log("Send to user "+uid);
        var s = {
            "type": "m",
            "msg": data,
            "userid": this.userid,
            "id": uid
        };
        this.send(JSON.stringify(s));
    };
}