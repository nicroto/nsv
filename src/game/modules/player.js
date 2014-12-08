'use strict';

function Player(Phaser, game, position) {
	var self = this;

	self.position = position;

	var sprite = game.add.sprite( position.x, position.y, "player" );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.body.collideWorldBounds = false;
	sprite.body.moves = false;
	sprite.body.gravity.setTo( 0, 180 );
	sprite.angle = position.angle;
	sprite.anchor.setTo( 0.5, 0.95 );

	self.sprite = sprite;
}

Player.prototype = {

	position: null,
	sprite: null,

	isFlying: false,

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
		sprite.body.moves = true;

		sprite.body.allowGravity = true;  
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
	}

};

module.exports = Player;