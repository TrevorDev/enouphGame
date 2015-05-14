var Player = require('../models/player')
var worldSettings = require('../models/worldSettings')
var Vector = require('../libs/vector')
var roomFactory = require('../libs/roomFactory')
var _ = require('lodash');
module.exports = function (server){
	var io = require('socket.io').listen(server);
	io.on('connection', function(socket) {
		socket.data = {
			player: new Player(socket, new Vector(0,0,0), 100, 5)
		}
		socket.emit("connected", {id: socket.data.player.getID(), updateTimeout: worldSettings.updateTimeout})

		socket.on('updatePlayer', function(data){
			//TODO validate data
			socket.data.player.updateFromClient(data)
			//console.log(socket.data.player.getChunk())
		})

	    socket.on('disconnect', function() {
	    	socket.data.player.destroy()
	    });
	});

	var updateClients = function(){
		var rooms = roomFactory.getActiveRooms()
		for(roomId in rooms){
			var room = rooms[roomId]
			
			if(room.hasUsers()){
				var nearbyUsers = roomFactory.getNearbyUsers(room)
									.map(function(user){
										return user.getUpdateData()
									})
				_.values(room.getUsers()).forEach(function(player){
					player.getSocket().emit("updateWorld", {players: nearbyUsers})
				})
				//console.log(nearbyUsers.length)
			}
		}
		setTimeout(updateClients, worldSettings.updateTimeout)
	}
	updateClients()
}