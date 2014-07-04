/*function lol(data){console.log(data);};

function userlistchange(){
    console.log(JSON.stringify(tc.userlist));
};

function diss(){
    alert("NEIN");
};
var server = "http://192.168.30.129:8080/Tackle/";
var server = "http://localhost:8181/Tackle/";
var tc = new tackleConnection("Hans", server);
tc.on('msg', lol);
tc.on('error', lol);
tc.on('change', userlistchange);
tc.connect();
window.onbeforeunload = function() { return tc.disconnect(); };


if('abcundefinedxyz'.indexOf() == 3){
    console.log("True == True => True");
}*/

var url = document.URL;
var pro = url.split('://');
var protocol = pro[0];
var dom = pro[1].split('/')[0].split(':');
var domain = dom[0];
var config = {};
config.server = "http://"+domain+":8181/Tackle/";
config.server = "http://localhost:8181/Tackle/";
config.server = "http://hex:8181/Tackle/";
config.server = "http://109.193.79.76:8080/Tackle/";
config.server = "http://localhost:8080/";
config.waitForResponse = 60000;

function tackleControl(){
    this.tc;
    this.state = 0;
    this.waitForGameResponse;
    //this.gameRequestCache = {"uid": false, "mode": false};
    this.tackleGame;
    var that = this;
    
    this.login = function(username){
        if(this.state == 0){
            this.tc = new tackleConnection(username, config.server);
            this.tc.on('msg', this.onmessage);
            this.tc.on('error', this.onerror);
            this.tc.on('change', this.onchange);
            this.tc.connect();
            var that = this;
            //window.onbeforeunload = function() { return that.tc.disconnect(); };
            this.state = 1;
            // TODO: UI SET VIEW MODE 1 (DASHBOARD)
            console.log("UI SET VIEW MODE 1 (DASHBOARD)");
            scrollPage(1);
            return true;
        } else {
            this.onerror("Something went wrong!");
            return false;
        }
    };
    
    this.kigame = function(mode, playerFirst){
        this.state = 3;
        this.tackleGame = new tackleGameKIWorker(mode, playerFirst);
        scrollPage(5);
    };
    
    this.attackUserName = function(name, mode, playerFirst){
        var uid = -1;
        for(i in this.tc.userlist){
            if(this.tc.userlist[i].name == name){
                uid = this.tc.userlist[i].id;
            }
        }
        if(uid>=0){
            if(playerFirst){
                var firstTurn = this.tc.userid;
            } else {
                var firstTurn = uid;
            }
            this.gameRequest(uid, mode, firstTurn);
            return true;
        } else {
            return false;
        }
    };
    
    this.gameRequest = function(uid, mode, firstTurn){
        var x = {};
        x.mode = mode;
        x.firstTurn = firstTurn;
        this.state = 2;
        // TODO: UI SET VIEW MODE WAITING
        console.log("UI SET VIEW MODE WAITING");
        scrollPage(3);
        this.send("gameRequest", uid, x);
        var that = this;
        this.waitForGameResponse = setTimeout( function (){
            that.noGameResponse()}, config.waitForResponse);
    };
    
    this.gameResponse = function(accept, obj){
        var x = {};
        x.uid = obj.data.data.uid;
        x.mode = obj.data.data.mode;
        x.firstTurn = obj.data.data.firstTurn;
        x.accept = accept;
        this.send("gameResponse", obj.userid, x);
    };
    
    this.noGameResponse = function(){
        this.waitForGameResponse = null;
        // TODO: UI SET VIEW MODE 1 (Dashboard)
        console.log("UI SET VIEW MODE 1 (Dashboard)");
        this.state = 1;
        scrollPage(1);
    };
    
    this.onGameResponse = function(obj){
        if(this.waitForGameResponse){
            clearTimeout(this.waitForGameResponse);
        }
        if(obj.data.data.accept == true){
            this.state = 3;
            console.log("NEWGAME");
            // TODO: UI SET VIEW GAME
            console.log("UI SET VIEW GAME");
            scrollPage(5);
            this.tackleGame = new tackleGame(this.tc.userid, obj.userid, obj.data.data.firstTurn, obj.data.data.mode, this.sendGameTurn);
            //startgame
        } else {
            // TODO: UI SET VIEW gameRequest denied
            console.log("UI SET VIEW gameRequest denied");
            this.state = 1;
            scrollPage(1);
        }
        
    };
    
    this.getUserName = function(id){
        for(i in this.tc.userlist){
                if(this.tc.userlist[i].id == id){
                    return this.tc.userlist[i].name;
                }
            }
    };
    
    this.onGameRequest = function(obj){
        if(this.state == 1){
            this.state = 2;
            this.objcache = obj;
            // TODO: UI ATTACK POPUP
            console.log("UI ATTACK POPUP"+JSON.stringify(obj));
            var temp = [this.getUserName(obj.userid), obj.data.data.mode, obj.data.data.firstTurn != this.userid];
            attackedSelf(temp);
        } else {
            this.gameResponse(false, obj);
        }
    };
    
    this.uiAcceptRequest = function(bool){
        if(bool){
            this.state = 3;
            var obj = this.objcache;
            this.gameResponse(true, obj);
            console.log("NEWGAME");
            // TODO: UI SET VIEW GAME
            console.log("UI SET VIEW GAME");
            scrollPage(5);
            this.tackleGame = new tackleGame(this.tc.userid, obj.userid, obj.data.data.firstTurn, obj.data.data.mode, this.sendGameTurn);
        } else {
            this.state = 1;
            var obj = this.objcache;
            this.gameResponse(false, obj);
        }
    };
    
    this.uiExitGame = function(){
        if(this.tackleGame){
            this.send("exit", this.tackleGame.p2id, "");
        }
        this.tackleGame = null;
        this.state = 1;
        // TODO: UI SET VIEW MODE 1 (DASHBOARD)
        console.log("UI SET VIEW MODE 1 (DASHBOARD)");
        scrollPage(1);
        stopMusic();
    };
    
    this.exitGame = function(userid){
        if(this.tackleGame){
            if(userid == this.tackleGame.p2id){
                this.tackleGame = null;
                this.state = 1;
                // TODO: UI SET VIEW MODE 1 (DASHBOARD)
                console.log("UI SET VIEW MODE 1 (DASHBOARD)");
                scrollPage(1);
                stopMusic();
            }
        }
    };
    
    this.onGameTurn = function(obj){
        if(this.state == 3){
            this.tackleGame.gameTurn(obj);
        } else {
            this.send("error", obj.userid, {"text": "I'm not playing with you!"});
        }
    };
    
    this.send = function(type, uid, obj){
        var x = {};
        x.type = type;
        x.data = obj;
        this.tc.sendToUser(uid, x);
    };
    
    this.onmessage = function(obj){
        console.log("ONMESSAGE"+JSON.stringify(obj));
        switch(obj.data.type){
            case "gameRequest":
                that.onGameRequest(obj);
                break;
            case "gameResponse":
                that.onGameResponse(obj);
                break;
            case "gameTurn":
                that.onGameTurn(obj);
                break;
            case "exit":
                that.exitGame(obj.userid);
                break;
            case "error":
                that.onerror(obj.data);
                break;
        };
    };
    
    this.sendGameTurn = function(userid, obj){
        that.send("gameTurn", userid, obj);
    };
    
    this.onerror = function(obj){
        console.error(obj);
        console.error("game crashed - please reload");
        scrollPage(7);
    };
    
    this.onchange = function(){
        console.info(JSON.stringify(that.tc.userlist));
        setUserlist(that.tc.userlist);
    };
    
    this.print = function(){
        var temp = this.tackleGame.tackle.field;
        console.log(" : 0 1 2 3 4 5 6 7 8 9");
        for(i in temp){
            var temp2 = i+":";
            for(j in temp[i]){
                temp2 += " "+temp[j][i];
            }
            console.log(temp2);
        }
        return true;
    };
};

var tackleMain = new tackleControl();