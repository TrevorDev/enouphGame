var MATERIALS = {
	DEFAULT: new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } ),
	SMOOTH: new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ),
	SHINY: new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x000099, shininess: 0, shading: THREE.FlatShading } )
}