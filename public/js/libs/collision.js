var Collision = {
	lineFace: function(from, to, face, infiniteLength){
		var line = to.clone().sub(from);
        var right = face.a.clone().sub(from)
        var planeX = face.a.clone().sub(face.b);
        var planeY = face.a.clone().sub(face.c);

        //when line collides with plane:
        //from + x*line = face.a + y*planeX + z*planeY
        //x*line + y*-planeX + z*-planeY = face.a - from
        //x y z = right

        //CRAMERS RULE X,Y,Z
        var det = line.x*((planeX.y*planeY.z)-(planeX.z*planeY.y)) - planeX.x*((line.y*planeY.z)-(line.z*planeY.y)) + planeY.x*((line.y*planeX.z)-(line.z*planeX.y));
        var detX = right.x*((planeX.y*planeY.z)-(planeX.z*planeY.y)) - planeX.x*((right.y*planeY.z)-(right.z*planeY.y)) + planeY.x*((right.y*planeX.z)-(right.z*planeX.y));
        var detY = line.x*((right.y*planeY.z)-(right.z*planeY.y)) - right.x*((line.y*planeY.z)-(line.z*planeY.y)) + planeY.x*((line.y*right.z)-(line.z*right.y));
        var detZ = line.x*((planeX.y*right.z)-(planeX.z*right.y)) - planeX.x*((line.y*right.z)-(line.z*right.y)) + right.x*((line.y*planeX.z)-(line.z*planeX.y));
        
        if(det!=0){
            var x = detX/det;
            var y = detY/det;
            var z = detZ/det;
            //console.log(x,y,z)
            if(infiniteLength || (x>=0&&x<=1&&y>=0&&y<=1&&z>=0&&z<=1&&(y+z)<=1)){
                return from.clone().add(line.clone().multiplyScalar(x));
            }
        }
        return null;
	},
	linePlane: function(from, to, face){
		return Collision.lineFace(from, to, face, true);
	}
}