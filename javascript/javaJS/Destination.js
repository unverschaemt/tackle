
function Destination(x,y){
	this.x = x;
	this.y = y;
	
	this.getX = function() {
		return parseInt(this.x);
	}
	this.setX = function(x) {
		this.x = x;
	}
	this.getY = function() {
		return parseInt(this.y);
	}
	this.setY = function(y) {
		this.y = y;
	}
}
