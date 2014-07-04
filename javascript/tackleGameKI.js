function tackleGameKI(mode, playerFirst) {
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
    this.mode = mode;
    
    setFirstPlayer(this.playerFirst);
    
    this.state = 0;
    this.uiMakeTurnCheck = false;
    this.uiSetStoneCheck = false;
    this.uiSetStoneType = 0;


    this.tackle = new Tackle(mode);
    setField(this.tackle.field);
    if (playerFirst) {
        this.oppcolor = 2;
    } else {
        this.oppcolor = 1;
    }
    this.opp = new Opponent(this.oppcolor, this.mode);

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
        } else {
            // TODO: UI MODE WAIT Please wait not you turn
            console.log("UI MODE WAIT Please wait not you turn");
            gameLog(tra.otherturn);
            this.kiSetStone(false);
            this.uiSetStoneType = 2;
            this.uiSetStoneCheck = true;
            // TODO: UI MODE SET BLACK STONE
            console.log("UI MODE SET BLACK STONE");
            gameLog(tra.setblack);
        }
    }

    this.kiSetStone = function (goldenStone) {
        console.log("KI SET STONE " + goldenStone);
        var temp = JSON.parse(JSON.stringify(this.tackle.getField()));
        var stone = this.opp.setStone(temp, goldenStone); // TODO: Check if method exists
        this.tackle.setStone(stone);
        setField(this.tackle.field);
        this.stonenumber--;
    };

    this.kiMakeTurn = function () {
        var tempField = JSON.parse(JSON.stringify(this.tackle.getField()));
        var temp = this.opp.move(tempField); // TODO: Check if method exists
        // TODO: Maybe a problem with stones/stone
        this.tackle.makeTurn(temp.stones, temp.destination);
        tackleMain.print();
        setField(this.tackle.field);
        if(this.hasSomeoneWon(false)){
            return true;
        }
        // TODO: GIVE UI STONES AND DESTINATION
        console.log("GIVE UI STONES AND DESTINATION");
        this.uiMakeTurnCheck = true;
        // TODO: UI MODE SELECT SOMETHING
        console.log("UI MODE SELECT SOMETHING");
        gameLog(tra.yourturn);
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

    this.uiSetStone = function (x, y) {
        if (this.uiSetStoneCheck && this.uiSetStoneType > 0 && this.uiSetStoneType < 4) {
            var s = this.uiSetStoneType;
            var stone = new Stone(s, x, y);
            var good = this.tackle.setStone(stone);
            if (good) {
                this.uiSetStoneCheck = false;
                setField(this.tackle.field);
                this.stonenumber--;
                if (this.stonenumber == 1) {
                    this.uiSetStoneType = 3;
                    this.uiSetStoneCheck = true;
                    // TODO: UI MODE GOLD SET STONE
                    console.log("UI MODE GOLD SET STONE");
                    gameLog(tra.setgold);
                } else {
                    if (this.stonenumber == 0) {
                        if (this.playerFirst) {
                            this.uiMakeTurnCheck = true;
                            // TODO: UI MODE SELECT SOMETHING
                            console.log("UI MODE SELECT SOMETHING");
                            gameLog(tra.yourturn);
                        } else {
                            if(this.kiMakeTurn()){
                                return true;
                            }
                        }
                    } else {
                        // TODO: UI MODE WAIT Please wait not you turn
                        console.log("UI MODE WAIT Please wait not you turn");
                        gameLog(tra.otherturn);
                        this.kiSetStone(false);
                        if (this.stonenumber == 1) {
                            this.kiSetStone(true); // SET GOLD STONE
                            this.uiMakeTurnCheck = true;
                            // TODO: UI MODE SELECT SOMETHING
                            console.log("UI MODE SELECT SOMETHING");
                            gameLog(tra.yourturn);
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
                                } else {
                                    this.uiSetStoneType = 2;
                                    this.uiSetStoneCheck = true;
                                    // TODO: UI MODE BLACK SET STONE
                                    console.log("UI MODE BLACK SET STONE");
                                    gameLog(tra.setblack);
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
            if (this.tackle.makeTurn(stones, destination)) {
                this.uiMakeTurnCheck = false;
                setField(this.tackle.field);
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
                if(this.kiMakeTurn()){
                    return true;
                }
                // TODO: GIVE UI STONES AND DESTINATION
                console.log("GIVE UI STONES AND DESTINATION");
                this.uiMakeTurnCheck = true;
                // TODO: UI MODE SELECT SOMETHING
                console.log("UI MODE SELECT SOMETHING");
                gameLog(tra.yourturn);
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
            } else {
                console.log("KI won!");
                gameLog(tra.youlost);
            }
            return true;
        }
        if (w1) {
            // TODO: White WON
            if (this.playerFirst) {
                console.log("Player won!");
                gameLog(tra.youwon);
            } else {
                console.log("KI won!");
                gameLog(tra.youlost);
            }
            return true;
        }
        if (w2) {
            // TODO: BLACK WON
            if (!this.playerFirst) {
                console.log("Player won!");
                gameLog(tra.youwon);
            } else {
                console.log("KI won!");
                gameLog(tra.youlost);
            }
            return true;
        }
        return false;
    };

    this.start();
}