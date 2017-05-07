var mapDimX = 24;
var mapDimY = 80;

var TILE_WIDTH = 26;
var TILE_HEIGHT = 25;

var GAME_WINDOW_WIDTH = TILE_WIDTH * mapDimX;
var GAME_WINDOW_HEIGHT = 960;

var GROUND_HEIGHT = 110;

var MAX_POWER_LEVEL = 1;
var CHECKPOINT_NUMBER = 3;
var TILES_IN_ONE_CHECKPOINT_AREA = parseInt((mapDimY - 4 )/CHECKPOINT_NUMBER);
// 4 zajmuje topPanel
