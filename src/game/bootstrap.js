'use strict';

var $ = require("jquery"),
	CONST = require("./modules/const"),
	State = require("./modules/state"),
	state = new State(),
	LevelManager = require("./modules/level-manager"),
	levelManager = new LevelManager( state );

$( function() {

state.Phaser = Phaser;

state.game = new Phaser.Game(

	CONST.SCREEN_SIZE_X,
	CONST.SCREEN_SIZE_Y,
	Phaser.CANVAS,
	CONST.HTML_CONTAINER,

	{
		preload: function(){ levelManager.preload(); },
		create: function(){ levelManager.create(); },
		update: function(){ levelManager.update(); },
		render: function(){ levelManager.render(); }
	}

);

} );