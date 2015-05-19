var
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

exports.tests = {
	active: function(test) {
		test.expect(0);
		exec('grunt lintspaces:junit_active', execOptions, function(error, stdout) {
			test.done();
		});
	}

	// ,
	// inactive: function(test) {
	// 	test.expect(1);
	// 	exec('grunt lintspaces:junit_inactive', execOptions, function(error, stdout) {
	// 		test.done();
	// 	});
	// },
};
