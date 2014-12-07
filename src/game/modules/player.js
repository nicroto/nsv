'use strict';

var CONST = require("./const");

function Player(Phaser, game, position) {
	var self = this;

	self.Phaser = Phaser;
	self.game = game;
	self.position = position;

	var sprite = game.add.sprite( position.x, position.y, "player" );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.angle = position.angle;
	sprite.anchor.setTo( 0.5 );
	sprite.body.drag.set( 100 );

	self.sprite = sprite;
}

Player.prototype = {

	Phaser: null,
	game: null,

	position: null,
	sprite: null,

	preload: function(Phaser, game) {
		game.load.image( "player", "assets/player.png" );
	},

	update: function() {},

	render: function() {},

};

module.exports = Player;