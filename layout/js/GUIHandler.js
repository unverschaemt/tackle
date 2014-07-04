var state = 0;
var attackUserName = "";
var developerScroll = false;
var kiGame = false;


function login() {
    var userName = document.getElementById('textbox').value;
    console.log(userName);
    if (userName != "" && userName != undefined) {
        switch (userName) {
        case "error123":
            document.getElementById("errorbutton").style.display = "block";
            break;
        case "_scroll":
            _scroll();
            break;
        default:
            tackleMain.login(userName);
            document.getElementById('wrapper').focus();
            document.getElementById('textbox').blur();
            document.getElementById("welcomeUser").innerHTML = "Hallo, <b>" + tackleMain.tc.username + "</b>";
            break;
        }
    } else {
        alert("Wähle bitte einen Namen.");
    }
}

function acceptGame() {
    tackleMain.uiAcceptRequest(true);
}


function cancelGame() {
    tackleMain.uiAcceptRequest(false);
    scrollPage(1);
}

function _scroll() {
    login
    //document.getElementById("wrapper").style.overflow = "scroll";
    developerScroll = true;
    document.getElementById("login").style.background = "#62a25a";
    //alert("Scroll geht jetzt mit Pfeiltasten Hoch/Runter! #läuft");
}

function setUserlist(list) {
    var temp = "";
    for (i in list) {
        var name = list[i].name;
        var vname = name;
        vname = vname.replace(/Ã¼/, "&uuml;");
        vname = vname.replace(/Ã¤/, "&auml;");
        vname = vname.replace(/Ã¶/, "&ouml;");
        vname = vname.replace(/Ã/, "&szlig;");
        var names = "choosePlayer();setAttacker('" + name + "')";
        temp += '<li onclick="' + names + '">' + vname + '</li>';
    }
    document.getElementById('battleUserlist').innerHTML = temp;
}

function setAttacker(name) {
    attackUserName = name;
}

function setFirstPlayer(x) {
    if (x) {
        document.getElementById('playerInGame').className = "player1";
    } else {
        document.getElementById('playerInGame').className = "player2";
    }
}

function choosePlayer(ki) {
    //tackleMain.attackUserName(attackUserName);
    kiGame = ki || false;
    scrollPage(2);
}

function sendChat() {
    var temp = document.getElementById('chat').value;
    document.getElementById('chat').value = "";
    if (temp == "") {
        alert(tra.pleaseText);
    } else {
        gameChat(temp, true);
        tackleMain.tackleGame.sendChat(temp);
    }
}

function gameChat(text, own) {
    if (tackleMain.tackleGame.getOwnColor() == "player1") {
        var ownC = "#a66bbc";
        var othC = "#5aa28b";
    } else {
        var ownC = "#5aa28b";
        var othC = "#a66bbc";
    }
    if (own) {
        var c = ownC;
        text = "[Du] " + text;
    } else {
        var c = othC;
        text = "[Gegner] " + text;
    }
    c = "color: " + c + "; font-weight: 900;";
    var url = "layout/graphic/smiles/";
    var smiles = [":P", ":D", "<3", ":*", ";)", "8)", ":)", ":(", "^^", "ichhassejsp"];
    var smilesAlternative = [":-P", ":-D", "<3", ":-*", ";-)", "8-)", ":-)", ":-(", "^^", "ichhassejsp"];
    var smilesImages = ["10.png", "7.png", "3.png", "5.png", "4.png", "9.png", "12.png", "13.png", "14.png", "jspistsorichtigschlecht.gif"];
    for (var i = 0; i < smiles.length; ++i) {
        while (text.indexOf(smiles[i]) > -1) {
            text = text.replace(smiles[i], '<img src="' + url + smilesImages[i] + '">')
        }
        while (text.indexOf(smilesAlternative[i]) > -1) {
            text = text.replace(smilesAlternative[i], '<img src="' + url + smilesImages[i] + '">');
        }
    }
    gameLog('<span style="' + c + '">' + text + '</span>', true);
};

function chooseForm(that) {
    var form = that.childNodes[0].nextSibling.src.split("/").pop().split(".")[0];
    form = form[0].toUpperCase() + form.substr(1);
    //var form = "Turm3";
    var beginn = (Math.random() * 2) > 1;
    if (!kiGame) {
        tackleMain.attackUserName(attackUserName, form, beginn);
    } else {
        kiGame = false;
        tackleMain.kigame(form, beginn);
    }
    //setFirstPlayer(beginn);
    setGameMode(form.toLowerCase());
}

function attackedSelf(arr) {
    scrollPage(4);
    document.getElementById('attackByUser').innerHTML = '<b style="font-size: 30pt">' + arr[0] + '</b> im Spielmodus <b style="font-size: 30pt">' + arr[1] + "</b>";
    setGameMode(arr[1].toLowerCase());
    //setFirstPlayer(arr[2]);
};

function gameLog(text, ownMessage) {
    document.getElementById('log').innerHTML = (ownMessage ? "" : ">> ") + text + "<br>" + document.getElementById('log').innerHTML;
};

function setGameMode(fig) {
    document.getElementById('gameMode').src = "layout/graphic/figuren/" + fig + ".png";
};

function scrollPage(newState) {
    console.log("SET PAGE TO STATE " + newState + " OLD " + state);
    setScrollPosition(newState);
    //0=login, 1=dashboard, 2=setform, 3=pleasewait, 4=attacked, 5=game, 6=error
    /*scrollHeight = document.getElementById("login").clientHeight;
    document.getElementById("wrapper").style.overflow = 'scroll';
    var d = Math.round(Math.abs(newState - state));
    if (d == 0) {
        d = 1;
    }
    if (newState > state) {
        for (var i = 0; i < (scrollHeight * (newState - state)) / d; i++) {
            setTimeout('document.getElementById("wrapper").scrollTop+=' + d, i);
            var max = i;
        }
    }
    if (newState < state) {
        for (var i = 0; i < (scrollHeight * (state - newState)) / d; i++) {
            setTimeout('document.getElementById("wrapper").scrollTop-=' + d, i);
            var max = i;
        }
    }
    
    setTimeout('document.getElementById("wrapper").style.overflow = "hidden";', max + 10);
    if (newState == 6) {
        setTimeout('document.getElementById("mp3").play();', 1000);
    }*/
    state = newState;
}

function setScrollPosition(page) {
    if (page == -1) {
        page = 0;
        setTimeout('document.getElementById("impreBack").style.display = "block";', 1000);
        document.getElementById('impre').style.height = "100%";
    } else {
        document.getElementById('impre').style.height = "0%";
        document.getElementById("impreBack").style.display = "none";
    }
    document.getElementById("wrapper").style.marginTop = "-" + page * document.getElementById("login").clientHeight + "px";
    if (page == 7) {
        setTimeout('document.getElementById("mp3").play();', 1000);
    }
}

function resetScrollPosition() {
    setScrollPosition(state);
}

var commandpressed = false;

function onKeyDown(e) {
    console.log(e.keyCode);
    if (e.keyCode == 93) {
        commandpressed = true;
    }
    switch (e.keyCode) {
    case 38: // Pfeil hoch
        if (developerScroll) {
            if (state > -1) {
                state--;
                resetScrollPosition();
            }
        }
        break;
    case 40: // Pfeil runter
        if (developerScroll) {
            if (state < 7) {
                state++;
                resetScrollPosition();
            }
        }
        break;
    case 220:
        if (commandpressed) {
            _scroll();
        }
        break;
    }
}

function onKeyUp(e) {
    if (e.keyCode == 93) {
        commandpressed = false;
    }
}

function setGoldStoneHighlight() {
    for (var i = 3; i < 7; ++i) {
        for (var j = 3; j < 7; ++j) {
            field[i][j].classList.add("setGoldenStone");
        }
    }
}

function resetGoldStoneHighlight() {
    for (var i = 3; i < 7; ++i) {
        for (var j = 3; j < 7; ++j) {
            field[i][j].classList.remove("setGoldenStone");
        }
    }
}

function showPopup(won) {
    setTimeout('document.getElementById("popup").style.display = "inline-block";', 600);
    if (won) {
        setTimeout('document.getElementById("won").style.display = "inline-block";', 600);
    } else {
        setTimeout('document.getElementById("fail").style.display = "inline-block";', 600);

    }
}

function clearLog() {
    document.getElementById('log').innerHTML = "";
}

function closePopup() {
    document.getElementById('popup').style.display = "none";
    document.getElementById('fail').style.display = "none";
    document.getElementById('won').style.display = "none";
    tackleMain.uiExitGame();
}
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;

window.onresize = resetScrollPosition;
var setTurnPlayertime;

function setPlayerTurn(yourTurn) { 
    if (document.getElementById('playerInGame').classList.contains("player1")) {
        var ownC = "#a66bbc";
    } else {
        var ownC = "#5aa28b";
    }
    document.getElementById('playerTurn').style.color = ownC;
    if (!yourTurn) {
        setTurnPlayertime = setTimeout('document.getElementById("gamePanel").classList.add("enemyTurn")', 600);
         setTimeout('document.getElementById("playerTurn").style.color = "white"', 600);
    } else{
        //clearTimeout(setTurnPlayertime);
        if(tackleMain && tackleMain.tackleGame && tackleMain.tackleGame.p1id){
            setTimeout('document.getElementById("gamePanel").classList.remove("enemyTurn")', 0);
        } else {
            setTimeout('document.getElementById("gamePanel").classList.remove("enemyTurn")', 600);
        }
    }
}

var playmusicgo = true;

function startMusic(){
    if(playmusicgo){
        document.getElementById('getlucky').play();
        document.getElementById('soundshow').innerHTML = '<i class="fa fa-volume-up"></i>';
        document.getElementById('soundshow').className = 'soundButton';
    }
}

function stopMusic(){
    document.getElementById('getlucky').pause();
    document.getElementById('soundshow').innerHTML = '<i class="fa fa-volume-off"></i>';
        document.getElementById('soundshow').className = 'soundButtonOff';
}

function toggleSound(){
    if(!playmusicgo){
        playmusicgo = true;
        document.getElementById('getlucky').play();
        document.getElementById('soundshow').innerHTML = '<i class="fa fa-volume-up"></i>';
        document.getElementById('soundshow').className = 'soundButton';
    } else {
        playmusicgo = false;
        document.getElementById('getlucky').pause();
        document.getElementById('soundshow').innerHTML = '<i class="fa fa-volume-off"></i>';
        document.getElementById('soundshow').className = 'soundButtonOff';
    }
}