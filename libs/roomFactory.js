var Room = require('../models/room')
var _ = require('lodash');
var RoomFactory = function (){
	var rooms = {}

	this.getNearbyObject = function(room, funcName){
		return this.getNearbyRooms(room)
			.map(function(room){
				return _.values(room[funcName]())
			})
			.reduce(function(prev, current){
				return prev.concat(current)
			})
	}

	this.vectorToRoomID = function(vector){
		return "room-"+vector.toString()
	}
	this.getRoom = function(vector, createIfNull){
		var roomID = this.vectorToRoomID(vector)
		if(!rooms[roomID]){
			if(createIfNull){
				rooms[roomID] = new Room(roomID, vector)
			}else{
				return null
			}
		}
		return rooms[roomID]
	}
	this.getNearbyRooms = function(room){
		var rf = this
		return	room.getPos().getGrid(1).map(function(v){
			return rf.getRoom(v)
		}).filter(function(r){
			return r != null
		})
	}
	this.getNearbyUsers = function(room){
		return this.getNearbyObject(room, "getUsers")
	}

	this.getNearbyEnemys = function(room){
		return this.getNearbyObject(room, "getEnemys")
	}

	this.getActiveRooms = function(){
		return rooms
	}
}
var rf = new RoomFactory()
module.exports = rf;