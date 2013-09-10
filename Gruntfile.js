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

		lintspaces: {
			testTrailingspaces: {
				src: [
					'tests/files/trailingspaces.txt'
				],
				options: {
					newline: true,
					indentation: 'tabs',
					trailingspaces: true
				}
			}
		}
	});

	//load tasks
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	//define tasks
	grunt.registerTask('test', [
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
