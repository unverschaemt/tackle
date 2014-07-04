importScripts('javaJS/Destination.js');
importScripts('javaJS/Move.js');
importScripts('javaJS/Opponent.js');
importScripts('javaJS/Stone.js');
importScripts('javaJS/Tackle.js');
importScripts('figuren.js');

var opp;

var newOpp = function(color, mode){
    opp = null;
    opp = new Opponent(color, mode);
};

var kiSetStone = function (field, color, mode, goldenStone) {
    var temp = field;
    var stone = opp.setStone(temp, goldenStone);
    temp = null;
    var obj = {"s":stone.color,"x":stone.x,"y":stone.y};
    self.postMessage(obj);
};

var kiMakeTurn = function (field) {
    var tempField = field;
    var temp = opp.move(tempField); 
    tempField = null;
    var lol = JSON.parse(JSON.stringify(temp));
    lol.cmd = "turn";
    self.postMessage(lol);
};

self.addEventListener('message', function(e) {
    switch(e.data.cmd){
        case "turn":
            kiMakeTurn(e.data.field);
            break;
        case "stone":
            kiSetStone(e.data.field, e.data.color, e.data.mode, e.data.goldenStone);
            break;
        case "opp":
            newOpp(e.data.color, e.data.mode);
            break;
    }
}, false);