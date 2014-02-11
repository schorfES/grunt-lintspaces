var
	Logger = require('./lintspaces/Logger'),
	Validator = require('./lintspaces/Validator')
;

module.exports = function(grunt) {
	grunt.registerMultiTask('lintspaces', 'Checking spaces', function() {
		var
			logger = new Logger(grunt),
			validator = new Validator(grunt, this.options, logger)
		;

		this.files.forEach(function(file) {
			file.src.forEach(function(path) {
				validator.validate(path);
			});
		});

		logger.setAmountOfProcessedFiles(validator.getProssessedFiles());
		logger.flush();
	});
};
