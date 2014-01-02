var
	MESSAGES = require('./../tasks/constants/messages'),
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	}
;

function run(test, cmd, ignores, finds) {
	test.expect(ignores.length + finds.length);
	exec(cmd, execOptions, function(error, stdout) {
		ignores.forEach(function(line) {
			test.equal(stdout.indexOf('L'+ line +':') > -1, false,
				'this is a comment and should be ignored (L'+ line +')'
			);
		});

		finds.forEach(function(line) {
			test.equal(stdout.indexOf('L'+ line +':') > -1, true,
				'this is not a comment (L'+ line +')'
			);
		});

		test.done();
	});
}

exports.tests = {
	valid: function(test) {
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
				54
			]
		;

		run(test, 'grunt lintspaces:editorconfig', linesToIgnore, linesToFind);
	},

	notfound: function(test) {
		test.expect(1);
		exec('grunt lintspaces:editorconfig_notfound', function(error, stdout) {
			var message = MESSAGES.EDITORCONFIG_NOTFOUND.replace('{a}', 'path-doesnt-existis/.editorconfig');
			test.equal(stdout.indexOf(message) > 0, true,
				'Wrong message for not found .editorconfig file. Expected was "'+ message +'".'
			);
			test.done();
		});
	}
};
