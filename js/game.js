var game = new Phaser.Game(640, 960, Phaser.CANVAS, null, { preload: preload, create: create, update: update });

var myFont, scoreText;
var brick, object, score = 0;

var map, mapLayer;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#037A88';

  game.load.image('background', 'img/background.png');
  game.load.image('ground', 'img/ground.png');
  game.load.image('brick', 'img/brick.png');
  game.load.image('windows', 'img/windows.png');
}

function create() {
  game.add.sprite(0, 0, 'background');
  game.add.sprite(0, 292, 'ground');

  myFont = { font: "bold 56px Arial", fill: "#037A88", stroke: "#FFF", strokeThickness: 12 };
  scoreText = game.add.text(20, 20, score, myFont);

  game.physics.startSystem(Phaser.Physics.ARCADE);

  spawnBrick();
  //game.time.events.loop(500, spawnWindow);
  spawnWindows();
}


function update() {

  game.physics.arcade.collide(brick, mapLayer);

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    brick.body.velocity.x = -250;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    brick.body.velocity.x = 250;
  } else {
    brick.body.velocity.x = 0;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && brick.body.onFloor()) {
    console.log('Keybord.UP')
    brick.body.velocity.y = -300;
  }

  // windows.forEach(function(object) {
  //   if(object.y >= game.world.height) {
  //     alert('GAME OVER!\n\nYour score: '+score);
  //     location.reload();
  //   }
  // });

}

function spawnBrick() {
  brick = game.add.sprite(game.world.centerX, game.world.centerY, 'brick');
  brick.anchor.set(0.5);
  game.physics.enable(brick, Phaser.Physics.ARCADE);
  brick.body.gravity.y = 500;
     // brick.body.velocity.y = -100;
}

function spawnWindows() {
  map = game.add.tilemap();
  map.addTilesetImage('windows', 'windows', 82, 75);
  map.setCollision([0, 1, 2], true);

  mapLayer = map.create('level', 8, 100, 82, 75);

  var WINDOW = 0;
  for (var i = 0; i < 20; i++) {
    var xPos = i % 2 ? 0 : 5;
    map.putTile(WINDOW, xPos, i*2, mapLayer);
    map.putTile(WINDOW, xPos+1, i*2, mapLayer);
    map.putTile(WINDOW, xPos+2, i*2, mapLayer);
  }
}


function crash(brick, object) {
  object.destroy();
  score++;
  scoreText.setText(score);
  game.camera.shake(0.01, 200);
}
