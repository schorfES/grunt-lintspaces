var
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
			test.equal(stdout.indexOf('All spaces are correct.') > -1, true, 'newlines are fine.');
			test.done();
		});
	},

	newlines_missing: function(test) {
		test.expect(1);
		exec('grunt lintspaces:newline_missing', execOptions, function(error, stdout) {
			test.equal(stdout.indexOf('no newline at end of file.') > -1, true, 'newline is missing at the end of file.');
			test.done();
		});
	},

	newlines_toomuch: function(test) {
		test.expect(1);
		exec('grunt lintspaces:newlines_toomuch', execOptions, function(error, stdout) {
			test.equal(stdout.indexOf('too many new lines at end of file.') > -1, true, 'toomany files at the end of file.');
			test.done();
		});
	}
};
