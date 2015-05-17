var Player = require('../models/player')
var worldSettings = require('../models/worldSettings')
var Vector = require('../libs/vector')
var roomFactory = require('../libs/roomFactory')
var _ = require('lodash');
module.exports = function (server){
	var io = require('socket.io').listen(server);
	io.on('connection', function(socket) {
		socket.data = {
			player: new Player(socket, new Vector(0,0,0), 100, 2)
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
var counter =0
	var updateClients = function(){
		var rooms = roomFactory.getActiveRooms()
		for(roomId in rooms){
			var room = rooms[roomId]
			if(room.hasUsers() || room.hasEnemys()){
				var nearbyUsers = roomFactory.getNearbyUsers(room)
				var nearbyEnemys = roomFactory.getNearbyEnemys(room)

				//perform enemy actions
				if(nearbyUsers.length > 0){
					for(var key in room.getEnemys()){
						var e = room.getEnemys()[key]
						var hitDist = 200
						var closest = {dist: hitDist, player: null}
						nearbyUsers.forEach(function(u){
							var dist = u.getPos().sub(e.getPos()).mag()
							if(dist < hitDist){
								e.takeDamage(u.getDamage())
							}
							if(dist < closest.dist){
								closest.dist = dist
								closest.player = u
							}
						})
						if(closest.player!=null){
							closest.player.takeDamage(e.getDamage())
						}
						e.recover()
					}
				}

				//update clients
				nearbyUsers = nearbyUsers.map(function(user){
										return user.getUpdateData()
									})
				nearbyEnemys = nearbyEnemys.map(function(enemy){
										return enemy.getUpdateData()
									})
				_.values(room.getUsers()).forEach(function(player){
					console.log("sent"+counter++)
					player.getSocket().emit("updateWorld", {players: nearbyUsers, enemys: nearbyEnemys})
				})
			}
		}
		setTimeout(updateClients, worldSettings.updateTimeout)
	}
	updateClients()
}