var mapDimX = 24;
var mapDimY = 80;

var TILE_WIDTH = 26;
var TILE_HEIGHT = 25;

var GAME_WINDOW_WIDTH = TILE_WIDTH * mapDimX;
var GAME_WINDOW_HEIGHT = 960;

var GROUND_HEIGHT = 110;

var MAX_POWER_LEVEL = 1;
var CHECKPOINT_NUMBER = 3;
var TILES_IN_ONE_CHECKPOINT_AREA = parseInt(mapDimY/CHECKPOINT_NUMBER);

var game = new Phaser.Game(GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT, Phaser.CANVAS, null, { preload: preload, create: create, update: update });

var myFont;

var player, object, powerLevel = 0, score = 0;
var currentCheckpointArea = 1;

var player, object, powerLevel = 0;

var facing = 'idle';

var map, mapLayer, droplets, currentTimer;

var music;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#037A88';

  game.load.image('background', 'img/background.png');
  game.load.image('pnacza', 'img/pnacza.png');
  game.load.image('ground', 'img/ground.png');
  game.load.spritesheet('player', 'img/player.png', 64, 34);
  game.load.image('tiles', 'img/tiles.png');
  game.load.spritesheet('audio-control', 'img/button-sound.png', 80, 80);
  game.load.spritesheet('cloud', 'img/clouds.png', 153, 58);
  game.load.image('droplet', 'img/droplet.png');

  game.load.audio('level01', ['music/level01.mp3', 'music/level01.ogg']);
}

function create() {
  var background = game.add.sprite(0, 0, 'background');
  background.fixedToCamera = true;

  game.add.tileSprite(0, 0, GAME_WINDOW_WIDTH, TILE_HEIGHT * mapDimY, 'pnacza');

  for (var i = 0; i < 3; i++) {
    var cloud = game.add.sprite(60, 150*(2*i+1), 'cloud', 0);
    cloud.fixedToCamera = true;

    cloud = game.add.sprite(400, 150*(2*i+2), 'cloud', 1);
    cloud.fixedToCamera = true;
  };

  game.add.sprite(0, TILE_HEIGHT * mapDimY - GROUND_HEIGHT, 'ground');

  game.physics.startSystem(Phaser.Physics.ARCADE);
  spawnPlayer();
  droplets = game.add.group();
  createMap();
  createPowerLevelText();
  createScoreText();
  game.camera.follow(player);
  game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

  var buttonMusic = this.add.button(GAME_WINDOW_WIDTH - 128, GAME_WINDOW_HEIGHT-128, 'audio-control', clickMusic, this, 1,0,2);
  buttonMusic.setFrames(1, 0, 2);
  buttonMusic.fixedToCamera = true;

  music = game.add.audio('level01');
  music.loopFull();
  music.play();
}

function clickMusic() {
  if (music.paused) {
    music.resume();
  } else {
    music.pause();
  }
}

function updateCounter() {
  if(powerLevel < MAX_POWER_LEVEL){
    powerLevel++;
    powerLevelText.setText(powerLevel);
  }
}

function update() {
  game.physics.arcade.collide(player, mapLayer);

  game.physics.arcade.collide(player, droplets, function (player, droplet) {
    droplet.destroy();
      updateScore(1);
  });

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    if (facing != 'left') {
      facing = 'left';
      player.animations.play('left');
    }
    player.body.velocity.x = -250;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    if (facing != 'right') {
      facing = 'right';
      player.animations.play('right');
    }
    player.body.velocity.x = 250;
  } else {
    if (facing != 'idle') {
      facing = 'idle';
      player.animations.play('idle');
    }
    player.body.velocity.x = 0;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.onFloor() && powerLevel == MAX_POWER_LEVEL) {
    player.body.velocity.y = -450;
    powerLevel = 0;
    powerLevelText.setText(powerLevel);
  }

  if(checkpointIsCrossed()){
    updateScore(10);
  }

}

function checkpointIsCrossed(){
  var currentPlayerTileYPosition = mapDimY - mapLayer.getTileY(player.body.position.y);
  if(currentPlayerTileYPosition >= TILES_IN_ONE_CHECKPOINT_AREA * currentCheckpointArea){
    currentCheckpointArea++;
    return true;
  }
  return false;
}

function updateScore(scores){
  score += scores;
  scoreText.setText("Score: " + score);
}

function spawnPlayer() {
  player = game.add.sprite(game.world.CenterX, TILE_HEIGHT*(mapDimY-2.5), 'player');
  player.anchor.set(0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.gravity.y = 600;
  player.body.collideWorldBounds = true;
  player.animations.add('idle', [6], 20, true);
  player.animations.add('left', [5, 4, 3, 2, 1, 0], 5, false);
  player.animations.add('right', [8, 9, 10, 11, 12, 13], 5, false);
  player.animations.play('idle');
}

function createPowerLevelText(){
  powerLevelText = game.add.text(20,20, powerLevel , {font: "48px Arial", fill: "#000"});
  powerLevelText.fixedToCamera = true;
}

function createMusicOnOff() {

}

function createScoreText(){
  scoreText = game.add.text(GAME_WINDOW_WIDTH-250,20, "Score: " + score , {font: "48px Arial", fill: "#000"});
  scoreText.fixedToCamera = true;
}

function createMap() {
  map = game.add.tilemap();
  map.addTilesetImage('tiles', 'tiles', TILE_WIDTH, TILE_HEIGHT);
  map.setCollisionBetween(0, 13, true); // all tiles will collide

  mapLayer = map.create('level', mapDimX, mapDimY, TILE_WIDTH, TILE_HEIGHT);
  mapLayer.resizeWorld();

  var INVISIBLE_WALL = 0;
  var LEAF_LENGTH = 13;

  var lastStart = 0;
  var lastEnd = 0;
  for (var i = 2; i < mapDimY - 4; i += 4) {
    var startPositionX;
    var leafLength = LEAF_LENGTH;
    do {
      startPositionX = game.rnd.integerInRange(0, mapDimX - LEAF_LENGTH);
    }
    while (!(startPositionX + 2 <= lastStart
      || startPositionX + leafLength - 2 >= lastEnd ))

    for (var j = 0; j < leafLength; j++) {
      map.putTile(j+1, startPositionX + j, i, mapLayer);
    }

    if (game.rnd.integerInRange(0, 5) == 0) {
      // Generate a droplet.
      var posX = game.rnd.integerInRange(startPositionX, startPositionX + leafLength - 1);
      var posY = i - 1;
      addDroplet(posX, posY);
    }

    lastStart = startPositionX;
    lastEnd = lastStart + leafLength;
  }

  // floor:
  for (var j = 0; j < mapDimX; j++) {
    map.putTile(INVISIBLE_WALL, j, mapDimY - 2, mapLayer);
    map.putTile(INVISIBLE_WALL, j, mapDimY - 1, mapLayer);
  }
}

function addDroplet(posX, posY){
      droplet = game.add.sprite(posX*TILE_WIDTH, posY*TILE_HEIGHT, 'droplet');
      game.physics.enable(droplet, Phaser.Physics.ARCADE);
      droplets.add(droplet);
}
