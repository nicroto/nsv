'use strict';

function Walls(Phaser, game) {
	var self = this;

	self.sprites = [];
}

Walls.prototype = {

	Phaser: null,
	game: null,

	sprites: null,

	add: function(rect) {
		var self = this,
			game = self.game,
			sprite = game.add.sprite( rect.x, rect.y, null );

		sprite.body.setSize( rect.width, rect.height, 0, 0 );

		self.sprites.push( sprite );
	}

};