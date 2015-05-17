var idCounter = 0

module.exports = function (pos, health, damage){
	var id = idCounter++
	var maxHealth = health
	this.getID = function(){
		return id
	}

	this.getUpdateData = function(){
		var ret = {}
		ret.id = id
        ret.pos = {x: pos.x, y: pos.y, z: pos.z}
        ret.maxHealth = maxHealth
        ret.health = health
        return ret
	}
}