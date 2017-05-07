var game = new Phaser.Game(640, 960, Phaser.CANVAS, null, { preload: preload, create: create, update: update });

var myFont, scoreText;
var brick, windows, object, score = 0;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#037A88';

  game.load.image('background', 'img/background.png');
  game.load.image('ground', 'img/ground.png');
  game.load.image('brick', 'img/brick.png');
  game.load.spritesheet('windows', 'img/windows.png', 82, 75);
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
  game.physics.arcade.collide(brick, windows);
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    brick.body.velocity.x = -50;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    brick.body.velocity.x = 50;
  } else {
    brick.body.velocity.x = 0;
  }


  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    console.log('Keybord.UP')
    brick.body.velocity.y = -100;
  }



  windows.forEach(function(object) {
    if(object.y >= game.world.height) {
      alert('GAME OVER!\n\nYour score: '+score);
      location.reload();
    }
  });
}

function spawnBrick() {
  brick = game.add.sprite(game.world.centerX, game.world.centerY, 'brick');
  brick.anchor.set(0.5);
  game.physics.enable(brick, Phaser.Physics.ARCADE);
  brick.body.gravity.y = 50;
     // brick.body.velocity.y = -100;
}

function spawnWindow(xPos, yPos) {
  object = game.add.sprite(xPos, yPos, 'windows', 0);
  game.physics.enable(object, Phaser.Physics.ARCADE);
 object.body.immovable = true;
  windows.add(object);
}

function spawnWindows() {
  windows = game.add.group();
  var widht = 82;
  spawnWindow(0, 500);
  spawnWindow(widht, 500);
  spawnWindow(widht*2, 500);
  spawnWindow(widht*3, 500);
  spawnWindow(widht*4, 500);
  spawnWindow(widht*5, 450);
  spawnWindow(widht*6, 450);
}


function crash(brick, object) {
  object.destroy();
  score++;
  scoreText.setText(score);
  game.camera.shake(0.01, 200);
}
