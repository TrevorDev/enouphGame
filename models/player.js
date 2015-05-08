var world = require("../models/worldSettings")
var Vector = require('../libs/vector')
var roomFactory = require('../libs/roomFactory')
module.exports = function (pos, health, damage){
	var room = null
	this.updateFromClient = function(data){
		pos = new Vector(data.pos.x, data.pos.y, data.pos.z)

	}
	this.getChunk = function(){
		return pos.chunk(world.chunkSize)
	}
	this.getRoom = function(){
		return roomFactory.getRoom(this.getChunk())
	}
	this.getNearbyRooms = function(){
		return this.getChunk().getGrid(1).map(function(v){
			return roomFactory.getRoom(v)
		})
	}
	this.setRoom = function(){
		var newRoom = this.getRoom()
		if(newRoom != room){
			this.leaveRoom()
			room = newRoom
			room.addUser(this)
		}
		
	}
	this.leaveRoom = function(){
		if(room){
			room.removeUser(this)
		}
	}
	this.destroy = function(){
		this.leaveRoom()
	}
	this.setRoom()
}