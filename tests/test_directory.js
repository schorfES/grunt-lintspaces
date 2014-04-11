var
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	dir: function(test) {
		test.expect(1);
		exec('grunt lintspaces:directory', execOptions, function(error, stdout) {
			test.equal(
				stdout.indexOf('lint free.') > -1,
				true,
				'This is a directory.'
			);
			test.done();
		});
	}
};
