'use strict';

var $ = require("jquery");

function Cannon(Phaser, game, position, index) {
	var self = this;

	self.position = position;
	self.index = index;

	// base
	var baseSprite = game.add.sprite(
		position.x,
		position.y,
		"cannon-base"
	);
	game.physics.enable( baseSprite, Phaser.Physics.ARCADE );
	baseSprite.body.allowGravity = false;
	baseSprite.angle = position.angle;
	baseSprite.anchor.setTo( 0.5 );
	baseSprite.inputEnabled = true;
	baseSprite.input.start( 0, true );
	baseSprite.events.onInputDown.add(
		$.proxy( self.onInputDown, self )
	);
	baseSprite.events.onInputUp.add(
		$.proxy( self.onInputUp, self )
	);

	// gun
	var gunSprite = game.add.sprite(
		position.x,
		position.y,
		"cannon-gun"
	);
	game.physics.enable( gunSprite, Phaser.Physics.ARCADE );
	gunSprite.body.allowGravity = false;
	gunSprite.angle = self.gunAngle = position.angle - 90;
	gunSprite.anchor.setTo( 0.05, 0.5 );

	// ellastic
	var ellasticSprite = game.add.sprite(400, 350, 'ellastic');
	game.physics.enable( ellasticSprite, Phaser.Physics.ARCADE );
	ellasticSprite.body.allowGravity = false;
	ellasticSprite.width = 8;
	ellasticSprite.rotation = 220;
	ellasticSprite.alpha = 0;
	ellasticSprite.anchor.setTo(0.5, 0.0);

	self.baseSprite = baseSprite;
	self.gunSprite = gunSprite;
	self.ellasticSprite = ellasticSprite;
}

Cannon.prototype = {

	position: null,
	gunAngle: null,
	index: -1,

	baseSprite: null,
	gunSprite: null,
	ellasticSprite: null,

	isPowerLoading: false,
	hasFired: false,

	preload: function(Phaser, game) {
		game.load.image( "cannon-base", "assets/cannon-base.gif" );
		game.load.image( "cannon-gun", "assets/cannon-gun.gif" );
		game.load.image( "ellastic", "assets/ellastic.png" );
	},

	update: function(state) {
		var self = this,
			Phaser = state.Phaser,
			game = state.game,
			gunSprite = self.gunSprite;

		self.updateRotation( state )
	},

	render: function() {},

	onInputDown: function() {
		var self = this;
		self.isPowerLoading = true;
	},

	onInputUp: function() {
		var self = this;
		self.isPowerLoading = false;
	},

	updateRotation: function(state) {
		var self = this,
			Phaser = state.Phaser,
			game = state.game,
			gunSprite = self.gunSprite;

		if ( self.isPowerLoading ) {
			var originalAngleRad = Phaser.Math.degToRad( self.gunAngle ),
				newAngleRad = game.physics.arcade.angleToPointer( gunSprite ),
				quarterPi = Math.PI / 4,
				upperBoundRad = originalAngleRad - quarterPi,
				lowerBoundRad = originalAngleRad + quarterPi;

			if ( newAngleRad < upperBoundRad ) {
				newAngleRad = upperBoundRad;
			} else if ( newAngleRad > lowerBoundRad ) {
				newAngleRad = lowerBoundRad;
			}

			gunSprite.rotation = newAngleRad;
		}
	}

};

module.exports = Cannon;