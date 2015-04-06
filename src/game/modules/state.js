'use strict';

var CONST = require("./const");

function State() {
	var self = this;

	self.livesLeft = CONST.PLAYER_INITIAL_LIVES_COUNT;

	self.objects = [];
	self.cannons = [];
}

State.prototype = {

	Phaser: null,
	game: null,

	map: null,
	level: 1,
	livesLeft: 0,

	collisionHandler: null,
	countdown: null,

	gameOver: false,
	restartLevel: false,
	levelUp: false,
	objects: null,
	walls: null,
	player: null,
	cannons: null,
	selectedCannon: 0,
	target: null

};

module.exports = State;