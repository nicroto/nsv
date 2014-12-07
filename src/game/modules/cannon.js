'use strict';

function Cannon(Phaser, game, position, index) {
	var self = this;

	self.position = position;
	self.index = index;

	// base
	var baseSprite = game.add.sprite( position.x, position.y, "cannon-base" );
	game.physics.enable( baseSprite, Phaser.Physics.ARCADE );
	baseSprite.angle = position.angle;
	baseSprite.anchor.setTo( 0.5 );
	baseSprite.body.immovable = true;

	// gun
	var gunSprite = game.add.sprite( position.x, position.y, "cannon-gun" );
	game.physics.enable( gunSprite, Phaser.Physics.ARCADE );
	gunSprite.angle = position.angle - 90;
	gunSprite.anchor.setTo( 0.05, 0.5 );

	// baseSprite.addChild( gunSprite );

	self.baseSprite = baseSprite;
	self.gunSprite = gunSprite;
}

Cannon.prototype = {

	position: null,
	index: -1,

	baseSprite: null,
	gunSprite: null,

	preload: function(Phaser, game) {
		game.load.image( "cannon-base", "assets/cannon-base.gif" );
		game.load.image( "cannon-gun", "assets/cannon-gun.gif" );
	},

	update: function(state) {
		var self = this,
			game = state.game,
			gunSprite = self.gunSprite;

		if ( state.selectedCannon === self.index ) {
			gunSprite.rotation = game.physics.arcade.angleToPointer( gunSprite );
		}
	},

	render: function() {},

};

module.exports = Cannon;