'use strict';

var CONST = require("./const");

function Player(Phaser, game, position) {
	var self = this;

	self.position = position;

	var sprite = game.add.sprite( position.x, position.y, "player" );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.body.collideWorldBounds = false;
	sprite.body.moves = false;
	sprite.angle = position.angle;
	sprite.anchor.setTo( 0.5, 0.95 );

	self.sprite = sprite;

	self.livesLeft = CONST.PLAYER_INITIAL_LIVES_COUNT;
}

Player.prototype = {

	position: null,
	sprite: null,

	livesLeft: -1,

	isFlying: false,
	leftCannonPremise: false,

	preload: function(Phaser, game) {
		game.load.image( "player", "assets/player.png" );
	},

	update: function() {

	},

	render: function() {},

	launchFlight: function(velocityVecotr) {
		var self = this,
			sprite = self.sprite;

		self.isFlying = true;
		self.leftCannonPremise = false;
		sprite.body.moves = true;

		sprite.body.allowGravity = true;  
		sprite.body.gravity.setTo(
			CONST.PLAYER_GRAVITY_X,
			CONST.PLAYER_GRAVITY_Y
		);
		sprite.body.velocity.setTo(
			velocityVecotr.x,
			velocityVecotr.y
		);
	},

	endFlight: function() {
		var self = this,
			sprite = self.sprite;

		self.isFlying = false;
		sprite.body.moves = false;
	},

	setPosition: function(position) {
		var self = this,
			sprite = self.sprite;

		sprite.x = position.x;
		sprite.y = position.y;
		sprite.angle = position.angle;

		self.position = position;
	},

	die: function() {
		var self = this;
		self.livesLeft -= 1;

		return self.livesLeft > 0;
	},

	reset: function() {
		var self = this;

		self.setPosition( self.position );
	}

};

module.exports = Player;