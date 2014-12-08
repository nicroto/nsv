'use strict';

function CollisionHandler() {}

CollisionHandler.prototype = {

	preload: function() {},

	update: function(state) {
		var self = this;
		self.checkPlayerCannonCollisions( state );
		self.checkPlayerIsOutOfWorld( state );
	},

	render: function() {},

	checkPlayerCannonCollisions: function(state) {
		var self = this,
			game = state.game,
			player = state.player,
			cannons = state.cannons,
			selectedCannon = cannons[ state.selectedCannon ];

		if ( player.isFlying ) {
			if ( !player.leftCannonPremise ) {
				var overlaps = game.physics.arcade.overlap(
					player.sprite,
					selectedCannon.baseSprite
				);
				if ( !overlaps ) {
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
			var hasMoreLives = player.die( state );

			if ( !hasMoreLives ) {
				state.gameOver = true;
			} else {
				state.restartLevel = true;
			}
		}
	}

};

module.exports = CollisionHandler;