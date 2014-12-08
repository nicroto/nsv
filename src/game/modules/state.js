'use strict';

function State() {
	var self = this;

	self.objects = [];
	self.cannons = [];
}

State.prototype = {

	Phaser: null,
	game: null,

	level: 1,
	objects: null,
	player: null,
	cannons: null,
	target: null

};

module.exports = State;