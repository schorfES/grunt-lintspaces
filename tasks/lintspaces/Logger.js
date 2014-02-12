var
	MESSAGES = require('./constants/messages')
;

module.exports = (function() {
	var Logger = function(grunt) {
		this._grunt = grunt;
		this._messages = {};
	};

	Logger.prototype._add = function(path, message) {
		if (typeof this._messages[path] !== 'object') {
			this._messages[path] = [];
		}

		this._messages[path].push(message);
	};

	Logger.prototype.setAmountOfProcessedFiles = function(amount) {
		this._amountOfFiles = amount;
	};

	Logger.prototype.logLine = function(path, linenumber, message) {
		this._add(path, 'L' + linenumber + ': ' + message.yellow);
	};

	Logger.prototype.fail = function(message) {
		this._grunt.fail.warn(message);
	};

	Logger.prototype.flush = function() {
		var
			self = this,
			out = ''
		;

		Object.keys(this._messages).forEach(function(path) {
			out += 'ERROR: '.red + path.underline + '\n';

			self._messages[path].forEach(function(message) {
				out += message + '\n';
			});
		});

		if (out.length > 0) {
			this._grunt.log.writeln(out);
			this.fail(MESSAGES.FAILED_LINTING);
		} else {
			this._grunt.log.ok(
				MESSAGES.PASSED_LINTING.replace(
					'{a}',
					this._amountOfFiles + ' file' + ((this._amountOfFiles > 1) ? 's' : '')
				)
			);
		}
	};

	return Logger;
})();
