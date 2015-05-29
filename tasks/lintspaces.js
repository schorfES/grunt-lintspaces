var
	Validator = require('lintspaces'),
	JUnitWriter = require('junitwriter'),

	LINTING_PASSED = '{a} lint free.',
	LINTING_FAILED = 'Formatting check failed.',

	DEFAULTS = {
		showCodes: false,
		showTypes: false,
		showValid: false,
		junit: false
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

	function reportJunit(report, path, junitwriter) {
		if (junitwriter) {
			var
				suite = junitwriter.addTestsuite(path),
				testcase = suite.addTestcase(path, 'grunt.lintspaces')
			;

			Object.keys(report).forEach(function(line) {
				report[line].forEach(function(item) {
					testcase.addFailure(item.message + ' at line ' + line, item.type);
				});
			});
		}
	}

	function complete(hasWarnings, validator) {
		if (hasWarnings) {
			grunt.log.writeln();
			grunt.fail.warn(LINTING_FAILED);
		} else {
			grunt.log.ok(LINTING_PASSED.replace('{a}', validator.getProcessedFiles()));
		}
	}

	grunt.registerMultiTask('lintspaces', 'Checking spaces', function() {
		var
			done = this.async(),
			options = this.options(DEFAULTS),
			validator = new Validator(options),
			hasWarnings = false,
			junitwriter,
			warnings,
			report
		;

		// Create JunitWirter instance
		if (typeof options.junit === 'string') {
			junitwriter = new JUnitWriter();
		}

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

					reportJunit(report, path, junitwriter);
				}
			});
		});

		if (junitwriter) {
			// Save Junit output into file:
			junitwriter.save(options.junit, function() {
				complete(hasWarnings, validator);
				done();
			});
		} else {
			complete(hasWarnings, validator);
			done();
		}

	});
};
