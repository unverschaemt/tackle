
function Test (){

    var field = [];
    var y = [0,0,0,0,0,0,0,0,0,0];
    
    for (var i = 0; i < 10; i++) {
        field[i] = JSON.parse(JSON.stringify(y));
    }

    var t = new Tackle("Turm3");

    //field[0][2] = 1;
    //field[9][5] = 1;
    //field[5][0] = 1;
    //field[3][9] = 1;
    //field[0][0] = 1;
    
    //field[0][5] = 2;
    //field[9][4] = 2;
    //field[7][0] = 2;
    //field[4][9] = 2;
    //field[9][0] = 2;
    
    //field[5][5] = 3;


    t.setField(field);
    
    var stones = [];
    stones.push(new Stone(1, 3, 5));

    var destination = new Destination(7,4);
    
    //var o = t.possibleTurns(stones);
    
    //console.log(o);
    
    //for(i in o){
     //   var l = "";
    //    for(j in o[i]){
     //       l += o[j][i]+" ";
     //   }
        //console.log(i+": "+l);
   // }
//		
		//t.makeTurn(stones, destination);
		//t.returnTurn();
//		
//		field = t.getField();
//		
//		for (int i = 0; i < field.length; i++) {
//			for (int j = 0; j < field[i].length; j++) {
//				System.out.print(field[j][i] + " ; ");
//			}
//			System.out.println();
//		}
    
    var opp = new Opponent(1, "Turm3");
    var opp2 = new Opponent(2, "Turm3");
    var m = null;
    
    for(var i=0; i<5; i++){
        t.setStone(opp.setStone(t.getField(), false));
        t.setStone(opp2.setStone(t.getField(), false));
    }
    t.setStone(opp2.setStone(t.getField(), true));
    
    
    debugger;
    
    var won = false;
    
    while(!won){
    
        m = opp.move(t.getField());
        t.makeTurn(m.getStones(), m.getDestination());
        if(t.won(1)){
            won = true;   
        }
        m = opp2.move(t.getField());
        t.makeTurn(m.getStones(), m.getDestination());
        
        if(t.won(2)){
            won = true;   
        }
        won = true;
    }
    
    

    //t.won(1);



}
