var
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	trailingspaces: function(test) {
		test.expect(8);

		exec('grunt lintspaces:trailingspaces', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('L3') > -1,
				true,
				'trailingspace with single tab'
			);

			test.equal(
				stdout.indexOf('L4') > -1,
				true,
				'trailingspace with multiple tabs'
			);

			test.equal(
				stdout.indexOf('L5') > -1,
				true,
				'trailingspace with single space'
			);

			test.equal(
				stdout.indexOf('L6') > -1,
				true,
				'trailingspace with multiple spaces'
			);

			test.equal(
				stdout.indexOf('L7') > -1,
				true,
				'trailingspace with mixed spaces and tabs'
			);

			test.equal(
				stdout.indexOf('L8') > -1,
				true,
				'trailingspace with mixed tabs and spaces'
			);

			test.equal(
				stdout.indexOf('L9') > -1,
				true,
				'trailingspace in newline line with tab'
			);

			test.equal(
				stdout.indexOf('L10') > -1,
				true,
				'trailingspace in newline line with spaces'
			);

			test.done();
		});
	}
};
