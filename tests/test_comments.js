var
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
			test.equal(stdout.indexOf('L' + line + ':') > -1, false,
				'this is a comment and should be ignored (L' + line + ')'
			);
		});

		finds.forEach(function(line) {
			test.equal(stdout.indexOf('L' + line + ':') > -1, true,
				'this is not a comment (L' + line + ')'
			);
		});

		test.done();
	});
}

exports.tests = {
	pattern: function(test) {
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

		run(test, 'grunt lintspaces:comments_pattern', linesToIgnore, linesToFind);
	},

	buildinJs: function(test) {
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

		run(test, 'grunt lintspaces:comments_buildin_js', linesToIgnore, linesToFind);
	},

	buildinPy: function(test) {
		var
			linesToIgnore = [
				2, 3, 4,
				7, 8, 9
			],
			linesToFind = [
				12
			]
		;

		run(test, 'grunt lintspaces:comments_buildin_py', linesToIgnore, linesToFind);
	},

	buildinXml: function(test) {
		var
			linesToIgnore = [
				4, 5, 6, 7,
				9, 10, 11
			],
			linesToFind = [
				14,
				17,
				19
			]
		;

		run(test, 'grunt lintspaces:comments_buildin_xml', linesToIgnore, linesToFind);
	},

	nomatches: function(test) {
		test.expect(1);
		exec('grunt lintspaces:comments_nomatches', execOptions, function(error, stdout) {
			test.equal(stdout.indexOf('lint free.') > -1, true,
				'There is an error'
			);

			test.done();
		});
	}
};
