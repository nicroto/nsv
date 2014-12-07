'use strict';

var utils = {

	getMidPoint: function(x, y, width, height, angleInDegrees) {
		var angleInRadians = angleInDegrees * Math.PI / 180,
			cosa = Math.cos( angleInRadians ),
			sina = Math.sin( angleInRadians ),
			wp = width / 2,
			hp = height / 2;

		return {
			x: ( x + wp * cosa - hp * sina ),
			y: ( y + wp * sina + hp * cosa )
		};
	}

};

module.exports = utils;