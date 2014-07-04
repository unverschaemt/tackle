var selectedStones = [];

function setPossibleTurns() {
    selectedStones = [];

    for (var i = 0; i < field.length; i++) {
        for (var j = 0; j < field[i].length; j++) {
            field[i][j].classList.remove("possibleTurns");
        }
    }

    if (selection.length > 0 && (selection[0].classList.contains("player1") || selection[0].classList.contains("player2"))) {

        //nur obersten linkesten einfügen und dann rauslöschen
        var selectionNew = [];
        while (selection.length > 0) {
            var minX = selection[0].cellIndex;
            var minY = selection[0].parentNode.rowIndex;

            for (j in selection) {
                var i = selection[j];
                if (i.cellIndex <= minX && i.parentNode.rowIndex <= minY) {
                    minX = i.cellIndex;
                    minY = i.parentNode.rowIndex;
                }
            }

            for (j in selection) {
                var i = selection[j];
                if (i.cellIndex == minX && i.parentNode.rowIndex == minY) {
                    var color = 0;
                    if (i.classList.contains("player1")) {
                        color = 1;
                    }
                    if (i.classList.contains("player2")) {
                        color = 2;
                    }
                    selectedStones.push(new Stone(color, i.cellIndex, i.parentNode.rowIndex));
                    selectionNew.push(i);
                    selection.splice(j, 1);
                    break;
                }
            }
        }


        while (selectionNew.length > 0) {
            selection.push(selectionNew[0]);
            selectionNew.splice(0, 1);
        }


        var possTurns = tackleMain.tackleGame.possibleTurns(selectedStones);
        if (possTurns == false) {
            for (var i = 0; i < field.length; i++) {
                for (var j = 0; j < field[i].length; j++) {

                    field[i][j].classList.remove("possibleTurns");

                }
            }

        } else {

            for (var i = 0; i < possTurns.length; i++) {
                for (var j = 0; j < possTurns[i].length; j++) {
                    if (possTurns[i][j] > 0) {
                        field[i][j].classList.add("possibleTurns");
                    } else {
                        field[i][j].classList.remove("possibleTurns");
                    }
                }
            }
        }

    }
}