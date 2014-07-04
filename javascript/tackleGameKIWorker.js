var webWorker = new Worker('javascript/worker.js');

webWorker.addEventListener('message', function(e) {
    var obj = {"data":{"data":{}}};
  switch(e.data.cmd){
        case "turn":
            /*obj.data.data.type = "turn";
            obj.data.data.stones = e.data.stones;
            obj.data.data.destination = e.data.destination;*/
            console.log("kiturn worker");
            console.log(e.data);
            var temp = {};
            temp.stones = e.data.stones;
            temp.destination = e.data.destination;
            tackleMain.tackleGame.onKiTurn(temp);
            break;
        case "stone":
            obj.data.data.type = "setStone";
            obj.data.data.s = e.data.s;
            obj.data.data.x = e.data.x;
            obj.data.data.y = e.data.y;
            tackleMain.tackleGame.gameTurn(obj);
            break;
    }
}, false);

function tackleGameKIWorker(mode, playerFirst) {
    this.stonenumber = 0;
    var temp = figuren.figuren.indexOf(mode);
    var temp = figuren.figurenInt[temp];
    console.log(temp);
    for (i in temp) {
        for (j in temp[i]) {
            if (temp[i][j] == 1) {
                console.log("Test: " + temp[i][j]);
                this.stonenumber++;
            }
        }
    }
    this.stonenumber = (this.stonenumber + 2) * 2 + 1;
    this.playerFirst = playerFirst || false;
    console.log("FIRSTPLAYER=" + this.firstPlayer);
    
    setFirstPlayer(this.playerFirst);
    clearLog();
    startMusic();
    setPlayerTurn(true);
    this.state = 0;
    this.uiMakeTurnCheck = false;
    this.uiSetStoneCheck = false;
    this.uiSetStoneType = 0;


    this.tackle = new Tackle(mode);
    setField(this.tackle.field, false);
    if (playerFirst) {
        this.oppcolor = 2;
    } else {
        this.oppcolor = 1;
    }
    this.opp = new Opponent(this.oppcolor, this.mode);
    this.mode = mode;
    var obj = {};
    obj.cmd = "opp";
    obj.color = this.oppcolor;
    obj.mode = this.mode;

    webWorker.postMessage(obj);

    this.getOwnColor = function () {
        if (this.playerFirst) {
            return "player1";
        } else {
            return "player2";
        }
    };

    this.start = function () {
        if (this.playerFirst) {
            this.uiSetStoneType = 1;
            this.uiSetStoneCheck = true;
            // TODO: UI MODE SET WHITE STONE
            console.log("UI MODE SET WHITE STONE");
            gameLog(tra.setwhite);
            setPlayerTurn(true);
        } else {
            // TODO: UI MODE WAIT Please wait not you turn
            console.log("UI MODE WAIT Please wait not you turn");
            gameLog(tra.otherturn);
            setPlayerTurn(false);
            this.kiSetStone(false);
            this.uiSetStoneType = 2;
            this.uiSetStoneCheck = true;
            // TODO: UI MODE SET BLACK STONE
            console.log("UI MODE SET BLACK STONE");
            gameLog(tra.setblack);
            setPlayerTurn(true);
        }
    }

    this.kiSetStone = function (goldenStone) {
        console.log("KI SET STONE " + goldenStone);
        var temp = JSON.parse(JSON.stringify(this.tackle.getField()));
        var stone = this.opp.setStone(temp, goldenStone); // TODO: Check if method exists
        this.tackle.setStone(stone);
        setField(this.tackle.field, false);
        this.stonenumber--;
    };

    this.kiMakeTurn = function () {
        var obj = {};
        obj.cmd = "turn";
        obj.field = JSON.parse(JSON.stringify(this.tackle.getField()));
        obj.color = this.oppcolor;
        obj.mode = this.mode;
        
        webWorker.postMessage(obj);
    };
    
    this.onKiTurn = function(temp){
        var destination = new Destination(temp.destination.x, temp.destination.y);
        // das muss rein weil das destination objekt, was reinkommt nur die werte enthält, nicht die methoden
        // so nicht richtig! es muss ein Stone array übergeben werden!
        var stonesarr = [];
        for (i in temp.stones) {
            stonesarr.push(new Stone(temp.stones[i].color, temp.stones[i].x, temp.stones[i].y));
        }
        
        var move = this.tackle.makeTurn(stonesarr, destination);
        //tackleMain.print();
        setField(this.tackle.field, move);
        if(this.hasSomeoneWon(false)){
            return true;
        }
        // TODO: GIVE UI STONES AND DESTINATION
        console.log("GIVE UI STONES AND DESTINATION");
        this.uiMakeTurnCheck = true;
        // TODO: UI MODE SELECT SOMETHING
        console.log("UI MODE SELECT SOMETHING");
        gameLog(tra.yourturn);
        setPlayerTurn(true);
        return false;
    };

    this.gameTurn = function (obj) {
        switch (obj.data.data.type) {
        case "setStone":
            this.setStone(obj.data.data.s, obj.data.data.x, obj.data.data.y);
            break;
        case "turn":
            this.makeTurn(obj.data.data.stone, obj.data.data.destination);
            break;
        }
    };

    this.possibleTurns = function (stones) {
        return this.tackle.possibleTurns(stones);
    };
    
    this.sendChat = function (obj) {
        gameChat(answers[Math.round(Math.random() * (answers.length-1))], false);
    };
    
    this.goldstoneset = false;
    
    this.uiSetStone = function (x, y) {
        if (this.uiSetStoneCheck && this.uiSetStoneType > 0 && this.uiSetStoneType < 4) {
            var s = this.uiSetStoneType;
            var stone = new Stone(s, x, y);
            var good = this.tackle.setStone(stone);
            if (good) {
                this.uiSetStoneCheck = false;
                if(this.goldstoneset){
                    this.goldstoneset = false;
                    resetGoldStoneHighlight();
                }
                setField(this.tackle.field, false);
                this.stonenumber--;
                if (this.stonenumber == 1) {
                    this.uiSetStoneType = 3;
                    this.uiSetStoneCheck = true;
                    // TODO: UI MODE GOLD SET STONE
                    console.log("UI MODE GOLD SET STONE");
                    this.goldstoneset = true;
                    setGoldStoneHighlight();
                    gameLog(tra.setgold);
                    setPlayerTurn(true);
                } else {
                    if (this.stonenumber == 0) {
                        if (this.playerFirst) {
                            this.uiMakeTurnCheck = true;
                            // TODO: UI MODE SELECT SOMETHING
                            console.log("UI MODE SELECT SOMETHING");
                            gameLog(tra.yourturn);
                            setPlayerTurn(true);
                        } else {
                            if(this.kiMakeTurn()){
                                return true;
                            }
                        }
                    } else {
                        // TODO: UI MODE WAIT Please wait not you turn
                        console.log("UI MODE WAIT Please wait not you turn");
                        gameLog(tra.otherturn);
                        setPlayerTurn(false);
                        this.kiSetStone(false);
                        if (this.stonenumber == 1) {
                            this.kiSetStone(true); // SET GOLD STONE
                            this.uiMakeTurnCheck = true;
                            // TODO: UI MODE SELECT SOMETHING
                            console.log("UI MODE SELECT SOMETHING");
                            gameLog(tra.yourturn);
                            setPlayerTurn(true);
                        } else {
                            if (this.stonenumber == 0) {
                                if(this.kiMakeTurn()){
                                    return true;
                                }
                            } else {
                                if (this.playerFirst) {
                                    this.uiSetStoneType = 1;
                                    this.uiSetStoneCheck = true;
                                    // TODO: UI MODE WHITE SET STONE
                                    console.log("UI MODE WHITE SET STONE");
                                    gameLog(tra.setwhite);
                                    setPlayerTurn(true);
                                } else {
                                    this.uiSetStoneType = 2;
                                    this.uiSetStoneCheck = true;
                                    // TODO: UI MODE BLACK SET STONE
                                    console.log("UI MODE BLACK SET STONE");
                                    gameLog(tra.setblack);
                                    setPlayerTurn(true);
                                }
                            }
                        }
                    }
                }
            }
            return good;
        }
        return false;
    };

    this.uiMakeTurn = function (stones, destination) {
        if (this.uiMakeTurnCheck) {
            var move = this.tackle.makeTurn(stones, destination);
            if (move) {
                this.uiMakeTurnCheck = false;
                setField(this.tackle.field, move);
                var temp = {};
                temp.type = "turn";
                temp.destination = destination;
                temp.stones = stones;
                //this.turnCB(this.p2id, temp);
                if(this.hasSomeoneWon(true)){
                    return true;
                }
                // TODO: UI MODE WAIT Please wait not your turn
                console.log("UI MODE WAIT Please wait not your turn");
                gameLog(tra.otherturn);
                setPlayerTurn(false);
                var that = this;
                setTimeout(function temp(){
                    if(that.kiMakeTurn()){
                        return true;
                    }
                }, 600);
                /*// TODO: GIVE UI STONES AND DESTINATION
                console.log("GIVE UI STONES AND DESTINATION");
                this.uiMakeTurnCheck = true;
                // TODO: UI MODE SELECT SOMETHING
                console.log("UI MODE SELECT SOMETHING");
                gameLog(tra.yourturn);*/
            }
        }
        return false;
    };

    this.hasSomeoneWon = function (prioPlayer) {
        var w1 = this.tackle.won(1);
        var w2 = this.tackle.won(2);
        if (w1 && w2) {
            if (prioPlayer) {
                console.log("Player won!");
                gameLog(tra.youwon);
                showPopup(true);
                setPlayerTurn(false);
            } else {
                console.log("KI won!");
                gameLog(tra.youlost);
                showPopup(false);
                setPlayerTurn(false);
            }
            return true;
        }
        if (w1) {
            // TODO: White WON
            if (this.playerFirst) {
                console.log("Player won!");
                gameLog(tra.youwon);
                showPopup(true);
                setPlayerTurn(false);
            } else {
                console.log("KI won!");
                gameLog(tra.youlost);
                showPopup(false);
                setPlayerTurn(false);
            }
            return true;
        }
        if (w2) {
            // TODO: BLACK WON
            if (!this.playerFirst) {
                console.log("Player won!");
                gameLog(tra.youwon);
                showPopup(true);
                setPlayerTurn(false);
            } else {
                console.log("KI won!");
                gameLog(tra.youlost);
                showPopup(false);
                setPlayerTurn(false);
            }
            return true;
        }
        return false;
    };

    this.start();
}