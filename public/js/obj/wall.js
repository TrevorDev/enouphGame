var Wall = function(world, meterial) {
    if(!meterial){
        meterial = MATERIALS.DEFAULT
    }
    this.world = world;
    this.hitbox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), meterial)
    this.hitbox.scale.x = 500
    this.hitbox.scale.y = 20
    this.hitbox.scale.z = 500
    this.world.scene.add(this.hitbox)
    this.getVertices = function(){
        var ret = [];
        var h = this.hitbox;
        $.each(this.hitbox.geometry.vertices, function(i, v){
            ret.push(v.clone().applyMatrix4(h.matrixWorld));
        })
        return ret;
    }

    this.getFaces = function(){
        var verts = this.getVertices();
        var ret = [];
        var h = this.hitbox;
        $.each(this.hitbox.geometry.faces, function(i, f){
            // normal rotated to match world
            var nw =  f.normal.clone().applyProjection(new THREE.Matrix4().extractRotation( h.matrixWorld ));
            ret.push(new HitFace(verts[f.a],verts[f.b],verts[f.c], nw));
        })
        return ret;
    }

    this.checkCollision = function(from, to){
        var faces = this.getFaces()

        //TODO handle multiple face collision and only colide with closest one
        for(var i=0;i<faces.length;i++){
            var face = faces[i];
            var hit = Collision.lineFace(from, to, face);
            if(hit){
                var otherHit = Collision.linePlane(to, to.clone().add(face.normal), face);
                if(otherHit){
                    return otherHit.add(face.normal.clone().multiplyScalar(0.1));
                }
            }
        }
        return null;
    }
    //this.hitbox.position.y = 20
}

var HitFace = function(v1, v2, v3, normal){
    this.a = v1;
    this.b = v2;
    this.c = v3;
    this.normal = normal;

    this.checkCollision = function(from, to){
        var face = this;
        return Collision.lineFace(from, to, face);
    }
}