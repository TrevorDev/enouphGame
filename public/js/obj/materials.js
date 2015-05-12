var MATERIALS = {
	DEFAULT: new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } ),
	SMOOTH: new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ),
	SHINY: new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x000000, shininess: 1, shading: THREE.FlatShading } )
}