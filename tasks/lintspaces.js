var
	DEFAULTS = require('./constants/defaults'),
	MESSAGES = require('./constants/messages'),
	PATTERNS = require('./constants/ignorePatterns')
;

module.exports = function(grunt) {
	var eol = /\r?\n/;

	grunt.registerMultiTask('lintspaces', 'Checking spaces', function() {
		var
			options = this.options(DEFAULTS),
			output = '',
			processedFiles = 0
		;

		// replace ingnore strings with buildin patterns:
		options.ignores = updateIgnores(options);

		this.files.forEach(function(file) {
			file.src.forEach(function(path) {
				if(grunt.file.isFile(path)) {
					var
						data = grunt.file.read(path, options.encoding),
						ignoredLines = indexIgnoreLines(options, data),
						lines = data.split(eol),
						warnings = []
					;

					lines.forEach(function(line, index) {
						if(!ignoredLines[index]) {
							// check indentation:
							pushWarning(warnings, checkIndentation(options, line, index));
						}

						// check trailingspaces:
						pushWarning(warnings, checkTrailingspaces(options, line, index));
					});

					// check newline at end of file:
					pushWarning(warnings, checkNewline(options, lines));

					// save found warning(s) for file
					output += formatWarnings(options, path, warnings);
					processedFiles++;
				}
			});
		});

		printOutput(output, processedFiles);
	});


	/* Validation functions.
	/* ---------------------------------------------------------------------- */
	function checkIndentation(options, line, index) {
		if(typeof options.indentation === 'string' && typeof line === 'string') {
			var
				tabsRegExp = /^\t*(?!\s).*$/, // leading tabs without leading spaces
				spacesRegExp = /^ *(?!\s).*$/, // leading spaces without leading tabs
				spacesLeadingRegExp = /^( *).*$/
			;

			switch(options.indentation) {
				case 'tabs':
					if(!tabsRegExp.test(line)) {
						// indentation failed...
						return formatMessage(index + 1, MESSAGES.INDENTATION_TABS);
					}
					break;

				case 'spaces':
					if(!spacesRegExp.test(line)) {
						// indentation failed...
						return formatMessage(index + 1, MESSAGES.INDENTATION_SPACES);
					} else {
						// indentation correct, is amount of spaces correct?
						if(typeof options.spaces === 'number') {
							var indent = line.match(spacesLeadingRegExp)[1].length;
							if(indent % options.spaces !== 0) {
								var
									makeMultiple = function(input) {
										// Round up or down the input based on the spaces that we configured
										return Math.round(input/options.spaces) * options.spaces;
									},
									message = MESSAGES.INDENTATION_SPACES_AMOUNT
										.replace('{a}', makeMultiple(indent))
										.replace('{b}', indent)
								;
								return formatMessage(index + 1, message);
							}
						}
					}
					break;
			}
		}
	}

	function checkTrailingspaces(options, line, index) {
		if(options.trailingspaces && typeof line === 'string') {
			var matchSpaces = line.match(/\s*$/);
			if( matchSpaces.length > 0 && matchSpaces[0].length > 0) {
				return formatMessage(index + 1, MESSAGES.TRAILINGSPACES);
			}
		}
	}

	function checkNewline(options, lines) {
		if(options.newline && lines.length > 1) {
			var
				index = lines.length - 1
			;

			// check last line:
			if(lines[index].length > 0) {
				return formatMessage(index + 1, MESSAGES.NEWLINE);
			}

			// check line before last line:
			if(lines[index - 1].length === 0) {
				return formatMessage(index, MESSAGES.NEWLINE_AMOUNT);
			}
		}
	}


	/* Ignores functions.
	/* ---------------------------------------------------------------------- */
	function updateIgnores(options) {
		var ignores = [];
		if(Array.isArray(options.ignores)) {
			options.ignores.forEach(function(ignore) {
				if(typeof ignore === 'string' && typeof PATTERNS[ignore] === 'object') {
					ignores.push(PATTERNS[ignore]);
				} else if(typeof ignore === 'object' && typeof ignore.test === 'function') {
					ignores.push(ignore);
				}
			});
		}

		if(ignores.length === 0) {
			ignores = false;
		}

		return ignores;
	}

	function indexIgnoreLines(options, data) {
		var ignoredLines = {};

		if(Array.isArray(options.ignores)) {

			/* Loop all given regular expressions: */
			options.ignores.forEach(function(expression) {

				var matches = data.match(expression) || [];

				matches.forEach(function(match) {

					/* Only perform an action when match has more
					/* than one line */
					if (eol.test(match)) {

						/* Use fake replace cycle to find indices of all
						/* lines to be ignored. Return unchanged match. */
						data.replace(match, function(matched) {
							var
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
							indexOfSecondLine = data.slice(0, indexOfMatch).split(eol).length;
							totalLines = matched.split(eol).length;

							//Count and store lines:
							while ((totalLines -= 1) > 0) {
								ignoredLines[indexOfSecondLine + totalLines - 1] = true;
							}

							//Return unchanged match:
							return matched;
						});

					}
				});
			});
		}

		return ignoredLines;
	}


	/* Formating output.
	/* ---------------------------------------------------------------------- */
	function formatMessage(linenumber, message) {
		return 'L'+ linenumber +': '+ message.yellow;
	}

	function pushWarning(warnings, warning) {
		if(typeof warning === 'string') {
			warnings.push(warning);
		}
	}

	function formatWarnings(options, path, warnings) {
		var
			msg = ''
		;

		if(warnings.length > 0) {
			msg = 'ERROR: '.red + path.underline;
			warnings.forEach(function(warning) {
				msg += '\n'+ warning;
			});
			msg += '\n';
		}

		return msg;
	}

	function printOutput(output, amount) {
		var fileInfo = amount +' file'+ ((amount > 1) ? 's' : '') +' checked.';

		if(output.length > 0) {
			grunt.log.writeln(output);
			grunt.fail.warn('Formatting check failed.');
		} else {
			grunt.log.ok('All spaces are correct.\n'+ fileInfo +'\n');
		}
	}
};
