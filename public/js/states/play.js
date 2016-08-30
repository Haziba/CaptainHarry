var playState = {
  preload: function(){
    game.load.image('harry', 'imgs/harry.png');
    game.load.image('city', 'imgs/city.jpg');
  },

  create: function(){
    this.city = game.add.sprite(0, 0, 'city');

    this.dots = [];
    this.links = [];
    this.cloths = [];

    for(var i = 0; i < 20; i++){
      this.dots.push([]);

      for(var j = 0; j < 30; j++){
        this.dots[i].push(new Dot({x: i, y: j}));

        if(i != 0){
          this.links.push(new Link(this.dots[i][j], this.dots[i-1][j]));
        }

        if(j != 0){
          this.links.push(new Link(this.dots[i][j], this.dots[i][j-1]));
        }

        if(i != 0 && j != 0){
          this.cloths.push(new Cloth(this.dots[i-1][j-1], this.dots[i-1][j], this.dots[i][j-1], this.dots[i][j]));
        }
      }
    }

    this.harry = game.add.sprite(300, 0, 'harry');
    this.harry.scale.x = -1;
    this.harry.rotation = -Math.PI * 0.25;
  },

  update: function(){
    for(var i = 0; i < this.links.length; i++){
      this.links[i].update();
    }

    this.iteration = 1;//this.iteration >= 0 ? this.iteration+10 : 0;
    //var windWave = (Math.sin() * Math.random()) + (Math.sin() * Math.random()) + (Math.sin() * Math.;
    var windStrength = Math.abs(Math.sin(this.iteration)) * Math.random() * (1/30);//0.001 * Math.random() * 8 - 3;
    var gravity = 0.02;

    for(var i = 0; i < this.dots.length; i++){
      for(var j = 0; j < this.dots[i].length; j++){
        this.dots[i][j].update(windStrength * Math.abs(Math.sin((i * 1000) / this.dots.length)), gravity);
      }
    }

    this.cloths = this.cloths.sort(function(a, b){ return a.z() - b.z(); });

    for(var i = 0; i < this.cloths.length; i++){
      this.cloths[i].update();
    }
  },
}

var Cloth = function(topLeft, topRight, bottomLeft, bottomRight){
  var clip = game.add.graphics();

  return {
    update: function(){
      clip.clear();

      clip.moveTo(topLeft.clipPosition().x, topLeft.clipPosition().y);

      var red = Math.min(255, 65 + (190 * Math.min(1, (-50 / Math.min(0, this.z())))));
      if(this.z() >= 0)
        red = 255;
      clip.beginFill(Phaser.Color.getColor(red, 0, 0));
      clip.lineTo(topRight.clipPosition().x, topRight.clipPosition().y);
      clip.lineTo(bottomRight.clipPosition().x, bottomRight.clipPosition().y);
      clip.lineTo(bottomLeft.clipPosition().x, bottomLeft.clipPosition().y);
      clip.lineTo(topLeft.clipPosition().x, topLeft.clipPosition().y);

      clip.endFill();
    },

    z: function(){
      return Math.min(topLeft.clipPosition().z, topRight.clipPosition().z, bottomLeft.clipPosition().z, bottomRight.clipPosition().z);
    }
  }
}

var Dot = function(coords){
  var position = {x: coords.x * 10, y: coords.y * 10, z: 0};
  var lastPosition = {x: position.x, y: position.y, z: position.z};
  var velocity = {x: 0, y: 0, z: 0};

  var clip = game.add.graphics(position.x, position.y);
  /*clip.beginFill(0xFF0000);
  clip.drawRect(-2, -2, 4, 4);
  clip.endFill();*/

  var updatePosition = function(){
    if(coords.y == 0){
      position = {
        x: coords.x * 10,
        y: coords.y * 10,
        z: 0,
      };
    }

    clip.x = 200 + position.x - ((40 - coords.y) / 40) * coords.x * 3 + (coords.y / 40) * coords.x * 3;
    clip.y = 230 + position.y;
    var scale = Math.max(1 + (position.z / 100), 0.2);
    clip.scale.setTo(scale, scale);
  }

  return {
    update: function(windStrength, gravity){
      velocity = {
        x: position.x - lastPosition.x + windStrength,
        y: position.y - lastPosition.y + gravity,
        z: position.z - lastPosition.z - windStrength,
      };

      lastPosition.x = position.x;
      lastPosition.y = position.y;
      lastPosition.z = position.z;

      position.x += velocity.x;
      position.y += velocity.y;
      position.z += velocity.z;

      updatePosition();
    },

    coords: function(){
      return coords;
    },

    position: function(){
      return position;
    },

    clipPosition: function(){
      return {x: clip.x, y: clip.y, z: position.z};
    },

    moveAddBy: function(translate){
      position.x += translate.x;
      position.y += translate.y;
      position.z += translate.z;

      updatePosition();
    },

    moveSubtractBy: function(translate){
      position.x -= translate.x;
      position.y -= translate.y;
      position.z -= translate.z;

      updatePosition();
    }
  }
}

var Link = function(dot1, dot2){
  var restingDistance = 10;

  return {
    update: function(){
      var diff = {
        x: dot1.position().x - dot2.position().x,
        y: dot1.position().y - dot2.position().y,
        z: dot1.position().z - dot2.position().z,
      };

      var d = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2) + Math.pow(diff.z, 2));

      var difference = (restingDistance - d) / d;

      var translate = {
        x: diff.x * 0.5 * difference,
        y: diff.y * 0.5 * difference,
        z: diff.z * 0.5 * difference,
      };

      dot1.moveAddBy(translate);
      dot2.moveSubtractBy(translate);
    },

    furthestBackPosition: function(){
      return Math.min(dot1.position().z, dot2.position().z);
    }
  }
}
