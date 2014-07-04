//returns the (X,Y) coordinates of a specific cell
function showCoordinate(cell){
    var xCoordinate = cell.cellIndex;
    var yCoordinate = cell.parentNode.rowIndex;
    
    //change Range from 0-9 to 1-10
    ++xCoordinate;
    ++yCoordinate;
    
    //update coordinate-Label with new x,y coordinates
    var coordinateContainer = document.getElementById("coordinates");
    coordinateContainer.innerHTML = xCoordinate + " | " + yCoordinate;
    
    
    //coordinate-Label background coloration
    setCoordinateLabelBackgroundColorToCell(coordinateContainer, cell);
}

function setCoordinateLabelBackgroundColorToCell(label, cell){
   if (cell.classList.contains("player1")){
        label.style.backgroundColor = "#eddbf4"; 
    } else if (cell.classList.contains("player2")){
        label.style.backgroundColor = "#b5f0e8"; 
    } else {
        label.style.backgroundColor = "white"; 
    }
    if (cell.classList.contains("gold")){
        label.style.backgroundColor = "#edebae"; 
    }
}

function showCoordinateLabel(){
    var coordinateContainer = document.getElementById("coordinates");
    coordinateContainer.style.display = "inline-block";
}

function hideCoordinateLabel(){
    var coordinateContainer = document.getElementById("coordinates");
    coordinateContainer.style.display = "none";
}