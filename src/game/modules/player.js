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
	input: {
		clickStarted: false
	},

	preload: function(Phaser, game) {
		game.load.image( "player", "assets/player.png" );
	},

	update: function(state) {
		var self = this,
			game = state.game,
			leftClickDown = game.input.activePointer.isDown;

		if ( self.isFlying ) {
			return;
		}

		if ( leftClickDown ) {
			if ( !self.input.clickStarted ) {
				self.startFlying( state );
			}
		}
		self.input.clickStarted = leftClickDown;
	},

	render: function() {},

	startFlying: function() {
		var self = this,
			sprite = self.sprite;

		self.isFlying = true;

		sprite.body.moves = true;
	}

};

module.exports = Player;