var
	LINTING_PASSED = '{a} lint free.',
	LINTING_FAILED = 'Formatting check failed.',
	Validator = require('lintspaces')
;

module.exports = function(grunt) {
	grunt.registerMultiTask('lintspaces', 'Checking spaces', function() {
		var
			validator = new Validator(this.options()),
			invalidFiles,
			files = 0,
			file, line, error
		;

		// Validate all files:
		this.files.forEach(function(file) {
			file.src.forEach(function(path) {
				if (grunt.file.isFile(path)) {
					validator.validate(path);
					files++;
				}
			});
		});

		// Log invalid files:
		invalidFiles = validator.getInvalidFiles();
		for (file in invalidFiles) {
			grunt.log.writeln('Error: '.red + file);

			for (line in invalidFiles[file]) {
				for (error in line) {
					grunt.log.writeln('L' + line + ': ' + error.yellow);
				}
			}
		}

		// Log final validation message:
		if (Object.keys(invalidFiles).length) {
			grunt.log.writeln();
			grunt.fail.warn(LINTING_FAILED);
		} else {
			grunt.log.ok(LINTING_PASSED.replace('{a}', files));
		}
	});
};
