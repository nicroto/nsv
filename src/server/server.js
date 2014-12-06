'use strict';

var http = require('http'),
	pathUtils = require('path'),
	express = require("express"),
	bodyParser = require("body-parser"),
	app = express(),
	PORT = process.env.PORT || 5000;

app.use( bodyParser.json() );

app.use( express.static( pathUtils.resolve( __dirname, "client" ) ) );

http.createServer(app).listen(PORT, function() {
    console.log('Express server listening on port ' + PORT);
});