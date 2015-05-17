var rf = require('../libs/roomFactory')
var Vector = require('../libs/vector')
var Enemy = require('../models/enemy')
var _ = require('lodash');
var world = require("../models/worldSettings")
module.exports = function (id, pos){
	var users = {}
	var enemys = {}
	var walls = {}

	var enemy = new Enemy(new Vector(pos.x* world.chunkSize + world.chunkSize/2 , 0, pos.z*world.chunkSize + world.chunkSize/2 ))
	enemys[enemy.getID()] = enemy
	
	this.hasUsers = function(){
		return !_.isEmpty(users);
	}
	this.hasEnemys = function(){
		return !_.isEmpty(enemys);
	}
	this.getUsers = function(){
		return users
	}
	this.getWalls = function(){
		return walls
	}
	this.getEnemys = function(){
		return enemys
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