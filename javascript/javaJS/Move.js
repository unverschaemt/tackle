
function Move(stones, destination) {
    
	this.score = 0;
    if(Object.prototype.toString.call( stones ) === '[object Array]' ){
        this.stones = stones;
    } else {
        if(typeof stones === "number"){
            this.score = stones;
        } else {
            this.stone = stones;
        }
    }
	this.destination = destination;

	this.getStone = function() {
		return this.stone;
	}
	this.setStone = function(stone) {
		this.stone = stone;
	}
	this.getStones = function() {
		return this.stones;
	}

	this.setStones = function(stones) {
		this.stones = stones;
	}

	this.getDestination = function() {
		return this.destination;
	}

	this.setDestination = function(destination) {
		this.destination = destination;
	}
	this.getScore = function() {
		return this.score;
	}
	this.setScore = function(score) {
		this.score = score;
	}
	
}
