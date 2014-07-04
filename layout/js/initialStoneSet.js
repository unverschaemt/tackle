var setField = function (newField, move) {
    
    if (move) {
        animate(move, newField);
    } else {
        setFieldClasses(newField);
    }
}

function setFieldClasses(newField){
    var a = ["", "player1", "player2", "gold"];
        for (i in newField) {
        for (j in newField[i]) {
            var classList = field[i][j].classList;
            //TODO Animations einbinden
            classList.remove("player1");
            classList.remove("player2");
            classList.remove("gold");
            if (newField[i][j] > 0) {
                classList.add(a[newField[i][j]]);
            }
        }
    }
}