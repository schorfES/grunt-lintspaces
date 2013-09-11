var
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	indentation_tabs: function(test) {
		test.expect(4);

		exec('grunt lintspaces:indentation_tabs', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('L6') > -1,
				false,
				'line is okay'
			);

			test.equal(
				stdout.indexOf('L3') > -1,
				true,
				'indentation with spaces'
			);

			test.equal(
				stdout.indexOf('L8') > -1,
				true,
				'indentation mixed with spaces and tabs'
			);

			test.equal(
				stdout.indexOf('L9') > -1,
				true,
				'indentation mixed with tabs and spaces'
			);

			test.done();
		});
	},

	indentation_spaces_4: function(test) {
		test.expect(5);
		exec('grunt lintspaces:indentation_spaces', execOptions, function(error, stdout) {

			test.equal(
				stdout.indexOf('L6') > -1,
				false,
				'line is okay'
			);

			test.equal(
				stdout.indexOf('L2') > -1,
				true,
				'indentation with tabs'
			);

			test.equal(
				stdout.indexOf('L8') > -1,
				true,
				'indentation mixed with spaces and tabs'
			);

			test.equal(
				stdout.indexOf('L9') > -1,
				true,
				'indentation mixed with tabs and spaces'
			);

			test.equal(
				stdout.indexOf('L10') > -1,
				true,
				'incorrect amount of spaces in indentation'
			);

			test.done();
		});
	},

	indentation_spaces_3: function(test) {
		test.expect(5);
		exec('grunt lintspaces:indentation_spaces_3', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('L6') > -1,
				false,
				'line is okay'
			);

			test.equal(
				stdout.indexOf('L2') > -1,
				true,
				'indentation with tabs'
			);

			test.equal(
				stdout.indexOf('L8') > -1,
				true,
				'indentation mixed with spaces and tabs'
			);

			test.equal(
				stdout.indexOf('L9') > -1,
				true,
				'indentation mixed with tabs and spaces'
			);

			test.equal(
				stdout.indexOf('L10') > -1,
				false,
				'correct amount of spaces in indentation'
			);

			test.done();
		});
	}
};
