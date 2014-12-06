'use strict';

var CONST = require("./const");

function Player(Phaser, game) {
	var self = this;

	self.Phaser = Phaser;
	self.game = game;

	var sprite = game.add.sprite( 300, 300, "player" );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.anchor.setTo( 0.5 );
	sprite.body.drag.set( 100 );

	self.sprite = sprite;
}

Player.prototype = {

	Phaser: null,
	game: null,

	sprite: null,

	preload: function(Phaser, game) {
		game.load.image( "player", "assets/player.png" );
	},

	update: function() {},

	render: function() {},

};

module.exports = Player;