var idCounter = 0

module.exports = function (pos){
	var id = idCounter++
	var health = 100
	var damage = 1
	var maxHealth = health
	var recoverStr = damage/2
	this.getID = function(){
		return id
	}

	this.takeDamage = function(d){
		health -= d
	}

	this.recover = function(){
		health += recoverStr
		if(health > maxHealth){
			health = maxHealth
		}
	}

	this.getPos = function(){
		return pos
	}

	this.getDamage = function(){
		return damage
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