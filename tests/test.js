/*
var
	path = require('path'),
	grunt = require('grunt')
	files = path.join(__dirname, 'files')
;
*/
exports.tests = {
	newlines: function(test) {
		test.equal(true, true, 'this should work.');
		test.done();
	}
};
