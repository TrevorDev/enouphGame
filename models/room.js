var rf = require('../libs/roomFactory')
module.exports = function (id, pos){
	var users = {}
	this.hasUsers = function(){
		var ret = false
		for(var id in users){
			ret = true
			break;
		}
		return ret
	}
	this.getUsers = function(){
		return users
	}
	this.addUser = function(user){
		users[user.getID()] = user
	}
	this.removeUser = function(user){
		delete users[user.getID()]
	}
	this.getPos = function(){
		return pos
	}
}