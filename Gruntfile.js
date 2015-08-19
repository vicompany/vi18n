/*jshint boss: true, curly: true, eqeqeq: true, eqnull: true, expr: true,
	immed: true, noarg: true, onevar: true, quotmark: single, strict: true,
	trailing: true, undef: true, node: true */

module.exports = function (grunt) {

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
			}
		},
		pkg: grunt.file.readJSON('package.json'),
		// banner: '/*! <%= pkg.title || pkg.name %> - Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %> */\n',
		jshint: {
			dev: {
				src: [
					'<%= paths.js.source %>/**/*.js'
				],
				options: {
					jshintrc: '.jshintrc'
				}
			}
		},
		jscs: {
			dev: {
				src: [
					'<%= jshint.dev.src %>'
				],
				options: {
					config: '.jscsrc',
					fix: true
				}
			}
		},
		requirejs: {
			options: {
				name: 'main',
				baseUrl: '<%= paths.js.source %>',
				mainConfigFile: '<%= paths.js.source %>/require-config.js',
				keepBuildDir: true,
				findNestedDependencies: true,
				logLevel: 3,
				paths: {
					// 'Intl': 'empty:' // TODO: exclude Intl polyfill in certain builds
				}
			},
			dev: {
				options: {
					optimize: 'none',
					out: '<%= paths.js.dist %>/main.js'
				}
			},
			dist: {
				options: {
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					out: '<%= paths.js.dist %>/main.min.js',
					uglify2: {
						report: 'min',
						compress: {
							global_defs: {
								DEBUG: false
							},
							dead_code: true,
							drop_console: true
						}
					}
				}
			}
		},
		jasmine: {
			// To debug use: grunt jasmine -v -d 9
			dev: {
				options: {
					specs: '<%= paths.js.test %>/*-spec.js',
					template: require('grunt-template-jasmine-requirejs'),
					keepRunner: true,
					templateOptions: {
						requireConfigFile: '<%= paths.js.source %>/require-config.js',
						requireConfig: {
							baseUrl: '<%= paths.js.source %>'
						}
					}
				}
			}
		},
		watch: {
			grunt: {
				files: [ 'Gruntfile.js'],
				options: {
					reload: true
				}
			},
			js: {
				files: ['<%= paths.js.source %>/**/*.js', '<%= paths.js.test %>/*-spec.js'],
				tasks: ['test', 'requirejs:dev'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		}
	});

	// Load all NPM installed grunt tasks from the package.json
	// Except the 'grunt-template-jasmine-requirejs' task
	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*', '!grunt-template-jasmine-requirejs']
	});

	grunt.registerTask('test', ['jshint', 'jscs', 'jasmine']);

	grunt.registerTask('build', ['test', 'requirejs:dist']);

	grunt.registerTask('default', ['test', 'watch']);

};
