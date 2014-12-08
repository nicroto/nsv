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
	self.baseSprite = baseSprite;

	// gun
	self.initGun( Phaser, game, position );

	// ellastic
	var ellasticSprite = game.add.sprite(400, 350, 'ellastic');
	game.physics.enable( ellasticSprite, Phaser.Physics.ARCADE );
	ellasticSprite.body.allowGravity = false;
	ellasticSprite.width = 8;
	ellasticSprite.rotation = 220;
	ellasticSprite.alpha = 0;
	ellasticSprite.anchor.setTo(0.5, 0.0);
	self.ellasticSprite = ellasticSprite;
}

Cannon.prototype = {

	position: null,
	gun: null,
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

	initGun: function(Phaser, game, position) {
		var self = this,
			sprite = game.add.sprite(
				position.x,
				position.y,
				"cannon-gun"
			),
			originalAngle = position.angle - 90,
			originalAngleRad = Phaser.Math.degToRad( originalAngle ),
			quarterPi = Math.PI / 4,
			upperBoundRad = originalAngleRad - quarterPi,
			lowerBoundRad = originalAngleRad + quarterPi;

		game.physics.enable( sprite, Phaser.Physics.ARCADE );

		sprite.angle = originalAngle;
		sprite.body.allowGravity = false;
		sprite.anchor.setTo( 0.05, 0.5 );

		self.gun = {
			sprite: sprite,
			originalAngle: originalAngle,
			angleUpperBoundRad: upperBoundRad,
			angleLowerBoundRad: lowerBoundRad,
			isRotationStick: false
		};
	},

	update: function(state) {
		var self = this;

		self.updateRotation( state );
	},

	render: function() {

	},

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
			game = state.game,
			gun = self.gun,
			gunSprite = gun.sprite;

		if ( self.isPowerLoading ) {
			var newAngleRad =
				game.physics.arcade.angleToPointer( gunSprite )- Math.PI,
				beforeUpper = newAngleRad < gun.angleUpperBoundRad,
				afterLower = newAngleRad > gun.angleLowerBoundRad;

			if ( beforeUpper || afterLower ) {
				if ( gun.isRotationStick ) {
					return;
				} else {
					gun.isRotationStick = true;
				}
			}

			if ( beforeUpper ) {
				newAngleRad = gun.angleUpperBoundRad;
			} else if ( afterLower ) {
				newAngleRad = gun.angleLowerBoundRad;
			} else {
				gun.isRotationStick = false;
			}

			gunSprite.rotation = newAngleRad;
		}
	}

};

module.exports = Cannon;