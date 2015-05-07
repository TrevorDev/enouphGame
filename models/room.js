module.exports = function (id){
	var users = {}
	this.addUser = function(user){
		users[user.id] = user
	}
	this.removeUser = function(user){
		delete users[user.id]
	}
}