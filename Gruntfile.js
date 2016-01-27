module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		paths: {
			root: '.',
			img: '<%= paths.root %>/img',
			css: '<%= paths.root %>/css',
			scss: '<%= paths.root %>/scss',
			js: {
				vendor: '<%= paths.root %>/bower_components',
				source: '<%= paths.root %>/src',
				test: '<%= paths.root %>/test',
				dist: '<%= paths.root %>/dist'
			},
			coverage: '<%= paths.root %>/coverage'
		},
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				commitFiles: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				push: false,
				commit: false,
				createTag: false
			}
		},
		eslint: {
			options: {
				configFile: '.eslintrc'
			},
			target: [
				'<%= paths.js.source %>/**/*.js'
				// '<%= paths.js.test %>/**/*.js' // TODO: lint test files
			]
		},
		babel: {
			options: {
				modules: 'umd',
				auxiliaryCommentBefore: 'istanbul ignore next'
			},
			dev: {
				files: {
					'<%= paths.js.dist %>/vi18n.js': '<%= paths.js.source %>/vi18n.js'
				}
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				sourceMap: true
			},
			dist: {
				files: {
					'<%= paths.js.dist %>/vi18n.min.js': '<%= paths.js.dist %>/vi18n.js'
				}
			}
		},
		jasmine: {
			// To debug use: grunt jasmine -v -d 9
			dev: {
				src: '<%= paths.js.dist %>/vi18n.js',
				options: {
					specs: '<%= paths.js.test %>/*-spec.js',
					keepRunner: true,
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: '<%= paths.coverage %>/coverage.json',
						report: [
							{
								type: 'html',
								options: {
									dir: '<%= paths.coverage %>/html'
								}
							},
							{
								type: 'lcov',
								options: {
									dir: '<%= paths.coverage %>'
								}
							},
							{
								type: 'text-summary'
							}
						],
						template: require('grunt-template-jasmine-requirejs'),
						templateOptions: {
							requireConfig: {
								baseUrl: '.grunt/grunt-contrib-jasmine/dist',
								paths: {
									'text': '../../../node_modules/requirejs-text/text',
									'intl':	'../../../node_modules/intl/dist/Intl.min',
									'locale-data': '../../../node_modules/intl/locale-data/json'
								},
								shim: {
									intl: {
										exports: 'Intl' // AMD support has been removed, see: https://github.com/andyearnshaw/Intl.js/issues/132
									}
								}
							}
						}
					}
				}
			}
		},
		coveralls: {
			options: {
				// When true, grunt-coveralls will only print a warning rather than
				// an error, to prevent CI builds from failing unnecessarily (e.g. if
				// coveralls.io is down). Optional, defaults to false.
				force: false
			},
			dev: {
				src: '<%= paths.coverage %>/*.info'
			}
		},
		watch: {
			grunt: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				}
			},
			js: {
				files: ['<%= paths.js.source %>/**/*.js', '<%= paths.js.test %>/*-spec.js'],
				tasks: ['test'],
				options: {
					spawn: false
				}
			}
		}
	});

	// Load all NPM installed grunt tasks from the package.json
	// Except the 'grunt-template-jasmine-requirejs' task
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', '!grunt-template-jasmine-*']
	});

	// Task used by Travis
	grunt.registerTask('test', ['eslint', 'babel', 'jasmine']);

	grunt.registerTask('build', ['test', 'uglify']);

	grunt.registerTask('default', ['test', 'watch']);

};
