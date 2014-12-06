'use strict';

function State() {
	var self = this;

	self.objects = [];
}

State.prototype = {

	Phaser: null,
	game: null,

	objects: null

};

module.exports = State;