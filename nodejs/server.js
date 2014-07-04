/******************************************************************************************
#
#       Copyright 2014 Dustin Robert Hoffner
#
#       Licensed under the Apache License, Version 2.0 (the "License");
#       you may not use this file except in compliance with the License.
#       You may obtain a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#       Unless required by applicable law or agreed to in writing, software
#       distributed under the License is distributed on an "AS IS" BASIS,
#       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#       See the License for the specific language governing permissions and
#       limitations under the License.
#       
#       Projectname...................: pragm
#
#       Developer/Date................: Dustin Robert Hoffner, 16.01.2014
#       Filename......................: Zpragm-websocket.js
#       Version/Release...............: 0.5xx
#
******************************************************************************************/
"use strict";

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.title = 'tackle-node-js-server';

function log(text) {
    var aTime = ((new Date()).toString()).substr(0, 24);
    console.log(aTime + '   ' + text);
}

var webSocketsServerPort = 8080;

var io = require('socket.io').listen(webSocketsServerPort);

io.set('log level', 1);
io.server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
        log("Port is blocked!");
    }
});

var clients = [];
var userlist = [];

var connectionCounter = 0;

function broadcast(msg){
    for(var i = 0; i < connectionCounter; i++){
        if(clients[i]){
            clients[i].send(msg);
            log("send to user "+i+" msg: "+msg);
        }
    }
}

//clients[client].send(text);

io.sockets.on('connection', function (socket) {
    var address = socket.handshake.address;
    var clientID = connectionCounter;
    clients[clientID] = socket;
    connectionCounter++;
    var s = {"type":"u","id":clientID};
    clients[clientID].send(JSON.stringify(s));
    log('CONNECTION: CLIENTID: ' + clientID + ' IP: ' + address.address + ' PORT: ' + address.port);
    

    socket.on('message', function (msg) {
        var o = JSON.parse(msg);
        switch(o.type){
            case "l":
                userlist.push({"name":o.name,"id":clientID});
                var s = {"type":"l","ul":userlist};
                broadcast(JSON.stringify(s));
                log("Send"+s);
                break;
            case "m":
                try{
                    var s = {"type":"m","msg":o.msg,"userid":o.userid};
                    clients[o.id].send(JSON.stringify(s));
                } catch (e) {
                    console.log("EEEEEEEEERRRRRRRRRROOOOOOOOOOOOOORRRRRRRRRR");
                }
                break;
        }
    });

    socket.on('disconnect', function () {
        if (clients[clientID]) {
            delete clients[clientID]
        }
        var k = -1;
        for(var i in userlist){
            if(userlist[i].id == clientID){
                k = i;
            }
        }
        if(k>=0){
            userlist.splice(k,1);
            var s = {"type":"l","ul":userlist};
            log("Send"+s);
            broadcast(JSON.stringify(s));
        }
        log("CLIENTID=>" + clientID + " disconnected!");
    });

});