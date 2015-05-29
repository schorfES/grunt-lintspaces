var
	fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	execOptions = {
		cwd: path.join(__dirname, '..')
	},

	PATH_DIR = path.join(__dirname, 'temp'),
	PATH_FILE = path.join(PATH_DIR, 'junit.xml'),

	EXPECTED =
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<testsuites failures="7">' +
			'<testsuite name="tests/files/indentation_tabs.txt" tests="1" failures="3">' +
				'<testcase name="tests/files/indentation_tabs.txt" classname="grunt.lintspaces">' +
					'<failure message="Unexpected spaces found. at line 3" type="warning"/>' +
					'<failure message="Unexpected spaces found. at line 8" type="warning"/>' +
					'<failure message="Unexpected spaces found. at line 9" type="warning"/>' +
				'</testcase>' +
			'</testsuite>' +
			'<testsuite name="tests/files/indentation_spaces.txt" tests="1" failures="4">' +
				'<testcase name="tests/files/indentation_spaces.txt" classname="grunt.lintspaces">' +
					'<failure message="Unexpected spaces found. at line 3" type="warning"/>' +
					'<failure message="Unexpected spaces found. at line 8" type="warning"/>' +
					'<failure message="Unexpected spaces found. at line 9" type="warning"/>' +
					'<failure message="Unexpected spaces found. at line 10" type="warning"/>' +
				'</testcase>' +
			'</testsuite>' +
		'</testsuites>'
;

exports.tests = {
	active: function(test) {
		test.expect(1);

		exec('rm -rf ' + PATH_DIR + ' && grunt lintspaces:junit_active', execOptions, function() {

			fs.readFile(PATH_FILE, 'utf8', function (error, data) {
				if (error) { throw error; }

				test.equal(data, EXPECTED, 'junit output is correct');
				test.done();
			});
		});
	},

	inactive: function(test) {
		test.expect(2);
		exec('rm -rf ' + PATH_DIR + ' && grunt lintspaces:junit_inactive', execOptions, function() {
			fs.exists(PATH_DIR, function (exists_dir) {
				test.equal(exists_dir, false, 'the dir does not exist');

				fs.exists(PATH_FILE, function (exists_file) {
					test.equal(exists_file, false, 'the dir does not exist');
					test.done();
				});
			});
		});
	}
};
