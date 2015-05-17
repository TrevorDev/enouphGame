var World = function(width, height){
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80000);
	this.camera.position.set(0, 200, 800);
	this.scene = new THREE.Scene();
}

var MainWorld = function(){
	World.call(this)
	this.enemys = {}
	this.players = {}
	this.player = new MainPlayer(this)
	this.player.body.position.y += 100

	this.walls = [];
	this.chunkSize = 3000;
	this.chunkDrawDist = 2;
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
	for ( var i = 0; i < materials.length; i ++ ) {
		sphere = new THREE.Mesh( new THREE.SphereGeometry( 3000, 32, 16 ), materials[ i ] );
		sphere.position.x = ( i % 4 ) * 200 - 400;
		sphere.position.z = 0;
		sphere.position.y = 4000;
		this.scene.add( sphere );

	}

	// Lights
	//this.scene.add( new THREE.AmbientLight( 0x333333 ) );

	this.scene.add( new THREE.HemisphereLight( 0xFFFFFF, 0x555555, 0.3 ) );

	particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	this.player.body.add( particleLight );
	particleLight.position.y+=90;
	var pointLight = new THREE.PointLight( 0xffffff, 0.6 );
	pointLight.distance = 2000
	particleLight.add( pointLight );

	this.updatePlayers = function(players){
		var world = this
		var newPlayers = players.reduce(function(ret, p){
			if(world.players[p.id]){
				ret[p.id] = world.players[p.id]
				ret[p.id].setNextPos(p.pos)
			}else{
				ret[p.id] = new OtherPlayer(world, p.pos)
			}
			delete world.players[p.id]
			return ret
		}, {})
		for(var key in world.players){
				console.log(world.players[key])
				world.players[key].destroy()
		}
		world.players = newPlayers
	}

	this.updateEnemys = function(enemys){
		var world = this
		var newEnemys = enemys.reduce(function(ret, p){
			if(world.enemys[p.id]){
				ret[p.id] = world.enemys[p.id]
				ret[p.id].setNextPos(p.pos)
			}else{
				ret[p.id] = new Enemy(world, p.pos, p.maxHealth)
			}
			ret[p.id].setHealth(p.health)
			delete world.enemys[p.id]
			return ret
		}, {})
		for(var key in world.enemys){
				console.log(world.enemys[key])
				world.enemys[key].destroy()
		}
		world.enemys = newEnemys
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
	var ground = new Wall(world, MATERIALS.SHINY)
	ground.hitbox.position.x=vec.x*world.chunkSize;
	ground.hitbox.position.z=vec.z*world.chunkSize;
	ground.hitbox.scale.y = 1;
	ground.hitbox.scale.x = world.chunkSize
	ground.hitbox.scale.z = world.chunkSize
	this.walls.push(ground)
	
	var chunkRand = new Math.seedrandom(vec.x+''+vec.z);
	if(chunkRand() > 0.1 && (vec.x != 0 && vec.z !=0)){
		var wall = new Wall(world, MATERIALS.SHINY)
		wall.hitbox.position.x=vec.x*world.chunkSize;
		wall.hitbox.position.z=vec.z*world.chunkSize;
		wall.hitbox.scale.y = chunkRand()*6000+300;
		wall.hitbox.scale.x = world.chunkSize/8
		wall.hitbox.scale.z = world.chunkSize/8
		this.walls.push(wall)
	}
	// this.walls[0].hitbox.position.y=-2500-(Math.random()*2000);
	// var dist = Math.abs(vec.z) >  Math.abs(vec.z) ? Math.abs(vec.z) : Math.abs(vec.z)
	// this.walls[0].hitbox.scale.x += 1000+Math.random()*1000;
	// this.walls[0].hitbox.scale.z += 1000+Math.random()*1000;
	// //this.walls[0].hitbox.position.y -= 500 * dist;
	//Math.seedrandom()

	this.dispose = function(){
		this.walls.forEach(function(val){
			val.world.scene.remove(val.hitbox)
		})
	}
}