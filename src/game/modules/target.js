'use strict';

function Target(Phaser, game, position) {
	var self = this;

	self.Phaser = Phaser;
	self.game = game;
	self.position = position;

	var sprite = game.add.sprite( position.x, position.y, "target" );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.anchor.setTo( 0.5 );
	sprite.body.drag.set( 100 );
	sprite.body.allowGravity = false;

	self.sprite = sprite;
}

Target.prototype = {

	Phaser: null,
	game: null,

	position: null,
	sprite: null,

	preload: function(Phaser, game) {
		game.load.image( "target", "assets/princess.png" );
	},

	update: function() {},

	render: function() {},

};

module.exports = Target;