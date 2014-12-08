'use strict';

var utils = require("./utils"),
	Player = require("./player"),
	Cannon = require("./cannon"),
	Target = require("./target");

function LevelManager(state) {
	var self = this;

	self.state = state;
}

LevelManager.prototype = {

	state: null,

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
			element.update( state );
		} );
	},

	render: function() {
		var self = this,
			state = self.state;

		state.objects.forEach( function(element) {
			element.render( state );
		} );
	},

	createLevel: function() {
		var self = this,
			state = self.state,
			level = state.level,
			map = state.map,
			backgroundLayerName = level + "-background",
			objectsLayerName = level + "-objects";

		var layer = map.createLayer( backgroundLayerName );
		state.layer = layer;

		var levelObjects = map.objects[ objectsLayerName ];

		levelObjects.forEach( function( element ) {
			var customProps = element.properties,
				position = utils.getMidPoint(
					element.x,
					element.y,
					element.width,
					element.height,
					customProps.rotation
				);

			position.angle = customProps.rotation;

			switch( element.name ) {
				case "start":
					self.createStartPoint( position );
					break;
				case "cannon":
					var index;
					try {
						index = JSON.parse( customProps.index );
					} catch(exception) {
						throw new Error( "Error: can't parse cannonObject.properties.index: " + exception.message );
					}
					self.createCannon( position, index );
					break;
				case "target":
					self.createTarget( position );
					break;
				default:
					break;
			}
		} );

		self.verifyLevelIsLoadedCorrectly();
	},

	createStartPoint: function(position) {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game,
			player = new Player( Phaser, game, position );

		state.objects.push( player );

		state.player = player;

		var indexInCannonsArray = 0;
		self.createCannon( position, indexInCannonsArray, player );
	},

	createCannon: function(position, index, player) {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game,
			cannon = new Cannon( Phaser, game, position, index, player );

		if ( index === undefined || index < 0 ) {
			throw new Error( "Level is not valid - cannon object with .properties.index = " + index );
		}

		state.objects.push( cannon );
		state.cannons[ index ] = cannon;
	},

	createTarget: function(position) {
		var self = this,
			state = self.state,
			Phaser = state.Phaser,
			game = state.game,
			target = new Target( Phaser, game, position );

		state.objects.push( target );
		state.target = target;
	},

	verifyLevelIsLoadedCorrectly: function() {
		var self = this,
			state = self.state,
			player = state.player,
			cannons = state.cannons,
			target = state.target;

		if ( !player ) {
			throw new Error( "Level is not loaded correctly - no player!" );
		}
		if ( !target ) {
			throw new Error( "Level is not loaded correctly - no target!" );
		}
		if ( !cannons || !cannons.length ) {
			throw new Error( "Level is not loaded correctly - no cannons!" );
		}

		for ( var i = 0; i < cannons.length; i++ ) {
			if ( cannons[i] === undefined ) {
				throw new Error( "Level is not loaded correctly - empty cannon index!" );
			}
		}
	}

};

module.exports = LevelManager;