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
				'boss': true,
				'curly': true,
				'eqeqeq': true,
				'eqnull': true,
				'expr': true,
				'globals': {
					'module': true,
					'require': true,
					'exports': true,
					'__dirname': true
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
			newline_okay: {
				src: ['tests/files/newline_okay.txt'],
				options: { newline: true }
			},
			newline_missing: {
				src: ['tests/files/newline_missing.txt'],
				options: { newline: true }
			},
			newlines_toomuch: {
				src: ['tests/files/newline_toomuch.txt'],
				options: { newline: true }
			},
			trailingspaces: {
				src: ['tests/files/trailingspaces.txt'],
				options: { trailingspaces: true }
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
		'jshint'
	]);

	grunt.registerTask('default', [
		'validate',
		'test'
	]);
};
