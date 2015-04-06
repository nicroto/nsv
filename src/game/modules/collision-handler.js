'use strict';

function CollisionHandler() {}

CollisionHandler.prototype = {

	preload: function() {},

	update: function(state) {
		var self = this;
		self.checkPlayerTargetCollision( state );
		// self.checkPlayerWallCollision( state );
		self.checkPlayerCannonCollisions( state );
		self.checkPlayerIsOutOfWorld( state );
	},

	render: function() {},

	checkPlayerTargetCollision: function(state) {
		var game = state.game,
			player = state.player,
			target = state.target;

		if ( player && player.isFlying ) {
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

	checkPlayerWallCollision: function(state) {
		var game = state.game,
			player = state.player,
			walls = state.walls;

		if ( player && player.isFlying ) {
			for ( var i = 0; i < walls.length; i++ ) {
				var collision = game.physics.arcade.overlap(
					player.sprite,
					walls[i]
				);
				if ( collision ) {
					// TODO
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

		if ( player && player.isFlying ) {
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
			player = state.player;

		if ( player ) {
			var sprite = player.sprite;

			if (
				sprite.body.x < 0 ||
				sprite.body.x > game.width ||
				sprite.body.y < 0 ||
				sprite.body.y > game.height
			) {
				player.die( state );
			}
		}
	}

};

module.exports = CollisionHandler;