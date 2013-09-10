module.exports = function(grunt) {
	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js'
			],
			options: {
				'boss': true,
				'curly': true,
				'eqeqeq': true,
				'eqnull': true,
				'expr': true,
				'globals': {
					'module': true
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
			all: ['test/*_test.js']
		},

		lintspaces: {
			testNewlines: {
				src: [
					'tests/files/newline_okay.txt',
					'tests/files/newline_missing.txt',
					'tests/files/newline_toomuch.txt'
				],
				options: {
					newline: true
				}
			},
			testTrailingspaces: {
				src: ['tests/files/trailingspaces.txt'],
				options: {
					trailingspaces: true
				}
			},
			testIndentionTabs: {
				src: ['tests/files/indentation_tabs.txt'],
				options: {
					indentation: 'tabs'
				}
			},
			testIndentionSpaces: {
				src: ['tests/files/indentation_spaces.txt'],
				options: {
					indentation: 'spaces',
					spaces: 2
				}
			},
			all: {
				src: ['tests/files/*.txt'],
				options: {
					indentation: 'tabs',
					trailingspaces: true,
					newline: true
				}
			}
		}
	});

	//load tasks
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	//define tasks
	grunt.registerTask('test', [
		'lintspaces:testIndentionTabs',
		'lintspaces:testNewlines',
		'lintspaces:testTrailingspaces'
	]);

	grunt.registerTask('validate', [
		'jshint'
	]);

	grunt.registerTask('default', [
		'validate',
		'test'
	]);
};
