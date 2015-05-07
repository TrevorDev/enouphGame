var Room = require('../models/room')

var RoomFactory = function (){
	var rooms = {}
	this.vectorToRoomID = function(vector){
		return "room-"+vector.toString()
	}
	this.getRoom = function(vector){
		var roomID = this.vectorToRoomID(vector)
		if(!rooms[roomID]){
			rooms[roomID] = new Room(roomID)
		}
		return rooms[roomID]
	}

}
var rf = new RoomFactory()
module.exports = rf;