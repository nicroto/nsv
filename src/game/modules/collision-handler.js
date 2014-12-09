'use strict';

function CollisionHandler() {}

CollisionHandler.prototype = {

	preload: function() {},

	update: function(state) {
		var self = this;
		self.checkPlayerTargetCollision( state );
		self.checkPlayerCannonCollisions( state );
		self.checkPlayerIsOutOfWorld( state );
	},

	render: function() {},

	checkPlayerTargetCollision: function(state) {
		var game = state.game,
			player = state.player,
			target = state.target;

		if ( player.isFlying ) {
			if ( player.leftCannonPremise ) {
				var collision = game.physics.arcade.overlap(
					player.sprite,
					target.sprite
				);
				if ( collision ) {
					state.levelUp = true;
				}
			}
		}
	},

	checkPlayerCannonCollisions: function(state) {
		var self = this,
			game = state.game,
			player = state.player,
			cannons = state.cannons,
			selectedCannon = cannons[ state.selectedCannon ];

		if ( player.isFlying ) {
			if ( !player.leftCannonPremise ) {
				var collision = game.physics.arcade.overlap(
					player.sprite,
					selectedCannon.baseSprite
				);
				if ( !collision ) {
					player.leftCannonPremise = true;
				} else {
					return;
				}
			}

			for ( var i = 0; i < cannons.length; i++ ) {
				var cannon = cannons[i];

				game.physics.arcade.overlap(
					player.sprite,
					cannon.baseSprite,
					self.playerCannonCollision,
					null,
					{
						state: state,
						cannon: cannon
					}
				);
			}
		}
	},

	playerCannonCollision: function() {
		var context = this,
			state = context.state,
			player = state.player,
			newCannon = context.cannon,
			selectedCannon = state.cannons[ state.selectedCannon ];

		selectedCannon.detachFromPlayer();
		newCannon.loadPlayer( player );
		state.selectedCannon = newCannon.index;
	},

	checkPlayerIsOutOfWorld: function(state) {
		var game = state.game,
			player = state.player,
			sprite = player.sprite;

		if (
			sprite.x < 0 ||
			sprite.x > game.width ||
			sprite.y < 0 ||
			sprite.y > game.height
		) {
			player.die( state );
		}
	}

};

module.exports = CollisionHandler;