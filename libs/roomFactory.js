var Room = require('../models/room')

var RoomFactory = function (){
	var rooms = {}
	this.vectorToRoomID = function(vector){
		return "room-"+vector.toString()
	}
	this.getRoom = function(vector){
		var roomID = this.vectorToRoomID(vector)
		if(!rooms[roomID]){
			rooms[roomID] = new Room(roomID, vector)
		}
		return rooms[roomID]
	}
	this.getNearbyRooms = function(room){
		var rf = this
		return	room.getPos().getGrid(1).map(function(v){
			return rf.getRoom(v)
		})
	}
	this.getActiveRooms = function(){
		return rooms
	}
}
var rf = new RoomFactory()
module.exports = rf;