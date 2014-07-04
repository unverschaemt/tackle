function Tackle(figur) {

    this.figuren = JSON.parse(JSON.stringify(figuren.figuren));
    this.figurenInt = JSON.parse(JSON.stringify(figuren.figurenInt));
    this.figurenInt90 = JSON.parse(JSON.stringify(figuren.figurenInt90));

    this.field = [];
    this.figur = [];
    this.figur90 = [];

    this.moves = [];




    this.getFigur = function () {
        return this.figur;
    }

    this.setFigur = function (figur) {
        for (var i = 0; i < this.figuren.length; i++) {
            if (this.figuren[i] == figur) {
                this.figur = this.figurenInt[i];
                this.figur90 = this.figurenInt90[i];
                break;
            }
        }

    }

    this.getField = function () {
        return this.field;
    }

    this.setField = function (field) {
        this.field = field;
    }

    this.setStone = function (stone) {
        var x = stone.getX();
        var y = stone.getY();
        var color = stone.getColor();

        //ob es ein goldener Stein ist    
        if (color == 3) {
            if (x > 2 && x < 7 && y > 2 && y < 7) {
                this.field[x][y] = 3;
                return true;
            }
            //für weiße oder schwarze Steine
        } else {
            //ist das Feld frei?
            if (this.field[x][y] > 0) {
                return false;
            }
            //Ecken prüfen, ob auf den Feldern daneben ein gleichfarbiger Stein steht
            if (x == 0 && y == 0) {
                if (this.field[0][1] != color && this.field[1][0] != color) {
                    this.field[0][0] = color;
                    return true;
                } else {
                    return false;
                }
            }
            if (x == 9 && y == 0) {
                if (this.field[9][1] != color && this.field[8][0] != color) {
                    this.field[9][0] = color;
                    return true;
                } else {
                    return false;
                }
            }
            if (x == 0 && y == 9) {
                if (this.field[1][9] != color && this.field[0][8] != color) {
                    this.field[0][9] = color;
                    return true;
                } else {
                    return false;
                }
            }
            if (x == 9 && y == 9) {
                if (this.field[9][8] != color && this.field[8][9] != color) {
                    this.field[9][9] = color;
                    return true;
                } else {
                    return false;
                }
            }
            //Ganz normale Reihen prüfen, ob daneben gleichfarbige Steine stehen
            if (x == 0) {
                if (this.field[0][y - 1] != color && this.field[0][y + 1] != color) {
                    this.field[0][y] = color;
                    return true;
                }
            }
            if (x == 9) {
                if (this.field[9][y - 1] != color && this.field[9][y + 1] != color) {
                    this.field[9][y] = color;
                    return true;
                }
            }
            if (y == 0) {
                if (this.field[x - 1][0] != color && this.field[x + 1][0] != color) {
                    this.field[x][0] = color;
                    return true;
                }
            }
            if (y == 9) {
                if (this.field[x - 1][9] != color && this.field[x + 1][9] != color) {
                    this.field[x][9] = color;
                    return true;
                }
            }
        }
        return false;
    }

    this.makeTurn = function (stones, destination) {

        //ob alle Steine, die bewegt werden sollen die gleiche Farbe haben
        if (!this.sameColor(stones)) {
            return false;
        }

        //ist der Zug erlaubt?
        if (!this.checkTurn(stones, destination)) {
            return false;
        }

        //Zug machen
        if (!this.setTurn(stones, destination)) {
            return false;
        }

        //alles gut gelaufen... zug wurde gemacht
        return this.moves;
    }

    this.setTurn = function (stones, destination) {
        this.moves = null;
        this.moves = [];

        //Farbe des Gegners bestimmen
        var colorOpp = 0;
        if (stones[0].getColor() == 1) {
            colorOpp = 2;
        } else {
            colorOpp = 1;
        }


        var x = this.getLength(stones);
        var y = this.getHeight(stones);

        //Steine von Position loeschen
        for (var i = 0; i < stones.length; i++) {
            this.field[stones[i].getX()][stones[i].getY()] = 0;
            this.moves.push(new Move(stones[i], new Destination(0, 0)));
        }


        //Gegnerische Steine neu positionieren
        var direction = this.direction(stones, destination);
        switch (direction) {
        case 0:
            for (var i = 0; i <= destination.getX() - stones[0].getX(); i++) {
                for (var j = 0; j < y + 1; j++) {
                    if (this.field[stones[0].getX() + x + i][stones[0].getY() + j] == colorOpp) {
                        this.field[destination.getX() + x + i][destination.getY() + j] = colorOpp;
                        this.field[stones[0].getX() + x + i][stones[0].getY() + j] = 0;
                        this.moves.push(new Move(new Stone(colorOpp, stones[0].getX() + x + i, stones[0].getY() + j), new Destination(destination.getX() + x + i, destination.getY() + j)));
                    }
                }
            }
            break;
        case 1:
            var lengthOpp = 0;
            var k = stones[0].getX();
            for (var j = 0; j < y + 1; j++) {
                var b = 0;
                try {
                    while (this.field[k - b - 1][stones[0].getY() + j] == colorOpp) {
                        b++;
                    }
                } catch (e) {
                    break;
                }
                if (b > lengthOpp) {
                    lengthOpp = b;
                }
            }

            for (var i = 0; i <= lengthOpp; i++) {
                for (var j = 0; j < y + 1; j++) {
                    if (this.field[stones[0].getX() - i][stones[0].getY() + j] == colorOpp) {
                        this.field[destination.getX() - i][destination.getY() + j] = colorOpp;
                        this.field[stones[0].getX() - i][stones[0].getY() + j] = 0;
                        this.moves.push(new Move(new Stone(colorOpp, stones[0].getX() - i, stones[0].getY() + j), new Destination(destination.getX() - i, destination.getY() + j)));
                    }
                }
            }
            break;
        case 2:
            //laenge der gegnerischen Steine ermitteln
            var lengthOpp = 0;
            var k = stones[0].getY() + y + 1;
            for (var j = 0; j < x + 1; j++) {
                var b = 0;
                try {
                    while (this.field[stones[0].getX() + j][k + b] == colorOpp) {
                        b++;
                    }
                } catch (e) {
                    console.error("TRYCATCH1");
                    break;
                }
                if (b > lengthOpp) {
                    lengthOpp = b;
                }
            }
            for (var i = 0; i <= destination.getY() - stones[0].getY(); i++) {
                for (var j = 0; j < x + 1; j++) {
                    if (this.field[stones[0].getX() + j][stones[0].getY() + y + i] == colorOpp) {
                        this.field[destination.getX() + j][destination.getY() + y + i] = colorOpp;
                        this.field[stones[0].getX() + j][stones[0].getY() + y + i] = 0;
                        this.moves.push(new Move(new Stone(colorOpp, stones[0].getX() + j, stones[0].getY() + y + i), new Destination(destination.getX() + j, destination.getY() + y + i)));
                    }
                }
            }

            break;
        case 3:
            //laenge der gegnerischen Steine ermitteln
            var lengthOpp = 0;
            var k = stones[0].getY();
            for (var j = 0; j < x + 1; j++) {
                var b = 0;
                try {
                    while (this.field[stones[0].getX() + j][k - b - 1] == colorOpp) {
                        b++;
                    }
                } catch (e) {
                    console.error("TRYCATCH4");
                    break;
                }
                if (b > lengthOpp) {
                    lengthOpp = b;
                }
            }



            for (var i = 0; i <= lengthOpp; i++) {
                for (var j = 0; j < x + 1; j++) {
                    if (this.field[stones[0].getX() + j][stones[0].getY() - i] == colorOpp) {
                        this.field[destination.getX() + j][destination.getY() - i] = colorOpp;
                        this.field[stones[0].getX() + j][stones[0].getY() - i] = 0;
                        this.moves.push(new Move(new Stone(colorOpp, stones[0].getX() + j, stones[0].getY() - i), new Destination(destination.getX() + j, destination.getY() - i)));
                    }
                }
            }

            break;
        }

        //Steine neu positionieren
        var counter = 0;
        for (var i = 0; i <= x; i++) {
            for (var j = 0; j <= y; j++) {
                this.field[destination.getX() + i][destination.getY() + j] = stones[i].getColor();
                this.moves[counter].setDestination(new Destination(destination.getX() + i, destination.getY() + j));
                counter++;
            }
        }

        return true;

    }

    this.direction = function (stones, destination) {
        var direction = 0;


        if (destination.getX() != stones[0].getX() && destination.getY() != stones[0].getY()) {
            //diagonal
            return 4;
        }

        if (destination.getX() != stones[0].getX()) {
            if (destination.getX() - stones[0].getX() > 0) {
                //rechts
                return 0;
            } else {
                //links
                return 1;
            }
        } else {
            if (destination.getY() - stones[0].getY() > 0) {
                //unten
                return 2;
            } else {
                //oben
                return 3;
            }
        }

        return direction;
    }

    this.sameColor = function (stones) {
        var color = stones[0].getColor();
        for (var i = 0; i < stones.length; i++) {
            if (stones[i].color != color) {
                return false;
            }
        }
        return true;
    }

    this.checkTurn = function (stones, destination) {

        //alle moeglichen Zuege berechnen
        var possTurns = this.possibleTurns(stones);


        //ist Destination in einem der moeglichen Zuege dabei?
        if (destination != null && possTurns != false) {
            if (possTurns[destination.getX()][destination.getY()] == 1) {
                return true;
            } else {
                return false;
            }
        }
        return false;


    }

    this.getLength = function (stones) {
        //Breite der selektieren Steine rausfinden
        var highestX = stones[0].getX();
        var lowestX = stones[0].getX();

        for (var i = 0; i < stones.length; i++) {
            if (stones[i].getX() > highestX) {
                highestX = stones[i].getX();
            }
            if (stones[i].getX() < lowestX) {
                lowestX = stones[i].getX();
            }
        }

        return highestX - lowestX;
    }
    this.getHeight = function (stones) {
        //Hoehe der selektierten Steine rausfinden
        var highestY = stones[0].getY();
        var lowestY = stones[0].getY();

        for (var i = 0; i < stones.length; i++) {
            if (stones[i].getY() > highestY) {
                highestY = stones[i].getY();
            }
            if (stones[i].getY() < lowestY) {
                lowestY = stones[i].getY();
            }
        }

        return highestY - lowestY;
    }

    this.possibleTurns = function (stones) {
        var possTurns = [];

        if (!this.sameColor(stones)) {
            return false;
        }


        var x = this.getLength(stones) + 1;
        var y = this.getHeight(stones) + 1;

        //ob die selektierten Steine ueberhaupt eine Figur sind, die man bewegen darf
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                if (this.field[stones[0].getX() + i][stones[0].getY() + j] != stones[0].getColor()) {
                    return false;
                }
            }
        }

        if (x == y) {
            //block          

            possTurns = this.possibleTurnsHorizontal(stones, x, y);
            var possTurns2 = this.possibleTurnsVertical(stones, x, y);
            //Arrays zusammenbringen
            for (var i = 0; i < possTurns2.length; i++) {
                for (var j = 0; j < possTurns2[i].length; j++) {
                    if (possTurns2[i][j] > 0) {
                        possTurns[i][j] = possTurns2[i][j];
                    }
                }
            }

            if (stones.length == 1 && ((stones[0].getX() == 0 && stones[0].getY() == 0) || (stones[0].getX() == 0 && stones[0].getY() == 9) ||
                (stones[0].getX() == 9 && stones[0].getY() == 0) || (stones[0].getX() == 9 && stones[0].getY() == 9))) {
                //Diagonal
                var possTurns3 = this.possibleTurnsDiagonal(stones, x, y);
                //Arrays zusammenbringen
                for (var i = 0; i < possTurns3.length; i++) {
                    for (var j = 0; j < possTurns3[i].length; j++) {
                        if (possTurns3[i][j] > 0) {
                            possTurns[i][j] = possTurns3[i][j];
                        }
                    }
                }
            }

        } else if (x > y) {
            //horizontal
            possTurns = this.possibleTurnsHorizontal(stones, x, y);

        } else if (x < y) {
            //vertikal
            possTurns = this.possibleTurnsVertical(stones, x, y);
        }

        return possTurns;

    }

    this.possibleTurnsHorizontal = function (stones, x, y) {
        //Berechnet alle moeglichen Zuege fuer eine horizontale Schlange
        var possTurns = [];
        var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < 10; i++) {
            possTurns[i] = JSON.parse(JSON.stringify(temp));
        }


        //Farbe des Gegners bestimmen
        var colorOpp = 0;
        if (stones[0].getColor() == 1) {
            colorOpp = 2;
        } else {
            colorOpp = 1;
        }

        //nach rechts abpruefen
        try {
            //Ob man direkt vor einem Gegner steht
            var nextToOpp = false;
            for (var i = 0; i < y; i++) {
                if (this.field[stones[0].getX() + x][stones[0].getY() + i] == colorOpp) {
                    nextToOpp = true;
                }
                if (this.field[stones[0].getX() + x][stones[0].getY() + i] == stones[0].getColor() || this.field[stones[0].getX() + x][stones[0].getY() + i] == 3) {
                    nextToOpp = false;
                    break;
                }
            }
            if (nextToOpp) {

                //laenge der gegnerischen Steine ermitteln
                var lengthOpp = 1;
                var k = stones[0].getX() + x;
                for (var j = 0; j < y; j++) {
                    var b = 1;
                    try {
                        while (this.field[k + b][stones[0].getY() + j] == colorOpp) {
                            b++;
                        }
                    } catch (e) {
                        break;
                    }
                    if (b > lengthOpp) {
                        lengthOpp = b;
                    }
                }
                //darf man den wegschieben?
                if (lengthOpp < x) {
                    for (var i = 0; i < this.field.length - stones[0].getX() - x; i++) {
                        //ist ein Hindernis im Weg?
                        var a = false;
                        for (var j = 0; j < y; j++) {
                            try {
                                if (this.field[stones[0].getX() + i + x + lengthOpp][stones[0].getY() + j] != 0) {
                                    a = true;
                                }
                            } catch (e) {
                                a = true;
                            }
                        }
                        //Felder als moeglich kennzeichnen
                        if (a == false) {
                            possTurns[stones[0].getX() + i + 1][stones[0].getY()] = 1;

                        } else {
                            break;
                        }
                    }

                }
            } else {
                for (var i = 0; i < this.field.length - stones[0].getX() - x; i++) {
                    //ist ein Hindernis im Weg?
                    var a = false;
                    for (var j = 0; j < y; j++) {
                        if (this.field[stones[0].getX() + i + x][stones[0].getY() + j] != 0) {
                            a = true;
                        }
                    }
                    //Felder als moeglich kennzeichnen
                    if (a == false) {
                        //for (var j = 0; j < x; j++) {
                        //    for (var k = 0; k < y; k++) {
                        //        possTurns[stones[0].getX() + i + 1 + j][stones[0].getY() + k] = 2;
                        //    }
                        //}
                        possTurns[stones[0].getX() + i + 1][stones[0].getY()] = 1;
                    } else {
                        break;
                    }

                }
            }
        } catch (e) {}

        //nach links abpruefen

        //Ob man direkt vor einem Gegner steht
        try {

            var nextToOpp = false;
            for (var i = 0; i < y; i++) {
                if (this.field[stones[0].getX() - 1][stones[0].getY() + i] == colorOpp) {
                    nextToOpp = true;
                }
                if (this.field[stones[0].getX() - 1][stones[0].getY() + i] == stones[0].getColor() || this.field[stones[0].getX() - 1][stones[0].getY() + i] == 3) {
                    nextToOpp = false;
                    break;
                }
            }
            if (nextToOpp) {

                //laenge der gegnerischen Steine ermitteln
                var lengthOpp = 1;
                var k = stones[0].getX();
                for (var j = 0; j < y; j++) {
                    var b = 1;
                    try {
                        while (this.field[k - b - 1][stones[0].getY() + j] == colorOpp) {
                            b++;
                        }
                    } catch (e) {
                        break;
                    }
                    if (b > lengthOpp) {
                        lengthOpp = b;
                    }
                }
                //darf man den wegschieben?
                if (lengthOpp < x) {
                    for (var i = 1; i <= stones[0].getX(); i++) {
                        //ist ein Hindernis im Weg?
                        var a = false;
                        for (var j = 0; j < y; j++) {
                            try {
                                if (this.field[stones[0].getX() - lengthOpp - i][stones[0].getY() + j] != 0) {
                                    a = true;
                                }
                            } catch (e) {
                                a = true;
                            }
                        }
                        //Felder als moeglich kennzeichnen
                        if (a == false) {
                            possTurns[stones[0].getX() - i][stones[0].getY()] = 1;
                        } else {
                            break;
                        }
                    }
                }
            } else {
                for (var i = 1; i <= stones[0].getX(); i++) {
                    //ist ein Hindernis im Weg?
                    var a = false;
                    for (var j = 0; j < y; j++) {

                        if (this.field[stones[0].getX() - i][stones[0].getY() + j] > 0) {
                            a = true;
                        }
                    }
                    //Felder als moeglich kennzeichnen
                    if (a == false) {
                        //for (var k = 0; k < y; k++) {
                        //    possTurns[stones[0].getX() - i][stones[0].getY() + k] = 2;
                        //}
                        possTurns[stones[0].getX() - i][stones[0].getY()] = 1;
                    } else {
                        break;
                    }

                }
            }
        } catch (e) {

        }


        return possTurns;
    }
    this.possibleTurnsVertical = function (stones, x, y) {
        //alle moeglichen Zuege fuer eine vertikale Schlange berechnen
        var possTurns = [];
        var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < 10; i++) {
            possTurns[i] = JSON.parse(JSON.stringify(temp));
        }

        //Farbe des Gegners bestimmen
        var colorOpp = 0;
        if (stones[0].getColor() == 1) {
            colorOpp = 2;
        } else {
            colorOpp = 1;
        }

        //nach unten abpruefen

        //Ob man direkt vor einem Gegner steht
        try {
            var nextToOpp = false;
            for (var i = 0; i < x; i++) {
                if (this.field[stones[0].getX() + i][stones[0].getY() + y] == colorOpp) {
                    nextToOpp = true;
                }
                if (this.field[stones[0].getX() + i][stones[0].getY() + y] == stones[0].getColor() || this.field[stones[0].getX() + i][stones[0].getY() + y] == 3) {
                    nextToOpp = false;
                    break;
                }
            }
            if (nextToOpp) {
                //laenge der gegnerischen Steine ermitteln
                var lengthOpp = 1;
                var k = stones[0].getY() + y;
                for (var j = 0; j < x; j++) {
                    var b = 1;
                    try {
                        while (this.field[stones[0].getX() + j][k + b] == colorOpp) {
                            b++;
                        }
                    } catch (e) {
                        console.error("TRYCATCH1");
                        break;
                    }
                    if (b > lengthOpp) {
                        lengthOpp = b;
                    }
                }

                if (lengthOpp < y) {
                    for (var i = 0; i < this.field[0].length - stones[0].getY() - y; i++) {
                        //ist ein Hindernis im Weg?
                        var a = false;
                        for (var j = 0; j < x; j++) {
                            try {
                                if (this.field[stones[0].getX() + j][stones[0].getY() + i + y + lengthOpp] != 0) {
                                    a = true;
                                }
                            } catch (e) {
                                console.error("TRYCATCH2");
                                a = true;
                            }
                        }
                        //Felder als moeglich kennzeichnen
                        if (a == false) {
                            possTurns[stones[0].getX()][stones[0].getY() + i + 1] = 1;
                        } else {
                            break;
                        }
                    }

                }

            } else {
                for (var i = 0; i < this.field[0].length - stones[0].getY() - y; i++) {
                    //ist ein Hindernis im Weg?
                    var a = false;
                    for (var j = 0; j < x; j++) {
                        if (this.field[stones[0].getX() + j][stones[0].getY() + i + y] != 0) {
                            a = true;
                        }
                    }
                    //Felder als moeglich kennzeichnen
                    if (a == false) {
                        possTurns[stones[0].getX()][stones[0].getY() + i + 1] = 1;
                    } else {
                        break;
                    }

                }
            }
        } catch (e) {
            console.error("TRYCATCH3");
        }

        //nach oben abpruefen

        try {
            //Ob man direkt vor einem Gegner steht
            var nextToOpp = false;
            for (var i = 0; i < x; i++) {
                if (this.field[stones[0].getX() + i][stones[0].getY() - 1] == colorOpp) {
                    nextToOpp = true;
                }
                if (this.field[stones[0].getX() + i][stones[0].getY() - 1] == stones[0].getColor() || this.field[stones[0].getX() + i][stones[0].getY() - 1] == 3) {
                    nextToOpp = false;
                    break;
                }
            }
            if (nextToOpp) {
                //laenge der gegnerischen Steine ermitteln
                var lengthOpp = 1;
                var k = stones[0].getY();
                for (var j = 0; j < x; j++) {
                    var b = 1;
                    try {
                        while (this.field[stones[0].getX() + j][k - b - 1] == colorOpp) {
                            b++;
                        }
                    } catch (e) {
                        console.error("TRYCATCH4");
                        break;
                    }
                    if (b > lengthOpp) {
                        lengthOpp = b;
                    }
                }
                //darf man den wegschieben?
                if (lengthOpp < y) {
                    for (var i = 1; i <= stones[0].getY(); i++) {
                        //ist ein Hindernis im Weg?
                        var a = false;
                        for (var j = 0; j < x; j++) {
                            try {
                                if (this.field[stones[0].getX() + j][stones[0].getY() - lengthOpp - i] != 0) {
                                    a = true;
                                }
                            } catch (e) {
                                console.error("TRYCATCH5");
                                a = true;
                            }
                        }
                        //Felder als moeglich kennzeichnen
                        if (a == false) {
                            possTurns[stones[0].getX()][stones[0].getY() - i] = 1;
                        } else {
                            break;
                        }
                    }
                }
            } else {
                for (var i = 1; i <= stones[0].getY(); i++) {
                    //ist ein Hindernis im Weg?
                    var a = false;
                    for (var j = 0; j < x; j++) {
                        if (this.field[stones[0].getX() + j][stones[0].getY() - i] != 0) {
                            a = true;
                        }
                    }
                    //Felder als moeglich kennzeichnen
                    if (a == false) {
                        possTurns[stones[0].getX()][stones[0].getY() - i] = 1;
                    } else {
                        break;
                    }

                }
            }
        } catch (e) {
            console.error("TRYCATCH6");
        }


        return possTurns;
    }

    this.possibleTurnsDiagonal = function (stones, x, y) {
        //alle moeglichen Zuege fuer ein Diagonal verschiebbaren Stein berechnen
        var possTurns = [];
        var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < 10; i++) {
            possTurns[i] = JSON.parse(JSON.stringify(temp));
        }

        //Ecken bestimmen
        if (stones[0].getX() == 0 && stones[0].getY() == 0) {
            //oben links
            for (var i = 1; i < this.field.length; i++) {
                if (this.field[i][i] == 0) {
                    possTurns[i][i] = 1;
                } else {
                    break;
                }
            }
        } else if (stones[0].getX() == this.field.length - 1 && stones[0].getY() == 0) {
            //oben rechts
            for (var i = this.field.length - 1; i > 0; i--) {
                if (this.field[i - 1][this.field.length - i] == 0) {
                    possTurns[i - 1][this.field.length - i] = 1;
                } else {

                    break;
                }
            }
        } else if (stones[0].getX() == 0 && stones[0].getY() == this.field.length - 1) {
            //unten links
            for (var i = 1; i < this.field.length; i++) {
                if (this.field[i][this.field.length - i - 1] == 0) {
                    possTurns[i][this.field.length - i - 1] = 1;
                } else {
                    break;
                }
            }
        } else if (stones[0].getX() == this.field.length - 1 && stones[0].getY() == this.field.length - 1) {
            //unten rechts
            for (var i = this.field.length - 2; i >= 0; i--) {
                if (this.field[i][i] == 0) {
                    possTurns[i][i] = 1;
                } else {
                    break;
                }
            }
        }

        return possTurns;

    }

    this.won = function (player) {

        //Existiert die Figur auf dem Feld?
        for (var i = 1; i < this.field.length - 1; i++) {
            for (var j = 1; j < this.field[i].length - 1; j++) {
                var a = true;
                for (var k = 0; k < this.figur.length; k++) {
                    for (var k2 = 0; k2 < this.figur[k].length; k2++) {

                        try {
                            if (parseInt(i) + k > this.field.length - 2 || parseInt(j) + k2 > this.field[i].length - 2) {
                                a = false;
                                break;
                            }
                            if (this.figur[k][k2] == 2 && this.field[parseInt(i) + k][parseInt(j) + k2] / player == 1) {
                                a = false;
                                break;
                            }
                            if (this.figur[k][k2] == 1 && this.field[parseInt(i) + k][parseInt(j) + k2] / player != this.figur[k][k2]) {
                                a = false;
                                break;
                            }
                        } catch (e) {
                            a = false;
                        }
                    }
                    if (!a) {
                        break;
                    }
                }
                if (a) {
                    return true;
                }
            }
        }


        for (var i = 1; i < this.field.length - 1; i++) {
            for (var j = 1; j < this.field[i].length - 1; j++) {
                var a = true;
                for (var k = 0; k < this.figur90.length; k++) {
                    for (var k2 = 0; k2 < this.figur90[k].length; k2++) {

                        try {
                            if (parseInt(i) + k > this.field.length - 2 || parseInt(j) + k2 > this.field[i].length - 2) {
                                a = false;
                                break;
                            }
                            if (this.figur90[k][k2] == 2 && this.field[parseInt(i) + k][parseInt(j) + k2] / player == 1) {
                                a = false;
                                break;
                            }
                            if (this.figur90[k][k2] == 1 && this.field[parseInt(i) + k][parseInt(j) + k2] / player != this.figur90[k][k2]) {
                                a = false;
                                break;
                            }
                        } catch (e) {
                            a = false;
                        }
                    }
                    if (!a) {
                        break;
                    }
                }
                if (a) {
                    return true;
                }
            }
        }

    }
    this.returnTurn = function (moves) {
        //letzten Zug rueckgaengig machen
        for (i in moves) {
            var move = moves[i];
            var x = move.getDestination().getX();
            var y = move.getDestination().getY();

            this.field[x][y] = 0;
        }
        for (i in moves) {
            var move = moves[i];

            var x = move.getStone().getX();
            var y = move.getStone().getY();

            this.field[x][y] = move.getStone().getColor();
        }

    }

    //Die Figur fuer das aktuelle Spiel setzen
    if (typeof figur === "string") {
        this.setFigur(figur);
    } else {
        var a = Math.round(Math.random() * 14);
        this.figur = this.figurenInt[a];
        this.figur90 = this.figurenInt90[a];

    }
    var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < 10; i++) {
        this.field[i] = JSON.parse(JSON.stringify(temp));
    }
}