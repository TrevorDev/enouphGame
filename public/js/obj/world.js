var World = function(width, height){
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
	this.camera.position.set(0, 200, 800);
	this.scene = new THREE.Scene();
}

var MainWorld = function(){
	World.call(this)
	this.players = {}
	this.player = new MainPlayer(this)
	this.player.body.position.y += 100

	this.walls = [];
	this.chunkSize = 3000;
	this.chunkDrawDist = 1;
	this.chunks = {}

	this.removeAllChunks = function(){
		$.each(this.chunks, function(key, val) {
			val.dispose();
		})
		this.chunks = {}
	}

	this.getCurrentChunk = function(){
		var x = Math.floor((this.player.body.position.x+(this.chunkSize/2)) / this.chunkSize);
		var y = Math.floor((this.player.body.position.y+(this.chunkSize/2)) / this.chunkSize);
		var z = Math.floor((this.player.body.position.z+(this.chunkSize/2)) / this.chunkSize);
		return new THREE.Vector3(x,y,z);
	}
	
	this.getWalls = function(){
		var ret = []
		for(var key in this.chunks){
			ret = ret.concat(this.chunks[key].walls)
		}
		ret = ret.concat(this.walls)
		return ret
	}
	
	// for(var i = 0;i<10;i++){
	// 	for(var j = 0;j<10;j++){
	// 		var w = new Wall(this);
	// 		w.hitbox.scale.x = 100;
	// 		w.hitbox.scale.z = 100;
	// 		w.hitbox.position.x -= 100*j;
	// 		w.hitbox.position.z -= 100*i;
	// 		this.walls.push(w);
	// 	}
	// }
	

	// Materials
	materials=[]
	materials.push(MATERIALS.DEFAULT);
	materials.push(MATERIALS.SHINY);
	materials.push(MATERIALS.SMOOTH);
	// Spheres geometry
	var sphere, geometry, material;
	for ( var i = 0, l = materials.length; i < l; i ++ ) {
		sphere = new THREE.Mesh( new THREE.SphereGeometry( 70, 32, 16 ), materials[ i ] );
		sphere.position.x = ( i % 4 ) * 200 - 400;
		sphere.position.z = -200;
		sphere.position.y = 150;
		this.scene.add( sphere );

	}

	// Lights
	this.scene.add( new THREE.AmbientLight( 0x333333 ) );

	particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	this.player.body.add( particleLight );
	particleLight.position.y+=90;
	var pointLight = new THREE.PointLight( 0xffffff, 1 );
	pointLight.distance = 1000
	particleLight.add( pointLight );

	this.updatePlayers = function(players){
		var world = this
		players.forEach(function(p){
			if(world.players[p.id]){
				world.players[p.id].setNextPos(p.pos)
			}else{
				world.players[p.id] = new OtherPlayer(world, p.pos)
			}
		})
		var playerObj = players.reduce(function(prev, p){
			prev[p.id] = p
			return prev
		}, {})
		for(var key in world.players){
			if(!playerObj[key]){
				console.log(world.players[key])
				world.players[key].destroy()
				delete world.players[key]
			}
		}
	}

	this.runFrame = function(){
		this.player.move();
		for(var key in this.players){
			this.players[key].move()
		}

		var currentChunk = this.getCurrentChunk()
	   	if(this.lastChunk == null || this.lastChunk.x != currentChunk.x || this.lastChunk.z != currentChunk.z){
	   		this.removeAllChunks();
	   		for(var i = -this.chunkDrawDist;i<=this.chunkDrawDist;i++){
	   			for(var j = -this.chunkDrawDist;j<=this.chunkDrawDist;j++){
	   				var coord = currentChunk.clone();
	   				coord.x += i;
	   				coord.z += j;
	   				new WorldChunk(this, coord);
	   			}
	   		}
	   		

	   		this.lastChunk = currentChunk
	   	}

		this.camera.position.copy(this.player.getCameraPos());
	    this.camera.lookAt(this.player.body.position);
	}
	
}


var WorldChunk = function(world, vec){
	world.chunks[vec.x+""+vec.z] = this;
	this.walls = []
	this.walls.push(new Wall(world, MATERIALS.SHINY))
	this.walls[0]
	this.walls[0].hitbox.position.x=vec.x*world.chunkSize;
	this.walls[0].hitbox.position.z=vec.z*world.chunkSize;
	this.walls[0].hitbox.scale.y = 10;
	this.walls[0].hitbox.scale.x = world.chunkSize
	this.walls[0].hitbox.scale.z = world.chunkSize
	
	// Math.seedrandom(vec.x+''+vec.z);
	// if(Math.random() > 0.2){
	// 	world.scene.add(this.particleLights[0]);
	// }
	// this.walls[0].hitbox.position.y=-2500-(Math.random()*2000);
	// var dist = Math.abs(vec.z) >  Math.abs(vec.z) ? Math.abs(vec.z) : Math.abs(vec.z)
	// this.walls[0].hitbox.scale.x += 1000+Math.random()*1000;
	// this.walls[0].hitbox.scale.z += 1000+Math.random()*1000;
	// //this.walls[0].hitbox.position.y -= 500 * dist;
	// Math.seedrandom()

	this.dispose = function(){
		this.walls.forEach(function(val){
			val.world.scene.remove(val.hitbox)
		})
	}
}