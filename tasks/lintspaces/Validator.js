var
	DEFAULTS = require('./constants/defaults'),
	MESSAGES = require('./constants/messages'),
	PATTERNS = require('./constants/ignorePatterns'),
	MAPPINGS = require('./constants/editorconfigMappings'),

	eol = /\r?\n/,

	merge = require('merge'),
	editorconfig = require('editorconfig')
;

module.exports = (function() {
	var Validator = function(grunt, options, logger) {
		this._grunt = grunt;
		this._options = options(DEFAULTS);
		this._logger = logger;
		this._processedFiles = 0;
	};

	Validator.prototype.validate = function(path) {
		var self = this;
		if(this._grunt.file.isFile(path)) {
			// Load file, settings & ignores:
			this._path = path;
			this._loadSettings();
			this._loadFile();
			this._loadIgnores();

			// Validate total file:
			this._validateNewlines();

			// Validate single lines:
			this._lines.forEach(function(line, index) {
				self._validateIndentation(line, index);
				self._validateTrailingspaces(line, index);
			});

			// Validation is done:
			this._done();
		}
	};

	Validator.prototype.getProssessedFiles = function() {
		return this._processedFiles;
	};

	Validator.prototype._done = function() {
		this._processedFiles++;

		// Cleanup references:
		this._settings = null;
		this._data = undefined;
		this._lines = null;
		this._ignoredLines = null;
	};

	/*
	 * Loading functions
	 * ---------------------------------------------------------------------- */

	Validator.prototype._loadFile = function() {
		this._data = this._grunt.file.read(this._path, this._settings.encoding),
		this._lines = this._data.split(eol);
	};

	Validator.prototype._loadSettings = function() {
		var config, key;

		// Initially the users options are the current settings:
		this._settings = merge({}, this._options);

		// Overwrite settings by .editorconfig file's settings:
		if (typeof this._settings.editorconfig === 'string') {
			if (this._grunt.file.isFile(this._settings.editorconfig)) {

				// Load config for current path
				config = editorconfig.parse(
					this._path, {
						config: this._settings.editorconfig
					}
				);

				if (typeof config === 'object') {
					// Merge editorconfig values into the correct settings names:
					for (key in config) {
						if (typeof MAPPINGS[key] === 'string') {
							switch (key) {
								case 'indent_style':
									// The 'indent_style' property value isn't
									// equal to the expected setting value:
									this._settings[MAPPINGS[key]] = config[key] + 's';
									break;
								default:
									this._settings[MAPPINGS[key]] = config[key];
									break;
							}
						}
					}
				}
			} else {
				this._logFail(
					MESSAGES.EDITORCONFIG_NOTFOUND.replace(
						'{a}',
						this._settings.editorconfig
					)
				);
			}
		}
	};

	Validator.prototype._loadIgnores = function() {
		var
			self = this,
			ignores = []
		;

		this._ignoredLines = {};

		// Load ignore patterns:
		if(Array.isArray(this._settings.ignores)) {
			this._settings.ignores.forEach(function(ignore) {
				if(typeof ignore === 'string' && typeof PATTERNS[ignore] === 'object') {
					ignores.push(PATTERNS[ignore]);
				} else if(typeof ignore === 'object' && typeof ignore.test === 'function') {
					ignores.push(ignore);
				}
			});
		}

		// When no patterns are defined, disable the following search for lines:
		if(ignores.length === 0) {
			ignores = false;
		}

		// Index lines which match patterns, when available:
		if(Array.isArray(ignores)) {

			// Loop all given regular expressions:
			ignores.forEach(function(expression) {

				var matches = self._data.match(expression) || [];

				matches.forEach(function(match) {

					// Only perform an action when match has more
					// than one line:
					if (eol.test(match)) {

						// Use fake replace cycle to find indices of all
						// lines to be ignored. Return unchanged match:
						self._data = self._data.replace(match, function(matched) {
							var
								index = 1,
								args,
								indexOfMatch,
								indexOfSecondLine,
								totalLines
							;

							// last argument is whole string, remove it:
							args = Array.prototype.slice.call(arguments);
							args.pop();

							// matched string start index:
							indexOfMatch = args.pop();

							// slice source data from beginning to matched
							// string start index to find index of second
							// line to be ignored:
							indexOfSecondLine = self._data.slice(0, indexOfMatch).split(eol).length;
							totalLines = matched.split(eol).length;

							//Count and store lines:
							while (index < totalLines) {
								self._ignoredLines[indexOfSecondLine + index - 1] = true;
								index++;
							}

							// Fillup result with linebreaks and overwrite
							// data string in case that the data string contains
							// the current 'matched' more than once:
							return Array(totalLines).join('\n');
						});

					}
				});
			});
		}
	};

	/*
	 * Validation functions
	 * ---------------------------------------------------------------------- */

	Validator.prototype._validateNewlines = function() {
		if(this._settings.newline && this._lines.length > 1) {
			var
				index = this._lines.length - 1
			;

			// check last line:
			if(this._lines[index].length > 0) {
				this._logLine(index + 1, MESSAGES.NEWLINE);
			}

			// check line before last line:
			if(this._lines[index - 1].length === 0) {
				this._logLine(index, MESSAGES.NEWLINE_AMOUNT);
			}
		}
	};

	Validator.prototype._validateTrailingspaces = function(line, index) {
		if(this._settings.trailingspaces && typeof line === 'string') {
			var matchSpaces = line.match(/\s*$/);
			if( matchSpaces.length > 0 && matchSpaces[0].length > 0) {
				this._logLine(index + 1, MESSAGES.TRAILINGSPACES);
			}
		}
	};

	Validator.prototype._validateIndentation = function(line, index) {
		if (!this._ignoredLines[index] &&
			typeof this._settings.indentation === 'string' &&
			typeof line === 'string') {

			var
				tabsRegExp = /^\t*(?!\s).*$/, // leading tabs without leading spaces
				spacesRegExp = /^ *(?!\s).*$/, // leading spaces without leading tabs
				spacesLeadingRegExp = /^( *).*$/,
				spacesExpected,
				indent,
				message
			;

			switch(this._settings.indentation) {
				case 'tabs':
					if(!tabsRegExp.test(line)) {
						// indentation failed...
						return this._logLine(index + 1, MESSAGES.INDENTATION_TABS);
					}
					break;

				case 'spaces':
					if(!spacesRegExp.test(line)) {
						// Indentation failed...
						this._logLine(index + 1, MESSAGES.INDENTATION_SPACES);
					} else {
						// Indentation correct, is amount of spaces correct?
						if(typeof this._settings.spaces === 'number') {
							indent = line.match(spacesLeadingRegExp)[1].length;
							if(indent % this._settings.spaces !== 0) {
								// Indentation incorrect, create message:
								spacesExpected = Math.round(indent/this._settings.spaces) * this._settings.spaces;
								message = MESSAGES.INDENTATION_SPACES_AMOUNT
									.replace('{a}', spacesExpected)
									.replace('{b}', indent);

								this._logLine(index + 1, message);
							}
						}
					}
					break;
			}
		}
	};

	/*
	 * Logging functions
	 * ---------------------------------------------------------------------- */

	Validator.prototype._logFail = function(message) {
		this._logger.fail(message);
	};

	Validator.prototype._logLine = function(linenumber, message) {
		this._logger.logLine(this._path, linenumber, message);
	};


	return Validator;
})();
