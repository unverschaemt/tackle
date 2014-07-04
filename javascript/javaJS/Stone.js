
function Stone(color, x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.color = color;

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

	this.getColor = function() {
		return this.color;
	}
	
}
