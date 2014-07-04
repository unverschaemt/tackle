var field = [];
window.onload = function () {
    document.getElementById('textbox').focus(); 
    var field2 = [];
    var body = document.getElementById('table').childNodes[1];
    for (var i = 0; i < body.childNodes.length; i += 2) {
        field2[i / 2] = [];
        for (var j = 1; j < body.childNodes[i].childNodes.length; j += 2) {
            field2[i / 2][(j - 1) / 2] = body.childNodes[i].childNodes[j];
        }
    }

    //Array umdrehen
    for (var i = 0; i < field2.length; i++) {
        field[i] = [];
        for (var j = 0; j < field2[i].length; j++) {
            field[i][j] = field2[j][i];
        }

    }
}