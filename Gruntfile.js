/*jshint boss: true, curly: true, eqeqeq: true, eqnull: true, expr: true,
	immed: true, noarg: true, onevar: true, quotmark: single, strict: true,
	trailing: true, undef: true, node: true */

module.exports = function (grunt) {

	'use strict';

	var rdefineEnd = /\}\s*?\);[^}\w]*$/,
		convert = function(name, path, contents) { // Blatently stolen from jQuery: https://github.com/jquery/jquery/blob/master/build/tasks/build.js
			// Convert var modules
			if ( /.\/var\//.test( path ) ) {
				contents = contents
					.replace( /define\([\w\W]*?return/, "var " + (/var\/([\w-]+)/.exec(name)[1]) + " =" )
					.replace( rdefineEnd, "" );

			} else {
				contents = contents
					.replace( /\s*return\s+[^\}]+(\}\s*?\);[^\w\}]*)$/, "$1" )
					// Multiple exports
					.replace( /\s*exports\.\w+\s*=\s*\w+;/g, "" );

				// Remove define wrappers, closure ends, and empty declarations
				contents = contents
					.replace( /define\([^{]*?{/, "" )
					.replace( rdefineEnd, "" );

				// Remove anything wrapped with
				// /* ExcludeStart */ /* ExcludeEnd */
				// or a single line directly after a // BuildExclude comment
				contents = contents
					.replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, "" )
					.replace( /\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, "" );

				// Remove empty definitions
				contents = contents
					.replace( /define\(\[[^\]]*\]\)[\W\n]+$/, "" );
			}

			return contents;
		};

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
		banner: '/*! <%= pkg.title || pkg.name %> - Copyright (c) <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %> */\n',
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
				name: 'vi18n',
				baseUrl: '<%= paths.js.source %>',
				mainConfigFile: '<%= paths.js.source %>/require-config.js',
				keepBuildDir: true,
				findNestedDependencies: true,
				skipModuleInsertion: true,
				logLevel: 3,
				wrap: {
					startFile: ['<%= paths.js.source %>/umd-header.txt'],
					endFile: ['<%= paths.js.source %>/umd-footer.txt']
				},
				onBuildWrite: convert
			},
			dev: {
				options: {
					optimize: 'none',
					out: '<%= paths.js.dist %>/<%= pkg.name %>.js'
				}
			},
			dist: {
				options: {
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					out: '<%= paths.js.dist %>/<%= pkg.name %>.min.js'
				}
			}
		},
		jasmine: {
			// To debug use: grunt jasmine -v -d 9
			// dev: {
			// 	src: '<%= paths.js.source %>/vi18n.js',
			// 	options: {
			// 		specs: '<%= paths.js.test %>/*-spec.js',
			// 		template: require('grunt-template-jasmine-requirejs'),
			// 		keepRunner: true,
			// 		templateOptions: {
			// 			requireConfigFile: '<%= paths.js.source %>/require-config.js',
			// 			requireConfig: {
			// 				baseUrl: '<%= paths.js.source %>'
			// 			}
			// 		}
			// 	}
			// },
			coverage: {
				src: '<%= paths.js.source %>/vi18n.js',
				options: {
					specs: '<%= paths.js.test %>/*-spec.js',
					template: require('grunt-template-jasmine-istanbul'),
					keepRunner: true,
					templateOptions: {
						coverage: 'coverage/coverage.json',
						report: [
							{
								type: 'html',
								options: {
									dir: 'coverage/html'
								}
							},
							{
								type: 'text-summary'
							}
						],
						template: require('grunt-template-jasmine-requirejs'),
						templateOptions: {
							requireConfigFile: '<%= paths.js.source %>/require-config.js',
							requireConfig: {
								baseUrl: '<%= paths.js.source %>'
							}
						}
					}
				}
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
		pattern: ['grunt-*', '!grunt-template-jasmine-*']
	});

	grunt.registerTask('test', ['jshint', 'jscs', 'jasmine']);

	grunt.registerTask('build', ['test', 'requirejs:dist']);

	grunt.registerTask('default', ['test', 'watch']);

};
