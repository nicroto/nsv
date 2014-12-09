'use strict';

function Countdown(Phaser, game, seconds) {
	var self = this,
		style = { font: "30px Arial", fill: "#ff0000", align: "center" };

	self.duration = seconds;

	var textVisual = game.add.text(
		game.width - 100,
		game.height - 70,
		seconds + "",
		style
	);
	self.textVisual = textVisual;
}

Countdown.prototype = {

	duration: 0,
	timeStarted: null,
	textVisual: null,

	preload: function(Phaser, game) {
		game.load.image( "target", "assets/princess.png" );
	},

	update: function(state) {
		var self = this,
			duration = self.duration,
			textVisual = self.textVisual,
			elapsedSeconds =
				Math.ceil( ( ( new Date() ) - self.timeStarted ) / 1000 );

		if ( elapsedSeconds >= duration ) {
			state.player.die( state );
		}

		textVisual.setText( duration - elapsedSeconds );
	},

	render: function() {},

	start: function() {
		var self = this;

		self.timeStarted = new Date();
	},

	reset: function() {
		var self = this;

		self.timeStarted = new Date();
	},

	recycle: function() {
		var self = this;

		self.textVisual.destroy();
	}

};

module.exports = Countdown;