function Opponent(color, figur) {
    var importantTurn = false;
    var depthInput = 2;
    //Farbe des Gegners bestimmen
    this.colorOpp = 0;
    this.color = color;
    if (color == 1) {
        this.colorOpp = 2;
    } else {
        this.colorOpp = 1;
    }
    this.tackle = new Tackle(figur);
    this.field = null;

    this.move = function (fieldTemp) {
        this.field = fieldTemp;
        this.tackle.setField(fieldTemp);
        importantTurn = false;
        return this.minimax(depthInput, this.color, -2000, +2000);
    }

    this.setStone = function (fieldTemp, goldenStone) {
        //Steine setzen fuer den Anfang
        //Alle Steine werden zufaellig gesetzt
        var stone = null;
        if (!goldenStone) {
            //Stein an rand setzen
            this.field = fieldTemp;
            this.tackle.setField(fieldTemp);
            do {
                var x = 0;
                var y = 0;
                var side = Math.round(Math.random() * 3);
                switch (side) {
                case 0:
                    //linke seite
                    x = 0;
                    y = Math.round(Math.random() * 9);
                    break;
                case 1:
                    //rechte seite
                    x = 9;
                    y = Math.round(Math.random() * 9);
                    break;
                case 2:
                    //obere seite
                    x = Math.round(Math.random() * 9);
                    y = 0;
                    break;
                case 3:
                    //untere seite
                    x = Math.round(Math.random() * 9);
                    y = 9;
                    break;
                }
                stone = new Stone(this.color, x, y);
            } while (!this.tackle.setStone(stone));
        } else {
            var x = Math.round(Math.random() * 3) + 3;
            var y = Math.round(Math.random() * 3) + 3;
            stone = new Stone(3, x, y);
        }

        return stone;
    }

    this.minimax = function (depth, player, alpha, beta) {
        //Alle moeglichen Zuege berechnen
        var nextMoves = this.generateMoves(player);
        var currentScore = 0;
        var bestMove = new Move(alpha);

        if (depth == 0) {
            //Wir sind am Ende unseres Baums angekommen und bewerten dann die Endsituation
            var score = this.evaluate();
            bestMove.setScore(score);
            if (score != 0) {
                importantTurn = true;
            }
            return bestMove;
        } else {
            for (i in nextMoves) {

                var move = nextMoves[i];
                //Zug machen und eine Ebene weiter runter gehen
                var moves = this.tackle.makeTurn(move.getStones(), move.getDestination());
                if (player == this.color) {
                    currentScore = this.minimax(parseInt(depth) - 1, this.colorOpp, alpha, beta).getScore();
                    //Zug bewerten
                    if (currentScore > alpha) {
                        alpha = currentScore;
                        bestMove = move; // Maybe JSON.parse(JSON.stringify());
                        bestMove.setScore(alpha);
                    }
                } else {
                    currentScore = this.minimax(parseInt(depth) - 1, this.color, alpha, beta).getScore();
                    //Zug bewerten
                    if (currentScore < beta) {
                        beta = currentScore;
                        bestMove = move;
                        bestMove.setScore(beta);
                    }
                }
                //Zug rueckgaengig machen
                this.tackle.returnTurn(moves);
                if (alpha >= beta) {
                    break;
                }
            }

            if (player == this.color) {
                bestMove.setScore(alpha);
            } else {
                bestMove.setScore(beta);
            }



            if (depth == depthInput && !importantTurn) {
                bestMove = nextMoves[Math.round(Math.random() * nextMoves.length)];
            }

            return bestMove;
        }



    }
    this.evaluate = function () {
        //Wenn man selber gewinnt plus 100
        //Wenn der Gegner gewinnt minus 100
        var score = 0;
        if (this.tackle.won(this.color)) {
            score += 100;
        }
        if (this.tackle.won(this.colorOpp)) {
            score -= 100;
        }
        return score;
    }
    this.generateMoves = function (color) { //private ArrayList<Move> 
        var moves = []; //ArrayList<Move> moves = new ArrayList<Move>();
        fieldTemp = this.tackle.getField();

        for (i in fieldTemp) {
            for (j in fieldTemp[i]) {
                var possibleTurns = null;

                if (fieldTemp[i][j] == color) {

                    //Für jeden einzelnen Stein die möglichen Züge berechnen
                    var stones = [new Stone(color, i, j)];
                    possibleTurns = this.tackle.possibleTurns(stones);
                    moves = this.addPossibleTurns(moves, stones, possibleTurns);

                    //Für horizontale Schlange
                    var horizontalLength = 1;
                    for (var k = parseInt(i) + 1; k < fieldTemp.length; k++) {
                        if (k in fieldTemp && j in fieldTemp[k] && fieldTemp[k][j] == color) {
                            horizontalLength++;
                        } else {
                            break;
                        }
                    }
                    if (horizontalLength > 1) { //gibt es überhaupt eine Schlange?
                        var stones = null;
                        var stones = []; //new Stone[horizontalLength];
                        for (var k = 0; k < horizontalLength; k++) {
                            stones[k] = new Stone(color, parseInt(i) + k, j);
                        }
                        possibleTurns = this.tackle.possibleTurns(stones);
                        moves = this.addPossibleTurns(moves, stones, possibleTurns);
                    }


                    //Für vertikale Schlange
                    var verticalLength = 1;
                    for (var k = parseInt(j) + 1; k < fieldTemp[i].length; k++) {
                        if (fieldTemp[i][k] == color) {
                            verticalLength++;
                        } else {
                            break;
                        }
                    }
                    if (verticalLength > 1) { //gibt es überhaupt eine Schlange?
                        var stones = null;
                        var stones = []; //new Stone[verticalLength];

                        for (var k = 0; k < verticalLength; k++) {
                            stones[k] = new Stone(color, i, parseInt(j) + k);
                        }
                        possibleTurns = this.tackle.possibleTurns(stones);
                        moves = this.addPossibleTurns(moves, stones, possibleTurns);
                    }


                    //Fürr Blöcke
                    var vLength = verticalLength;
                    for (var k = 0; k < horizontalLength; k++) {
                        var laenge = 1;
                        for (var k2 = 0; k2 < verticalLength; k2++) {
                            if (fieldTemp[k][k2] == color) {
                                laenge++;
                            } else {
                                break;
                            }
                        }
                        if (laenge < vLength) {
                            vLength = laenge;
                        }
                    }

                    if (vLength > 1 && horizontalLength > 1) { //ob es einen Block gibt
                        var stones = null;
                        var stones = []; // new Stone[horizontalLength*vLength];
                        var counter = 0;
                        for (var k = 0; k < horizontalLength; k++) {
                            for (var k2 = 0; k2 < vLength; k2++) {
                                stones[counter] = new Stone(color, k, k2);
                                counter++;
                            }
                        }
                        possibleTurns = this.tackle.possibleTurns(stones);
                        moves = this.addPossibleTurns(moves, stones, possibleTurns);

                    }


                }

            }
        }

        return moves;
    }

    this.addPossibleTurns = function (moves, stones, possibleTurns) {
        //2 Arrays zusammenbringen
        for (var k = 0; k < possibleTurns.length; k++) {
            for (var k2 = 0; k2 < possibleTurns[k].length; k2++) {
                if (possibleTurns[k][k2] > 0) {
                    moves.push(new Move(stones, new Destination(k, k2)));
                }
            }
        }

        return moves;
    }


}