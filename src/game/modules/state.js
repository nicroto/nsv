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
	map: null,

	collisionHandler: null,

	gameOver: false,
	restartLevel: false,
	levelUp: false,
	objects: null,
	player: null,
	cannons: null,
	selectedCannon: 0,
	target: null

};

module.exports = State;