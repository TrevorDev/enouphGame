var Player = function(world) {
    this.world = world;
    this.body = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), MATERIALS.DEFAULT)
    this.world.scene.add(this.body)
    this.gravity = 0.2;
    this.body.position.y = 20
    this.grounded = false;
    this.spd = new THREE.Vector3(0, 0, 0);
    this.moveAcc = 1;
    this.maxSpd = 30;
    this.jumpPower = 8;
    this.move = function() {}

    this.getFeet = function(){
        var ret = this.body.position.clone();
        ret.y-=10;
        return ret;
    }

    this.moveFeetTo = function(vec3){
        this.body.position.copy(vec3)
        this.body.position.y+=10;
    }

    this.getUpdateData = function(){
        var ret = {}
        ret.pos = {x: this.body.position.x, y: this.body.position.y, z: this.body.position.z}
        return ret
    }
}

var MainPlayer = function(world) {
    Player.call(this, world)

    this.controller = new FLIXI.Controller({
        left: "left",
        right: "right",
        up: "up",
        down: "down",
        attack: "z",
        newWall: "a"
    });

    this.getCameraPos = function(){
        var height = 100
        var distance = 300
        var ret = new THREE.Vector3()
        ret.copy(this.body.position)
        ret.y = this.body.position.y+height
        ret.x += Math.sin(this.body.rotation.y) * distance
        ret.z += Math.cos(this.body.rotation.y) * distance
        return ret
    }

    this.die = function(){
        this.body.position.set(0,0,0)
        this.spd.set(0,0,0)
    }

    this.move = function() {
        if(this.body.position.y < -3000){
            this.die();
        }

        //MOVEMENT
        var keydown = false;
        if (this.controller.getKey("down")) {
            keydown = true;
            this.spd.x += Math.sin(this.body.rotation.y) * this.moveAcc
            this.spd.z += Math.cos(this.body.rotation.y) * this.moveAcc
        }
        if (this.controller.getKey("up")) {
            keydown = true;
            this.spd.x -= Math.sin(this.body.rotation.y) * this.moveAcc
            this.spd.z -= Math.cos(this.body.rotation.y) * this.moveAcc
        }
        if (this.controller.getKey("left")) {
            this.body.rotation.y += 0.05
        }
        if (this.controller.getKey("right")) {
            this.body.rotation.y -= 0.05
        }
        if (this.grounded && !keydown) {
            //this.spd.setLength(0);
            this.spd.x*=0.7;
            this.spd.z*=0.7;
        }
        var spd2d = Math.sqrt(this.spd.x*this.spd.x + this.spd.z*this.spd.z);
        if (spd2d > this.maxSpd) {
            this.spd.x *= this.maxSpd/spd2d
            this.spd.z *= this.maxSpd/spd2d
            //this.spd.setLength(this.maxSpd)
        }

        this.spd.y-=this.gravity;
        //ACTIONS
        if (this.controller.getKey("attack") && this.grounded) {
            this.spd.y =  this.jumpPower;
        }
        this.shotCooldown--;

        if (this.controller.getKey("newWall")) {
            this.controller.keyUp("newWall");
            w = new Wall(this.world)
            w.hitbox.position.copy(this.body.position);
            w.hitbox.position.y-=30;
            this.world.walls.push(w);
        }

        var from = this.getFeet().clone();
        this.body.position.add(this.spd)
        var to = this.getFeet().clone();
        
        var newPos = this.collisionAdjust(from, to);
        if(newPos){
             //console.log("hit")
             this.grounded = true;
            this.moveFeetTo(newPos)
        }else{
            this.grounded = false;
            //console.log("notHit")
        }
            

    }

    this.collisionAdjust = function(from, to){

         var wallFaces = []
        $.each(this.world.walls, function(idx, elem) {
            wallFaces = wallFaces.concat(elem.getFaces());
        });
        
        var closestCollision = null
        var closestFace = null;
        var closestDist = -1;
        $.each(wallFaces, function(idx, elem) {

            var hit = elem.checkCollision(from, to)
            if(hit){
                var dist = from.clone().sub(hit).length();
                if(closestDist == -1 || dist < closestDist){
                    closestFace=elem
                    closestDist = dist;
                    closestCollision = hit;
                }
            }           
        });
        if(closestCollision){
            closestCollision.add(closestFace.normal.clone().multiplyScalar(0.05))//move away from plane
            this.spd.projectOnPlane(closestFace.normal)//adjust speed by plane normal
            var otherHit = Collision.linePlane(to, to.clone().add(closestFace.normal), closestFace);
            otherHit.add(closestFace.normal.clone().multiplyScalar(0.05))
            var checkCollision = this.collisionAdjust(closestCollision, otherHit);
            //TODO handle infinit recursion case (concave)
            //console.log("Hit")
            if(checkCollision){
                return checkCollision
            }else{
                return otherHit
            }
            
        }else{
            //console.log("noHit")
        }
        return null;
    }
}