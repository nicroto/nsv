'use strict';

var CONST = require("./const");

var $ = require("jquery");

function Cannon(Phaser, game, position, index, player) {
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

	// power
	self.initPower( Phaser, game, position );

	if ( player ) {
		self.player = player;
	}
}

Cannon.prototype = {

	position: null,
	index: -1,

	baseSprite: null,
	gun: null,
	power: null,

	player: null,
	timer: null,

	preload: function(Phaser, game) {
		game.load.image( "cannon-base", "assets/cannon-base.gif" );
		game.load.image( "cannon-gun", "assets/cannon-gun.gif" );
		game.load.image( "power", "assets/ellastic.png" );
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

	initPower: function(Phaser, game, position) {
		var self = this,
			sprite = game.add.sprite(
				position.x,
				position.y,
				'power'
			);

		game.physics.enable( sprite, Phaser.Physics.ARCADE );
		sprite.body.allowGravity = false;
		sprite.height = 0;
		sprite.width = 8;
		sprite.alpha = 0;
		sprite.anchor.setTo( 0.5, 0.0 );

		// events
		sprite.inputEnabled = true;
		sprite.input.start( 0, true );
		sprite.events.onInputDown.add(
			$.proxy( self.onInputDown, self )
		);
		sprite.events.onInputUp.add(
			$.proxy( self.onInputUp, self )
		);

		self.power = {
			sprite: sprite,
			dragging: false
		};
	},

	update: function(state) {
		var self = this;

		if ( self.player && !self.timer ) {
			self.startCountDown( state );
		}

		self.updateRotation( state );
	},

	render: function() {

	},

	startCountDown: function(state) {
		var self = this;

		self.clearCountdown();

		var game = state.game,
			position = self.position,
			baseSprite = self.baseSprite,
			text = CONST.CANNON_SECONDS_BEFORE_SHOT + "",
			style = { font: "15px Arial", fill: "#ffffff", align: "center" },
			timer = {

				secondsToShooting: CONST.CANNON_SECONDS_BEFORE_SHOT,

				textVisual: game.add.text(
					position.x + baseSprite.width / 2 + 10,
					position.y - baseSprite.height / 2,
					text,
					style
				),

				interval: setInterval( function() {
					timer.secondsToShooting -= 1;
					timer.textVisual.setText( timer.secondsToShooting + "" );
					if ( timer.secondsToShooting === 0 ) {
						self.clearCountdown();
						self.shoot();
					}
				}, 1000 )

			};

		self.timer = timer;
	},

	clearCountdown: function() {
		var self = this,
			timer = self.timer;

		if ( timer ) {
			clearInterval( timer.interval );
			timer.textVisual.destroy();

			self.timer = null;
		}
	},

	shoot: function() {
		// TODO:
		console.log( "Shoot!" )
	},

	onInputDown: function() {
		var self = this;
		self.power.dragging = true;
	},

	onInputUp: function() {
		var self = this;
		self.power.dragging = false;
	},

	updateRotation: function(state) {
		var self = this,
			game = state.game,
			gun = self.gun,
			gunSprite = gun.sprite;

		if ( self.power.dragging ) {
			var newAngleRad =
					game.physics.arcade.angleToPointer( gunSprite ) - Math.PI,
				beforeUpper = newAngleRad < gun.angleUpperBoundRad,
				afterLower = newAngleRad > gun.angleLowerBoundRad,
				shouldRotate = true,
				powerAngle;

			if ( beforeUpper || afterLower ) {
				if ( gun.isRotationStick ) {
					shouldRotate = false;
				} else {
					gun.isRotationStick = true;
				}
			}

			if ( shouldRotate ) {
				if ( beforeUpper ) {
					newAngleRad = gun.angleUpperBoundRad;
				} else if ( afterLower ) {
					newAngleRad = gun.angleLowerBoundRad;
				} else {
					gun.isRotationStick = false;
				}
				gunSprite.rotation = newAngleRad;
				// optimization: power angle can be directly derrived
				powerAngle = newAngleRad + Math.PI / 2;
			}

			self.updatePower( state, powerAngle );
		}
	},

	updatePower: function(state, angle) {
		var self = this,
			game = state.game,
			baseSprite = self.baseSprite,
			sprite = self.power.sprite,
			newHeight = game.physics.arcade.distanceToPointer( baseSprite );

		sprite.alpha = 0.5;

		if ( angle !== undefined ) {
			sprite.rotation = angle;
		}

		sprite.height = ( newHeight < CONST.CANNON_POWER_HEIGTH_MAX ) ?
			newHeight : CONST.CANNON_POWER_HEIGTH_MAX;
	}

};

module.exports = Cannon;