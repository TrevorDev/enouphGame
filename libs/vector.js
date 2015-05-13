var Vector = function (x, y, z){
	this.x = x
	this.y = y
	this.z = z

	this.chunk = function(chunkSize){
		return new Vector(Math.floor(this.x/chunkSize),Math.floor(this.y/chunkSize),Math.floor(this.z/chunkSize))
	}
	this.toString = function(){
		return this.x+"-"+this.y+"-"+this.z
	}

	this.getGrid = function(size){
		var ret = []
		for(var i = this.z-size;i<=this.z+size;i++){
			for(var j = this.x-size;j<=this.x+size;j++){
				ret.push(new Vector(j, this.y, i))
			}
		}
		return ret
	}
}

module.exports = Vector