var World = function(width, height){
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 8000);
	this.camera.position.set(0, 200, 800);
	this.scene = new THREE.Scene();
}

var MainWorld = function(){
	World.call(this)
	this.player = new MainPlayer(this)
	this.player.body.position.y += 100

	
	this.walls = [];
	var w = new Wall(this);
	w.hitbox.position.y -= 100;
	w.hitbox.position.x -= 100;
	this.walls.push(w);

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
		this.scene.add( sphere );

	}

	// Lights
	this.scene.add( new THREE.AmbientLight( 0x111111 ) );

	particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	this.player.body.add( particleLight );
	particleLight.position.y+=40;
	var pointLight = new THREE.PointLight( 0xffffff, 1 );
	particleLight.add( pointLight );

	this.runFrame = function(){
		this.player.move();
		this.camera.position.copy(this.player.getCameraPos());
	    this.camera.lookAt(this.player.body.position);
	}
	
}