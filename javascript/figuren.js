var figuren = {};
figuren.figuren = ["Turm3", "Treppe3", "Turm4", "Treppe4", "Quadrat", "Bluete", "Turm5", "Treppe5", "Fuenf", "Turm6", "Block6", "Vogel", "Block8", "Brunnen", "Block9"]; 
	figuren.figurenInt = [];
    figuren.figurenInt90 = [];
	
	
		//Figuren erzeugen
		
		//Turm3
		figuren.figurenInt[0] =  [[1],[1],[1]];
        figuren.figurenInt90[0] = [[1,1,1]];

		
		//Treppe3
		figuren.figurenInt[1] = [[0,0,1],[0,1,0],[1,0,0]];
        figuren.figurenInt90[1] = [[1,0,0],[0,1,0],[0,0,1]];
		
		//Turm4
		figuren.figurenInt[2] = [[1],[1],[1], [1]];
        figuren.figurenInt90[2] = [[1,1,1,1]];
		
		//Treppe4
		figuren.figurenInt[3] = [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0]];
        figuren.figurenInt90[3] = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
		
		//Quadrat
		figuren.figurenInt[4] = [[1,1],[1,1]];
        figuren.figurenInt90[4] = [[1,1],[1,1]];
		
		//Blüte
		figuren.figurenInt[5] = [[0,1,0],[1,2,1],[0,1,0]];
        figuren.figurenInt90[5] = [[0,1,0],[1,2,1],[0,1,0]];
		
		//Turm5
		figuren.figurenInt[6] = [[1],[1],[1], [1], [1]];
        figuren.figurenInt90[6] = [[1,1,1,1,1]];
		
		//Treppe5
		figuren.figurenInt[7] = [[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0]];
        figuren.figurenInt90[7] = [[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]];
		
		//Fünf
		figuren.figurenInt[8] = [[1,2,1],[2,1,2],[1,2,1]];
        figuren.figurenInt90[8] = [[1,2,1],[2,1,2],[1,2,1]];
		
		//Turm6
		figuren.figurenInt[9] = [[1],[1],[1], [1], [1],[1]];
        figuren.figurenInt90[9] = [[1,1,1,1,1,1]];
		
		//Block6
		figuren.figurenInt[10] = [[1,1],[1,1], [1,1]];
        figuren.figurenInt90[10] = [[1,1,1],[1,1,1]];
		
		//Vogel
		figuren.figurenInt[11] = [[0,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,0]];
        figuren.figurenInt90[11] = [[1,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,1]];

		//Block8
		figuren.figurenInt[12] = [[1,1],[1,1],[1,1],[1,1]];
        figuren.figurenInt90[12] = [[1,1,1,1],[1,1,1,1]];
		
		//Brunnen
		figuren.figurenInt[13] = [[1,1,1],[1,2,1],[1,1,1]];
        figuren.figurenInt90[13] = [[1,1,1],[1,2,1],[1,1,1]];
		
		//Block9
		figuren.figurenInt[14] = [[1,1,1],[1,1,1],[1,1,1]];
        figuren.figurenInt90[14] = [[1,1,1],[1,1,1],[1,1,1]];