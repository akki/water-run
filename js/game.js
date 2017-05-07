var mapDimX = 20;
var mapDimY = 100;

var TILE_WIDTH = 32;
var TILE_HEIGHT = 29;

var GAME_WINDOW_WIDTH = TILE_WIDTH * mapDimX;
var GAME_WINDOW_HEIGHT = 960;

var MAX_POWER_LEVEL = 3;

var game = new Phaser.Game(GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT, Phaser.CANVAS, null, { preload: preload, create: create, update: update });

var myFont;
var player, object, powerLevel = 0;

var map, mapLayer, currentTimer;

var music, musicCtrl;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#037A88';

  game.load.image('background', 'img/background.png');
  game.load.image('ground', 'img/ground.png');
  game.load.image('player', 'img/brick.png');
  game.load.image('windows', 'img/windows.png');

  game.load.spritesheet('audio-control', 'img/button-sound.png', 180, 180)
  game.load.audio('level01', ['music/level01.mp3', 'music/level01.ogg']);

}

function create() {
  game.add.sprite(0, 0, 'background');
  game.add.sprite(0, 292, 'ground');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  spawnPlayer();
  spawnWindows();
  createPowerLevel();
  game.camera.follow(player);
  game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

  var buttonMusic = this.add.button(500, 20, 'audio-control', this.clickMusic, this, 1,0,2);
  buttonMusic.setFrames(1, 0, 2);
  buttonMusic.fixedToCamera = true;

  music = game.add.audio('level01');
  music.loopFull();
  music.play();
}

function clickMusic() {
  music.stop();
}

function updateCounter() {
  if(powerLevel < MAX_POWER_LEVEL){
    powerLevel++;
    powerLevelText.setText(powerLevel);
  }
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

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.onFloor() && powerLevel == MAX_POWER_LEVEL) {
    player.body.velocity.y = -450;
    powerLevel = 0;
    powerLevelText.setText(powerLevel);
  }

}

function spawnPlayer() {
  player = game.add.sprite(game.world.CenterX, TILE_HEIGHT*(mapDimY-1), 'player');
  player.anchor.set(0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.gravity.y = 600;
  player.body.collideWorldBounds = true;
}

function createPowerLevel(){
  powerLevelText = game.add.text(20,20, powerLevel , {font: "48px Arial", fill: "#000"});
  powerLevelText.fixedToCamera = true;
}

function createMusicOnOff() {

}

function spawnWindows() {
  map = game.add.tilemap();
  map.addTilesetImage('windows', 'windows', TILE_WIDTH, TILE_HEIGHT);
  map.setCollision([0, 1, 2], true);

  mapLayer = map.create('level', mapDimX, mapDimY, TILE_WIDTH, TILE_HEIGHT);
  mapLayer.resizeWorld();

  var WINDOW = 0;
  var lastStart = 0;
  var lastEnd = 0;
  for (var i = 0; i < mapDimY - 2; i++) {
    var startPositionX;
    var leafLength = game.rnd.integerInRange(5, 7);
    do {
      startPositionX = game.rnd.integerInRange(0, mapDimX - 7);
    }
    while (!(startPositionX + 2 <= lastStart
      || startPositionX + leafLength - 2 >= lastEnd ))

    for (var j = 0; j < leafLength; j++) {
      map.putTile(WINDOW, startPositionX + j, i * 2, mapLayer);
    }
    lastStart = startPositionX;
    lastEnd = lastStart + leafLength;
  }

  // floor:
  for (var j = 0; j < mapDimX; j++) {
    map.putTile(WINDOW, j, mapDimY - 1, mapLayer);
  }
}
