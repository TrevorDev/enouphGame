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
	for(var i = 0;i<10;i++){
		for(var j = 0;j<10;j++){
			var w = new Wall(this);
			w.hitbox.scale.x = 100;
			w.hitbox.scale.z = 100;
			w.hitbox.position.x -= 100*j;
			w.hitbox.position.z -= 100*i;
			this.walls.push(w);
		}
	}
	

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
	particleLight.position.y+=40;
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
		this.camera.position.copy(this.player.getCameraPos());
	    this.camera.lookAt(this.player.body.position);
	}
	
}