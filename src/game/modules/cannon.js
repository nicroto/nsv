'use strict';

var CONST = require("./const");

var $ = require("jquery");

function Cannon(Phaser, game, position, index, player) {
	var self = this;

	self.Phaser = Phaser;
	self.game = game;

	self.position = position;
	self.index = index;

	// base
	var baseSprite = game.add.sprite(
		position.x,
		position.y,
		"cannon-base"
	);
	game.physics.enable( baseSprite, Phaser.Physics.P2JS );
	baseSprite.body.data.gravityScale = 0;
	baseSprite.body.angle = position.angle;
	baseSprite.anchor.setTo( 0.5 );

	// events
	baseSprite.inputEnabled = true;
	baseSprite.input.start( 0, true );
	baseSprite.events.onInputDown.add(
		$.proxy( self.onInputDown, self )
	);
	baseSprite.events.onInputUp.add(
		$.proxy( self.onInputUp, self )
	);
	self.baseSprite = baseSprite;

	self.resetBase( position );

	// gun
	self.initGun( position );

	// power
	self.initPower( position );

	if ( player ) {
		self.loadPlayer( player );
	}
}

Cannon.prototype = {

	Phaser: null,
	game: null,

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

	resetBase: function(position) {
		var self = this,
			baseSprite = self.baseSprite;

		baseSprite.body.x = position.x;
		baseSprite.body.y = position.y;
		baseSprite.body.angle = position.angle;
	},

	initGun: function(position) {
		var self = this,
			Phaser = self.Phaser,
			game = self.game,
			sprite = game.add.sprite(
				position.x,
				position.y,
				"cannon-gun"
			);

		self.gun = {
			sprite: sprite,
			originalAngle: null,
			angleUpperBoundRad: null,
			angleLowerBoundRad: null,
			isRotationStick: false
		};

		self.resetGun( position );

		game.physics.enable( sprite, Phaser.Physics.ARCADE );

		sprite.body.allowGravity = false;
		sprite.anchor.setTo( 0.05, 0.5 );

	},

	resetGun: function(position) {
		var self = this,
			Phaser = self.Phaser,
			gun = self.gun,
			originalAngle = position.angle - 90,
			originalAngleRad = Phaser.Math.degToRad( originalAngle ),
			quarterPi = Math.PI / 4,
			upperBoundRad = originalAngleRad - quarterPi,
			lowerBoundRad = originalAngleRad + quarterPi;

		gun.originalAngle = originalAngle;
		gun.angleUpperBoundRad = upperBoundRad;
		gun.angleLowerBoundRad = lowerBoundRad;
		gun.isRotationStick = false;

		gun.sprite.x = position.x;
		gun.sprite.y = position.y;
		gun.sprite.angle = originalAngle;
	},

	initPower: function(position) {
		var self = this,
			Phaser = self.Phaser,
			game = self.game,
			sprite = game.add.sprite(
				position.x,
				position.y,
				'power'
			);

		game.physics.enable( sprite, Phaser.Physics.ARCADE );
		sprite.body.allowGravity = false;
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

		self.resetPower( position );
	},

	resetPower: function(position) {
		var self = this,
			power = self.power,
			sprite = power.sprite;

		sprite.x = position.x;
		sprite.y = position.y;
		sprite.height = 0;
		sprite.width = 8;
		sprite.alpha = 0;
	},

	update: function(state) {
		var self = this,
			player = self.player,
			timer = self.timer,
			baseSprite = self.baseSprite,
			position = self.position;

		if ( player && !timer && !player.isFlying ) {
			self.startCountDown( state );
		}

		self.updateRotation( state );
	},

	render: function() {

	},

	loadPlayer: function( player ) {
		var self = this;

		player.endFlight();
		player.setPosition( self.position );
		self.player = player;
	},

	detachFromPlayer: function() {
		var self = this;
		self.player = null;
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
		var self = this,
			power = self.power,
			player = self.player,
			velocityVector = self.getVelocityVector();

		// hide power
		power.sprite.alpha = 0;
		player.launchFlight( velocityVector );
	},

	getVelocityVector: function() {
		//                                               A
		//
		//                                             X  
		//                                          XXXX  
		//                                       XXXX  X  
		//                                    XXXX     X  
		//                                 XXXX   -50º X  
		//                              XXXX           X  
		//                           XXXX              X  
		//                         XXX                 X  
		//                       XX                    X  
		//                    XXX                      X  
		//                  XX                         X  
		//               XXX                           X  
		//            XXX                         XXXXXX  
		//        XXX                            XX    X  
		//      XXX                              XX  X X  
		//     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  
		//
		// B                                             C
		var self = this,
			power = self.power,
			rawAngle = power.sprite.angle,
			xSign = rawAngle < 0 ? -1 : 1,
			ySign = rawAngle < -90 ? 1 : -1,
			angleADeg = rawAngle < 0 ? -rawAngle : rawAngle,
			angleCDeg = 90,
			angleBDeg = 180 - ( angleCDeg + angleADeg ),
			sideAB = power.sprite.height, // hypothenuse
			ratio = angleCDeg / sideAB,
			sideAC = angleBDeg / ratio,
			sideBC = angleADeg / ratio,
			multiplayer = CONST.CANNON_POWER_MULTIPLIER;

		return {
			x: xSign * sideBC * multiplayer,
			y: ySign * sideAC * multiplayer
		};
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
				verticalItemsAngle;

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
				// optimization: power and player angle is directly derrived
				verticalItemsAngle = newAngleRad + Math.PI / 2;

				gunSprite.rotation = newAngleRad;
				if ( self.player ) {
					self.player.sprite.body.rotation = verticalItemsAngle;
				}
			}

			self.updatePower( state, verticalItemsAngle );
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
	},

	reset: function() {
		var self = this,
			position = self.position;

		self.resetBase( position );
		self.resetGun( position );
		self.resetPower( position );
	},

	recycle: function() {
		var self = this,
			gun = self.gun,
			power = self.power;

		self.baseSprite.kill();
		gun.sprite.kill();
		power.sprite.kill();
	}

};

module.exports = Cannon;