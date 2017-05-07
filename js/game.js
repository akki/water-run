var mapDimX = 8;
var mapDimY = 100;

var TILE_WIDTH = 82;
var TILE_HEIGHT = 75;

var GAME_WINDOW_WIDTH = TILE_WIDTH * mapDimX;
var GAME_WINDOW_HEIGHT = 960;

var game = new Phaser.Game(GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT, Phaser.CANVAS, null, { preload: preload, create: create, update: update });

var myFont;
var player, object, score = 0;

var map, mapLayer;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#037A88';

  game.load.image('background', 'img/background.png');
  game.load.image('ground', 'img/ground.png');
  game.load.image('player', 'img/brick.png');
  game.load.image('windows', 'img/windows.png');
}

function create() {
  game.add.sprite(0, 0, 'background');
  game.add.sprite(0, 292, 'ground');

  game.physics.startSystem(Phaser.Physics.ARCADE);

  spawnPlayer();
  spawnWindows();

  game.camera.follow(player);
}


function update() {

  game.physics.arcade.collide(player, mapLayer);

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    player.body.velocity.x = -250;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    player.body.velocity.x = 250;
  } else {
    player.body.velocity.x = 0;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.onFloor()) {
    player.body.velocity.y = -300;
  }

}

function spawnPlayer() {
  player = game.add.sprite(game.world.CenterX, TILE_HEIGHT*(mapDimY-1), 'player');
  player.anchor.set(0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.gravity.y = 500;
  player.body.collideWorldBounds = true;
}

function spawnWindows() {
  map = game.add.tilemap();
  map.addTilesetImage('windows', 'windows', TILE_WIDTH, TILE_HEIGHT);
  map.setCollision([0, 1, 2], true);

  mapLayer = map.create('level', mapDimX, mapDimY, TILE_WIDTH, TILE_HEIGHT);
  mapLayer.resizeWorld();

  var WINDOW = 0;
  for (var i = 0; i < mapDimY - 2; i++) {
    var xPos = i % 2 ? 0 : 5;
    map.putTile(WINDOW, xPos, i, mapLayer);
    map.putTile(WINDOW, xPos + 1, i, mapLayer);
    map.putTile(WINDOW, xPos + 2, i, mapLayer);
  }

  for (var j = 0; j < mapDimX; j++) {
    map.putTile(WINDOW, j, mapDimY-1, mapLayer);
  }
}
