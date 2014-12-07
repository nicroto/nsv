'use strict';

var pathUtils = require('path'),
	fs = require('fs'),
	PROJECT_DIR_PATH = pathUtils.resolve( __dirname ),
	UNLIMITED_SIZE = 1000000;

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dev: [
				'src/server/client/assets',
				'src/server/client/css',

				'src/server/client/js/game.js'
			],
			build: ['build/']
		},
		jshint: {
			all: ['src/**/*.js', 'test/**/*.js', 'Gruntfile.js', '!src/server/client/**/*.js'],
			checkstyle: 'checkstyle.xml',
			options: {
				jshintrc: '.jshintrc'
			}
		},
		simplemocha: {
			all: { src: 'test/**/*-test.js' }
		},

		browserify: {
			game_debug: {
				src: ['src/game/bootstrap.js'],
				dest: 'src/server/client/js/game.js',
				options: {
					transform: [],
					debug: true
				}
			},
			game: {
				src: ['src/game/bootstrap.js'],
				dest: 'src/server/client/js/game.js',
				options: {
					transform: ['uglifyify'],
					debug: false
				}
			}
		},
		stylus: {
			compile: {
				options: {
					paths: ['src/client/styles'],
					urlfunc: 'embedurl'
				},
				files: {
					'src/server/client/css/main.css': 'src/client/styles/main.styl', // 1:1 compile
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: "src/game/assets/",
						src: "**",
						dest: "src/server/client/assets/"
					},
					{
						expand: true,
						cwd: "src/client/styles/img/",
						src: "**",
						dest: "src/server/client/css/img/"
					}
				]
			}
		},
		watch: {
			client: {
				files: ['src/game/**/*', 'src/client/**/*'],
				tasks: ['devRebuild']
			},
			server: {
				files:  [ 'src/server/**/*', '!src/server/client/**/*' ],
				tasks:  [ 'express:server' ],
				options: {
					spawn: false
				}
			}
		},
		express: {
			options: {},
			server: {
				options: {
					script: 'src/server/server.js',
					port: 5000
				}
			}
		},
		shell: {
			update_website: {
				command: function(version) {
					return "./bin/update-website.sh";
				},
				options: {
					execOptions: {
						cwd: PROJECT_DIR_PATH,
						maxBuffer: UNLIMITED_SIZE
					}
				}
			}
		}

	});

	// task loading
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-shell');

	// custom tasks
	grunt.task.registerTask( "tilemapEdit", "copy the rotation prop of objects", function() {
		var path = pathUtils.resolve( __dirname, "src", "game", "assets", "levels", "tilemap.json" );
		if ( fs.existsSync( path ) ) {
			var jsonText = fs.readFileSync( path, "utf-8" );
			if ( jsonText ) {
				console.log( "tilemap.json file successfully read." );
				try {
					var json = JSON.parse( jsonText ),
						layers = json.layers;

					console.log( "tilemap.json file successfully parsed." );
					if ( layers && layers.length ) {
						layers.forEach( function(layer) {
							if ( layer.type === "objectgroup" ) {
								var objects = layer.objects;
								if ( objects && objects.length ) {
									objects.forEach( function(object) {
										if ( object.rotation !== undefined ) {
											if ( !object.properties ) {
												object.properties = {};
											}
											object.properties.rotation = object.rotation;
										}
									} );
								}
							}
						} );
						var newJsonText = JSON.stringify( json );
						fs.writeFileSync( path, newJsonText );
						console.log( "tilemap.json file successfully updated with rotation props." );
					}
				} catch(exception) {
					console.error( "Error: tilemap.json isn't a valid JSON" );
				}
			}
		} else {
			console.error( "Error: tilemap.json file doesn't exist" );
		}
	} );

	// run lint and tests
	grunt.registerTask('default', ['c', 'jshint:all', 'simplemocha']);

	// start develop
	grunt.registerTask('devRebuild', ['clean:dev', 'tilemapEdit', 'browserify:game_debug', 'stylus', 'copy']);
	grunt.registerTask('dev', ['devRebuild', 'express', 'watch']);

	// build for website (output is minified)
	grunt.registerTask('webRebuild', ['clean:dev', 'tilemapEdit', 'browserify:game', 'stylus', 'copy']);
	grunt.registerTask('web', ['clean:build', 'webRebuild', 'shell:update_website', 'clean:build', 'devRebuild']);

	// shorthands
	grunt.registerTask('d', ['dev']);
	grunt.registerTask('h', ['jshint:all']);
	grunt.registerTask('c', ['clean:dev', 'clean:build']);
};