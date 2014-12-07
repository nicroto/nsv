'use strict';

var CONST = require("./const"),
	utils = require("./utils"),
	Player = require("./player"),
	Cannon = require("./cannon"),
	Target = require("./target");

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
		Target.prototype.preload( Phaser, game );

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
			level = self.level,
			map = state.map,
			backgroundLayerName = level + "-background",
			objectsLayerName = level + "-objects";

		var layer = map.createLayer( backgroundLayerName );
		state.layer = layer;

		var levelObjects = map.objects[ objectsLayerName ];

		levelObjects.forEach( function( element ) {
			var position = utils.getMidPoint(
				element.x,
				element.y,
				element.width,
				element.height,
				element.properties.rotation
			);

			position.angle = element.properties.rotation;

			switch( element.name ) {
				case "start":
					self.createStartPoint( position );
					break;
				case "cannon":
					self.createCannon( position );
					break;
				case "target":
					self.createTarget( position );
					break;
				default:
					break;
			}
		} );
	},

	createStartPoint: function(position) {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game,
			player = new Player( Phaser, game, position );

		state.objects.push( player );
		state.objects.push( new Cannon( Phaser, game, position, player ) );
	},

	createCannon: function(position) {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game;

		state.objects.push( new Cannon( Phaser, game, position ) );
	},

	createTarget: function(position) {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game;

		state.objects.push( new Target( Phaser, game, position ) );
	}

};

module.exports = LevelManager;