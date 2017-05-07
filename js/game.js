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

  windows = game.add.group();
  game.time.events.loop(500, spawnWindow);
}

function update() {
  brick.x = game.input.x;
  brick.y = game.input.y;

  game.physics.arcade.collide(brick, windows, crash);

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
}

function spawnWindow() {
  var randomPosition = game.rnd.integerInRange(0, game.world.width-100);
  var randomFrame = game.rnd.integerInRange(0, 2);
  object = game.add.sprite(randomPosition, -100, 'windows', randomFrame);
  game.physics.enable(object, Phaser.Physics.ARCADE);
  object.body.gravity.y = 450;
  windows.add(object);
}

function crash(brick, object) {
  object.destroy();
  score++;
  scoreText.setText(score);
  game.camera.shake(0.01, 200);
}
