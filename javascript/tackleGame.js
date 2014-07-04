function tackleGame(p1id, p2id, firstPlayer, mode, turnCB) {
    this.stonenumber = 0;
    var temp = figuren.figuren.indexOf(mode);
    var temp = figuren.figurenInt[temp];
    for (i in temp) {
        for (j in temp[i]) {
            if (temp[i][j] == 1) {
                this.stonenumber++;
            }
        }
    }
    this.stonenumber = (this.stonenumber + 2) * 2 + 1;
    this.p1id = p1id; // OWN ID !
    this.p2id = p2id; // OTHER PLAYER ID
    this.firstPlayer = firstPlayer;
    console.log("FIRSTPLAYER=" + this.firstPlayer);
    setFirstPlayer(this.firstPlayer==this.p1id);
    gameLog(tra.firstplayer + tackleMain.getUserName(this.firstPlayer));
    clearLog();
    startMusic();
    this.mode = mode;
    this.turnCB = turnCB;

    this.state = 0;
    this.setStoneType = 0;
    this.uiMakeTurnCheck = false;
    this.uiSetStoneCheck = false;
    this.uiSetStoneType = 0;

    this.tackle = new Tackle(mode);
    setField(this.tackle.field, false);

    this.getOwnColor = function () {
        if (this.firstPlayer == this.p1id) {
            return "player1";
        } else {
            return "player2";
        }
    };
    
    this.start = function () {
        if (this.p1id == this.firstPlayer) {
            this.setStoneType = 1;
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
        }
    }

    this.gameTurn = function (obj) {
        switch (obj.data.data.type) {
        case "setStone":
            this.setStone(obj.data.data.s, obj.data.data.x, obj.data.data.y);
            break;
        case "turn":
            this.makeTurn(obj.data.data.stones, obj.data.data.destination);
            break;
        case "chat":
            gameChat(obj.data.data.t, false);
            break;
        }
    };

    this.possibleTurns = function (stones) {
        return this.tackle.possibleTurns(stones);
    };
    
    this.sendChat = function(text){
        var temp = {};
        temp.type = "chat";
        temp.t = text;
        this.turnCB(this.p2id, temp);
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
                var temp = {};
                temp.type = "setStone";
                temp.s = s;
                temp.x = x;
                temp.y = y;
                this.turnCB(this.p2id, temp);
                // TODO: UI MODE WAIT Please wait not your turn
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
                    // TODO: UI MODE WAIT Please wait not you turn
                    console.log("UI MODE WAIT Please wait not you turn");
                    gameLog(tra.otherturn);
                    setPlayerTurn(false);
                }
            }
            return good;
        }
        return false;
    };

    this.setStone = function (s, x, y) {
        this.stonenumber--;
        var stone = new Stone(s, x, y);
        var good = this.tackle.setStone(stone);
        if (good) {
            setField(this.tackle.field, false);
            if (this.stonenumber > 1) {
                if (this.p1id == this.firstPlayer) {
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
            } else {
                if (this.stonenumber != 1) {
                    this.uiMakeTurnCheck = true;
                    console.log("UI MODE SELECT SOMETHING");
                    gameLog(tra.yourturn);
                    setPlayerTurn(true);
                }
            }
        } else {
            // TODO: ERROR
        }
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
                this.turnCB(this.p2id, temp);
                if (this.hasSomeoneWon(this.p1id)) {
                    return true;
                }
                // TODO: UI MODE WAIT Please wait not your turn
                console.log("UI MODE WAIT Please wait not your turn");
                gameLog(tra.otherturn);
                setPlayerTurn(false);
            }
        }
        return false;
    };


    this.makeTurn = function (stones, destination) {
        var destination = new Destination(destination.x, destination.y);
        // das muss rein weil das destination objekt, was reinkommt nur die werte enthält, nicht die methoden
        // so nicht richtig! es muss ein Stone array übergeben werden!
        var stonesarr = [];
        for (i in stones) {
            stonesarr.push(new Stone(stones[i].color, stones[i].x, stones[i].y));
        }
        //var stones = new Stone(stones.color, stones.x, stones.y);
        //debugger;
        var move = this.tackle.makeTurn(stonesarr, destination);
        setField(this.tackle.field, move);
        if (this.hasSomeoneWon(this.p2id)) {
            return true;
        }
        // TODO: GIVE UI STONES AND DESTINATION
        console.log("GIVE UI STONES AND DESTINATION");
        this.uiMakeTurnCheck = true;
        // TODO: UI MODE SELECT SOMETHING
        console.log("UI MODE SELECT SOMETHING");
        gameLog(tra.yourturn);
        setPlayerTurn(true);
    };

    this.hasSomeoneWon = function (prioID) {
        var w1 = this.tackle.won(1);
        var w2 = this.tackle.won(2);
        if (w1 && w2) {
            if (prioID == this.p1id) {
                showPopup(true);
                console.log("You won!");
                gameLog(tra.youwon);
                setPlayerTurn(false);
            } else {
                console.log("You lost the Game!");
                gameLog(tra.youlost);
                showPopup(false);
                setPlayerTurn(false);
            }
            return true;
        }
        if (w1) {
            // TODO: White WON
            if (this.firstPlayer == this.p1id) {
                showPopup(true);
                console.log("You won!");
                gameLog(tra.youwon);
                setPlayerTurn(false);
            } else {
                console.log("You lost the Game!");
                gameLog(tra.youlost);
                showPopup(false);
                setPlayerTurn(false);
            }
            return true;
        }
        if (w2) {
            // TODO: BLACK WON
            if (this.firstPlayer == this.p2id) {
                showPopup(true);
                console.log("You won!");
                gameLog(tra.youwon);
                setPlayerTurn(false);
            } else {
                console.log("You lost the Game!");
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