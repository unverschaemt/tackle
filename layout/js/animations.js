var animateList;
var animateField;

function animate(move, newField) {
    animateField = newField;
    var tempfield = JSON.parse(JSON.stringify(newField));
    //setFieldClasses(newField);
    animateList = createElements(move.length);
    for (i = 0; i < move.length; ++i) {
        var fromFieldX = move[i].stone.getX();
        var fromFieldY = move[i].stone.getY();
        var toFieldX = move[i].destination.getX();
        var toFieldY = move[i].destination.getY();
        if(tempfield[toFieldX][toFieldY] == 1){
            animateList[i].classList.add("player1");
        }
        if(tempfield[toFieldX][toFieldY] == 2){
            animateList[i].classList.add("player2");
        }
        tempfield[toFieldX][toFieldY] = 0;
        var pos = findPos(field[fromFieldX][fromFieldY]);
        animateList[i].style.top = pos[1]+1+"px";
        animateList[i].style.left = pos[0]+1+"px";
        //debugger;
    }
    setFieldClasses(tempfield);
    
    for (i = 0; i < move.length; ++i) {
        var toFieldX = move[i].destination.getX();
        var toFieldY = move[i].destination.getY();
        var pos = findPos(field[toFieldX][toFieldY]);
        animateList[i].classList.add("animationTran");
        animateList[i].style.top = pos[1]+1+"px";
        animateList[i].style.left = pos[0]+1+"px";
    }
    setTimeout(finishAnimate, 600);
}

function finishAnimate(){
    killElements(animateList);
    setFieldClasses(animateField);
};

function findPos(obj) {
    var curleft = 0;
    var curtop = 0;
    if(obj.offsetLeft) curleft += parseInt(obj.offsetLeft);
    if(obj.offsetTop) curtop += parseInt(obj.offsetTop);
    if(obj.scrollTop && obj.scrollTop > 0) curtop -= parseInt(obj.scrollTop);
    if(obj.offsetParent) {
        var pos = findPos(obj.offsetParent);
        curleft += pos[0];
        curtop += pos[1];
    } else if(obj.ownerDocument) {
        var thewindow = obj.ownerDocument.defaultView;
        if(!thewindow && obj.ownerDocument.parentWindow)
            thewindow = obj.ownerDocument.parentWindow;
        if(thewindow) {
            if(thewindow.frameElement) {
                var pos = findPos(thewindow.frameElement);
                curleft += pos[0];
                curtop += pos[1];
            }
        }
    }

    return [curleft,curtop];
}

function createElements(number){
    var list = [];
    for(var i = 0; i<number; i++){
        list[i] = document.createElement("div");
        list[i].className = "animationStone";
        document.getElementById('game').appendChild(list[i]);
    }
    return list;
}

function killElements(list){
    for(i in list){
        list[i].remove();
    }
}