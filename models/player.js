var world = require("../models/worldSettings")
var Vector = require('../libs/vector')
var roomFactory = require('../libs/roomFactory')

var idCounter = 0

module.exports = function (socket, pos, health, damage){
	var room = null
	var id = idCounter++//socket.id //security issue? maybe use guid instead
	this.updateFromClient = function(data){
		pos = new Vector(data.pos.x, data.pos.y, data.pos.z)
		this.setRoom();
	}
	this.getPos = function(){
		return pos
	}
	this.getDamage = function(){
		return damage
	}
	this.takeDamage = function(d){
		health -= d
	}
	this.getChunk = function(){
		return pos.chunk(world.chunkSize)
	}
	this.getRoom = function(){
		return roomFactory.getRoom(this.getChunk(), true)
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
	this.getID = function(){
		return id
	}
	this.leaveRoom = function(){
		if(room){
			room.removeUser(this)
		}
	}
	this.getSocket = function(){
		return socket
	}
	this.getUpdateData = function(){
		var ret = {}
		ret.id = id
        ret.pos = {x: pos.x, y: pos.y, z: pos.z}
        return ret
	}
	this.destroy = function(){
		this.leaveRoom()
	}
	this.setRoom()
}