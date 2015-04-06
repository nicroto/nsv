'use strict';

var CONST = require("./const");

function Player(Phaser, game, position, state) {
	var self = this;

	self.Phaser = Phaser;
	self.game = game;

	self.position = position;

	var sprite = game.add.sprite( position.x, position.y, "player" );

	// physics
	game.physics.enable( sprite, Phaser.Physics.P2JS );
	sprite.body.clearShapes();
	sprite.body.loadPolygon('playerPhysics', 'player');
	sprite.body.collideWorldBounds = false;
	sprite.body.data.gravityScale = 0;

	sprite.angle = position.angle;
	sprite.anchor.setTo( 0.5, 0.95 );
	self.sprite = sprite;

	var style = { font: "30px Arial", fill: "#ffffff", align: "center" },
		livesTextVisual = game.add.text(
			game.width - 150,
			32,
			"Lives: " + state.livesLeft,
			style
		),
		levelTextVisual = game.add.text(
			40,
			game.height - 70,
			"Level: " + state.level,
			style
		);
	self.livesTextVisual = livesTextVisual;
	self.levelTextVisual = levelTextVisual;
}

Player.prototype = {

	Phaser: null,
	game: null,

	position: null,
	sprite: null,
	livesTextVisual: null,

	isFlying: false,
	leftCannonPremise: false,

	preload: function(Phaser, game) {
		game.load.image( "player", "assets/player.png" );
		game.load.physics( "playerPhysics", "assets/player-physics.json" );
	},

	update: function() {},

	render: function() {},

	launchFlight: function(velocityVecotr) {
		var self = this,
			sprite = self.sprite;

		self.isFlying = true;
		self.leftCannonPremise = false;

		sprite.body.data.gravityScale = 1;
		sprite.body.velocity.x = velocityVecotr.x;
		sprite.body.velocity.y = velocityVecotr.y;
	},

	endFlight: function() {
		var self = this,
			sprite = self.sprite;

		self.isFlying = false;

		sprite.body.data.gravityScale = 0;
		sprite.body.velocity.x = 0;
		sprite.body.velocity.y = 0;
	},

	setPosition: function(position) {
		var self = this,
			sprite = self.sprite;

		sprite.body.x = position.x;
		sprite.body.y = position.y;
		sprite.body.angle = position.angle;

		self.position = position;
	},

	die: function(state) {
		var self = this;

		state.livesLeft -= 1;
		self.livesTextVisual.setText( "Lives: " + state.livesLeft );

		if ( state.livesLeft > 0 ) {
			state.restartLevel = true;
		} else {
			state.gameOver = true;
		}
	},

	reset: function() {
		var self = this;

		self.setPosition( self.position );
	},

	recycle: function() {
		var self = this;

		self.sprite.kill();
		self.livesTextVisual.destroy();
		self.levelTextVisual.destroy();
	}

};

module.exports = Player;