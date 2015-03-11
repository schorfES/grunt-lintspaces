var
	LINTING_PASSED = '{a} lint free.',
	LINTING_FAILED = 'Formatting check failed.',
	Validator = require('lintspaces'),
	defaults = {
		showCodes: false,
		showTypes: false,
		showValid: false
	}
;

module.exports = function(grunt) {

	function hasMessages(report) {
		return Object.keys(report).length !== 0;
	}

	function reportMessages(report, options) {
		var hasWarnings = false;

		Object.keys(report).forEach(function(line) {
			report[line].forEach(function(item) {
				var message = '  L' + item.line + ': ';
				message += options.showTypes ? '(' + item.type + ') ' : '';
				message += item.message[item.type === 'warning' ? 'red' : 'yellow'];
				message += options.showCodes ? ' [' + item.code + ']' : '';
				grunt.log.writeln(message);

				hasWarnings = hasWarnings || item.type === 'warning';
			});
		});

		return hasWarnings;
	}

	grunt.registerMultiTask('lintspaces', 'Checking spaces', function() {
		var
			options = this.options(defaults),
			validator = new Validator(options),
			hasWarnings = false,
			warnings,
			report
		;

		// Validate all files:
		this.files.forEach(function(file) {
			file.src.forEach(function(path) {
				if (grunt.file.isFile(path)) {
					validator.validate(path);
					report = validator.getInvalidLines(path);

					// Is file valid? Messages in report?
					if (hasMessages(report)) {
						// ... log reports messages:
						grunt.log.writeln(String.fromCharCode(0x2613).red + ' ' + path.red);

						warnings = reportMessages(report, options);
						hasWarnings = hasWarnings || warnings;

					} else if (options.showValid) {
						// ... file is valid:
						grunt.log.writeln(String.fromCharCode(0x2714).green + ' ' + path);
					}
				}
			});
		});

		if (hasWarnings) {
			grunt.log.writeln();
			grunt.fail.warn(LINTING_FAILED);
		} else {
			grunt.log.ok(LINTING_PASSED.replace('{a}', validator.getProcessedFiles()));
		}
	});
};
