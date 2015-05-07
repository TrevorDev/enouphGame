var Player = require('../models/player')
var Vector = require('../libs/vector')
module.exports = function (server){
	var io = require('socket.io').listen(server);
	io.on('connection', function(socket) {
		socket.data = {
			player: new Player(new Vector(0,0,0), 100, 5)
		}


	    socket.on('disconnect', function() {
	    });
	});
}