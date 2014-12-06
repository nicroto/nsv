'use strict';

var CONST = require("./const");

function Cannon(Phaser, game, position) {
	var self = this;

	self.Phaser = Phaser;
	self.game = game;
	self.position = position;

	// base
	var baseSprite = game.add.sprite( position.x, position.y, "cannon-base" );
	game.physics.enable( baseSprite, Phaser.Physics.ARCADE );
	baseSprite.anchor.setTo( 0.5 );
	baseSprite.body.setSize( 10, 10, 0, 0 );
	baseSprite.body.drag.set( 100 );
	// reverses both images (base and gun)
	baseSprite.scale.x *= -1; // temp code - remove with real images

	// gun
	var gunSprite = game.add.sprite( 0, 0, "cannon-gun" );
	game.physics.enable( gunSprite, Phaser.Physics.ARCADE );
	gunSprite.anchor.setTo( 0.05, 0.5 );

	baseSprite.addChild( gunSprite );

	self.baseSprite = baseSprite;
	self.gunSprite = gunSprite;
}

Cannon.prototype = {

	Phaser: null,
	game: null,

	position: null,
	baseSprite: null,
	gunSprite: null,

	preload: function(Phaser, game) {
		game.load.image( "cannon-base", "assets/cannon-base.gif" );
		game.load.image( "cannon-gun", "assets/cannon-gun.gif" );
	},

	update: function() {},

	render: function() {},

};

module.exports = Cannon;