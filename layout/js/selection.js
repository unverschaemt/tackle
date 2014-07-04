var selection = [];
var selectionControl = {};
selectionControl.first = {};

function select(event, cell) {
    if (!tackleMain.tackleGame.uiMakeTurnCheck) {
        tackleMain.tackleGame.uiSetStone(cell.cellIndex, cell.parentNode.rowIndex);
    } else {
        if (cell.classList.contains("possibleTurns")) {
            tackleMain.tackleGame.uiMakeTurn(selectedStones, new Destination(cell.cellIndex, cell.parentNode.rowIndex));
            setOldCellStyle();
            selection = [];
        } else {
            if (event.shiftKey) {
                if (cell.classList.contains(tackleMain.tackleGame.getOwnColor())) {
                    var sx = cell.cellIndex;
                    var sy = cell.parentNode.rowIndex;
                    var fx = selectionControl.first.x;
                    var fy = selectionControl.first.y;
                    if (sx > fx) {
                        var temp = sx;
                        sx = fx;
                        fx = temp;
                    }
                    if (sy > fy) {
                        var temp = sy;
                        sy = fy;
                        fy = temp;
                    }
                    var valid = true;
                    console.log("sx: " + sx + " sy: " + sy + " fx: " + fx + " fy: " + fy);
                    for (var i = sx; i <= fx; i++) {
                        for (var j = sy; j <= fy; j++) {
                            if (!field[i][j].classList.contains(tackleMain.tackleGame.getOwnColor())) {
                                valid = false;
                                break;
                            }
                        }
                    }
                    console.log("sx: " + sx + " sy: " + sy + " fx: " + fx + " fy: " + fy);
                    console.log("VALID: " + valid);
                    if (valid) {
                        var tempselection = [];
                        for (var i = sx; i <= fx; i++) {
                            for (var j = sy; j <= fy; j++) {
                                tempselection.push(field[i][j]);
                            }
                        }
                        setOldCellStyle();
                        selection = tempselection;
                    }
                    /*if (selection.indexOf(cell) == -1) {
                        selection.push(cell);
                    }*/
                }
            } else {
                if (cell.classList.contains(tackleMain.tackleGame.getOwnColor())) {
                    selectionControl.first.x = cell.cellIndex;
                    selectionControl.first.y = cell.parentNode.rowIndex;
                    setOldCellStyle();
                    selection = [];
                    selection.push(cell);
                } else {
                    setOldCellStyle();
                    selection = [];
                }
            }
        }
        setSelectionBackground();
        setPossibleTurns();
    }
}

function setSelectionBackground() {

    for (var i = 0; i < selection.length; ++i) {
        selection[i].style.backgroundImage = "url('layout/graphic/selected.png')";
    }
}

function setOldCellStyle() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            field[i][j].style.backgroundImage = "";
        }
    }
}