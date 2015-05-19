module.exports = function(grunt) {
	// project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'tests/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		jscs: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'tests/*.js'
			]
		},

		nodeunit: {
			all: [
				'tests/test_*.js'
			]
		},

		concat: {
			readme: {
				src: [
					'docs/intro.md',
					'docs/issues.md',
					'docs/installation.md',
					'docs/parameters.md',
					'node_modules/lintspaces/docs/options.md',
					'docs/task-options.md',
					'docs/examples.md',
					'docs/contribution.md',
					'docs/license.md'
				],
				dest: 'README.md'
			}
		},

		lintspaces: {
			self: {
				src: [
					'Gruntfile.js',
					'tasks/**/*.js',
					'tests/*.js',
					'docs/*.md'
				],
				options: {
					newline: true,
					trailingspaces: true,
					indentation: 'tabs',
					ignores: ['js-comments'],

					// Own options:
					showValid: true,
					showTypes: true,
					showCodes: true
				}
			},
			newline_okay: {
				src: ['tests/files/newline_okay.txt'],
				options: {
					newline: true,
					newlineBlocks: 2
				}
			},
			newline_missing: {
				src: ['tests/files/newline_missing.txt'],
				options: {
					newline: true
				}
			},
			newlines_toomuch: {
				src: ['tests/files/newline_toomuch.txt'],
				options: {
					newline: true,
					newlineMaximum: 2
				}
			},
			newlines_amount_invalid: {
				src: ['tests/files/newline_toomuch.txt'],
				options: {
					newlineMaximum: 0
				}
			},
			trailingspaces: {
				src: ['tests/files/trailingspaces.txt'],
				options: {
					trailingspaces: true
				}
			},
			indentation_tabs: {
				src: ['tests/files/indentation_tabs.txt'],
				options: {
					indentation: 'tabs'
				}
			},
			indentation_spaces: {
				src: ['tests/files/indentation_spaces.txt'],
				options: {
					indentation: 'spaces'
				}
			},
			indentation_spaces_3: {
				src: ['tests/files/indentation_spaces.txt'],
				options: {
					indentation: 'spaces',
					spaces: 3
				}
			},
			comments_pattern: {
				src: ['tests/files/comments/comments.js'],
				options: {
					indentation: 'tabs',
					ignores: [
						/'''[\s\S]*?'''/g, //Python
						/\/\*[\s\S]*?\*\//g //C, JavaScript, Java, AS3 etc.
					]
				}
			},
			comments_buildin_js: {
				src: ['tests/files/comments/comments.js'],
				options: {
					indentation: 'tabs',
					ignores: ['js-comments']
				}
			},
			comments_buildin_py: {
				src: ['tests/files/comments/comments.py'],
				options: {
					indentation: 'spaces',
					spaces: 4,
					ignores: ['python-comments']
				}
			},
			comments_buildin_xml: {
				src: ['tests/files/comments/comments.xml'],
				options: {
					indentation: 'tabs',
					ignores: ['xml-comments']
				}
			},
			comments_nomatches: {
				src: ['tests/files/comments/comments.nomatches'],
				options: {
					indentation: 'tabs',
					ignores: [
						'js-comments',
						'html-comments'
					]
				}
			},
			directory: {
				src: ['tests/files'],
				options: {
					indentation: 'tabs'
				}
			},
			editorconfig: {
				src: ['tests/files/comments/comments.js'],
				options: {
					ignores: ['js-comments'],
					editorconfig: 'tests/files/.editorconfig'
				}
			},
			editorconfig_notfound: {
				src: ['tests/files/comments/comments.js'],
				options: {
					ignores: ['js-comments'],
					editorconfig: 'path-doesnt-existis/.editorconfig'
				}
			},
			junit_inactive: {
				src: [
					'tests/files/indentation_tabs.txt',
					'tests/files/indentation_spaces.txt'
				],
				options: {
					indentation: 'tabs'
				}
			},
			junit_active: {
				src: [
					'tests/files/indentation_tabs.txt',
					'tests/files/indentation_spaces.txt'
				],
				options: {
					indentation: 'tabs',
					junit: 'tests/temp/junit.xml'
				}
			}
		}
	});

	// load tasks
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jscs');

	// define tasks
	grunt.registerTask('test', [
		'nodeunit:all'
	]);

	grunt.registerTask('validate', [
		'jshint:all',
		'jscs:all',
		'lintspaces:self'
	]);

	grunt.registerTask('build', [
		'concat:readme'
	]);

	grunt.registerTask('default', [
		'validate',
		'test',
		'build'
	]);
};
