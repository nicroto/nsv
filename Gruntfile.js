'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			all: [
				'src/server/client/assets',
				'src/server/client/css',

				'src/server/client/js/game.js'
			]
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


	// run lint and tests
	grunt.registerTask('default', ['clean', 'jshint:all', 'simplemocha']);

	// start develop
	grunt.registerTask('devRebuild', ['clean', 'browserify:game_debug', 'stylus', 'copy']);
	grunt.registerTask('dev', ['devRebuild', 'express', 'watch']);

	// build for test & commit (output is minified)
	grunt.registerTask('build', ['clean', 'browserify:game', 'stylus', 'copy']);

	// shorthands
	grunt.registerTask('d', ['dev']);
	grunt.registerTask('h', ['jshint:all']);
	grunt.registerTask('c', ['clean']);
};