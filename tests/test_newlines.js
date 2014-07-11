var
	MESSAGES = require('lintspaces').MESSAGES,
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	newlines_okay: function(test) {
		test.expect(1);
		exec('grunt lintspaces:newline_okay', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('lint free.') > -1,
				true,
				'newlines are fine.'
			);
			test.done();
		});
	},

	newlines_missing: function(test) {
		test.expect(1);
		exec('grunt lintspaces:newline_missing', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('L10') > -1,
				true,
				'newline is missing at the end of file.'
			);
			test.done();
		});
	},

	newlines_toomuch: function(test) {
		test.expect(4);
		exec('grunt lintspaces:newlines_toomuch', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('L1') > -1,
				true,
				'too many newlines in newline blocks at beginning of file'
			);

			test.equal(
				stdout.indexOf('L8') > -1,
				true,
				'too many newlines in newline blocks in file'
			);

			test.equal(
				stdout.indexOf('L17') > -1,
				true,
				'too many newlines in newline blocks in file'
			);

			test.equal(
				stdout.indexOf('L32') > -1,
				true,
				'toomany lines at the end of file.'
			);
			test.done();
		});
	},

	newlines_amount_invalid: function(test) {
		test.expect(1);
		exec('grunt lintspaces:newlines_amount_invalid', execOptions, function(error, stdout) {
			var message = MESSAGES.NEWLINE_MAXIMUM_INVALIDVALUE.message.replace('{a}', '0');
			test.equal(stdout.indexOf(message) > -1, true,
				'A failure log message should appear when maximum newlines amount is less then 1.'
			);
			test.done();
		});
	}
};
