var
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	js: function(test) {
		test.expect(1);
		exec('grunt lintspaces:newline_okay', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('L2') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L3') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L10') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L16') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L18') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L19') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L20') > -1,
				false,
				'this is a comment'
			);

			test.equal(
				stdout.indexOf('L22') > -1,
				true,
				'this is an invalid comment'
			);

			test.equal(
				stdout.indexOf('L26') > -1,
				true,
				'this is an invalid comment'
			);

			test.equal(
				stdout.indexOf('L28') > -1,
				true,
				'this is an invalid comment'
			);

			test.done();
		});
	}
};
