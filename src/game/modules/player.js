'use strict';

var CONST = require("./const");

function Player(Phaser, game, position, livesLeft) {
	var self = this;

	self.position = position;

	var sprite = game.add.sprite( position.x, position.y, "player" );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.body.collideWorldBounds = false;
	sprite.body.moves = false;
	sprite.angle = position.angle;
	sprite.anchor.setTo( 0.5, 0.95 );
	self.sprite = sprite;

	var text = "Lives: " + livesLeft,
		style = { font: "30px Arial", fill: "#ffffff", align: "center" },
		livesTextVisual = game.add.text(
			game.width - 150,
			32,
			text,
			style
		);
	self.livesTextVisual = livesTextVisual;
}

Player.prototype = {

	position: null,
	sprite: null,
	livesTextVisual: null,

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

	die: function(state) {
		var self = this;
		state.livesLeft -= 1;
		self.livesTextVisual.setText( "Lives: " + state.livesLeft );

		return state.livesLeft > 0;
	},

	reset: function() {
		var self = this;

		self.setPosition( self.position );
	},

	recycle: function() {
		var self = this;

		self.sprite.kill();
		self.livesTextVisual.destroy();
	}

};

module.exports = Player;