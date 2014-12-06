'use strict';

var CONST = require("./const"),
	Player = require("./player"),
	Cannon = require("./cannon");

function LevelManager(state) {
	var self = this;

	self.state = state;
}

LevelManager.prototype = {

	state: null,
	level: 1,

	preload: function() {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game;

		Player.prototype.preload( Phaser, game );
		Cannon.prototype.preload( Phaser, game );

		// preload level
		game.load.tilemap( "tilemap", "assets/levels/tilemap.json", null, Phaser.Tilemap.TILED_JSON );
		game.load.image( "tiles", "assets/levels/tileset.png" );
	},

	create: function() {
		var self = this,
			state = self.state,
			game = state.game,
			Phaser = state.Phaser;

		// This will run in Canvas mode, so let's gain a little speed and display
		game.renderer.clearBeforeRender = false;
		game.renderer.roundPixels = true;

		game.physics.startSystem( Phaser.Physics.ARCADE );

		var map = game.add.tilemap( 'tilemap' );
		map.addTilesetImage('tile-set', 'tiles');
		state.map = map;

		self.createLevel();

		//  This resizes the game world to match the layer dimensions
		// layer.resizeWorld();
	},

	update: function() {
		var self = this,
			state = self.state;

		state.objects.forEach( function(element) {
			element.update();
		} );
	},

	render: function() {
		var self = this,
			state = self.state;

		state.objects.forEach( function(element) {
			element.render();
		} );
	},

	createLevel: function() {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game,
			level = self.level,
			map = state.map;

		state.objects.push( new Player( Phaser, game ) );
		state.objects.push( new Cannon( Phaser, game, { x: 300, y: 300 } ) );

		var layer = map.createLayer( level + "-background" );

		state.layer = layer;
	}

};

module.exports = LevelManager;