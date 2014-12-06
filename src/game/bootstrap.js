'use strict';

var $ = require("jquery"),
	State = require("./modules/state"),
	state = new State(),

	preload = require("./modules/phases/preload")( state ),
	create = require("./modules/phases/create")( state ),
	update = require("./modules/phases/update")( state ),
	render = require("./modules/phases/render")( state );

$( function() {

state.Phaser = Phaser;

state.game = new Phaser.Game(
	800,
	600,
	Phaser.CANVAS,
	'gameContainer',
	{
		preload: preload,
		create: create,
		update: update,
		render: render
	}
);

} );