'use strict';

function CollisionHandler() {}

CollisionHandler.prototype = {

	preload: function() {},

	update: function(state) {
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

	render: function() {},

	playerCannonCollision: function() {
		var context = this,
			state = context.state,
			player = state.player,
			newCannon = context.cannon,
			selectedCannon = state.cannons[ state.selectedCannon ];

		selectedCannon.detachFromPlayer();
		newCannon.loadPlayer( player );
		state.selectedCannon = newCannon.index;
	}

};

module.exports = CollisionHandler;