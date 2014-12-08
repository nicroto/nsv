'use strict';

function State() {
	var self = this;

	self.objects = [];
	self.cannons = [];
}

State.prototype = {

	Phaser: null,
	game: null,

	map: null,

	collisionHandler: null,

	gameOver: false,
	restartLevel: false,
	level: 1,
	objects: null,
	player: null,
	cannons: null,
	selectedCannon: 0,
	target: null

};

module.exports = State;