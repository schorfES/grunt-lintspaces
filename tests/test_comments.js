var
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	js: function(test) {
		var
			linesToIgnore = [
				2, 3,
				11, 12, 13, 14, 15, 16,
				29, 30, 33, 34, 35, 36, 37, 38, 39,
				42, 43, 44
			],
			linesToFind = [
				32,
				46,
				48
			]
		;

		test.expect(linesToIgnore.length + linesToFind.length);
		exec('grunt lintspaces:comments', execOptions, function(error, stdout) {
			linesToIgnore.forEach(function(line) {
				test.equal(
					stdout.indexOf('L'+ line +':') > -1,
					false,
					'this is a comment and should be ignored'
				);
			});

			linesToFind.forEach(function(line) {
				test.equal(
					stdout.indexOf('L'+ line +':') > -1,
					true,
					'this is not a comment'
				);
			});

			test.done();
		});
	}
};
