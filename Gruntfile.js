module.exports = function(grunt) {
	// project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'tests/**/*.js'
			],
			options: {
				'boss': true,
				'curly': true,
				'eqeqeq': true,
				'eqnull': true,
				'expr': true,
				'globals': {
					'module': true,
					'require': true,
					'exports': true,
					'__dirname': true,
					'window': true
				},
				'immed': true,
				'noarg': true,
				'onevar': true,
				'quotmark': 'single',
				'smarttabs': true,
				'trailing': true,
				'undef': true,
				'unused': true
			}
		},

		nodeunit: {
			all: ['tests/test_*.js']
		},

		lintspaces: {
			self: {
				src: [
					'Gruntfile.js',
					'tasks/**/*.js'
				],
				options: {
					newline: true,
					trailingspaces: true,
					indentation: 'tabs'
				}
			},
			newline_okay: {
				src: ['tests/files/newline_okay.txt'],
				options: {
					newline: true
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
					newline: true
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
			}
		}
	});

	// load tasks
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// define tasks
	grunt.registerTask('test', [
		'nodeunit'
	]);

	grunt.registerTask('validate', [
		'jshint',
		'lintspaces:self'
	]);

	grunt.registerTask('default', [
		'validate',
		'test'
	]);
};
