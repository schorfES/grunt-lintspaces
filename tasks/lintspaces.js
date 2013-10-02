var
	DEFAULTS = require('./constants/defaults'),
	MESSAGES = require('./constants/messages'),
	PATTERNS = require('./constants/ignorePatterns')
;

module.exports = function(grunt) {

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
						lines = data.split('\n'),
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
							if(line.match(spacesLeadingRegExp)[1].length % options.spaces !== 0) {
								return formatMessage(index + 1, MESSAGES.INDENTATION_SPACES_AMOUNT);
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
						/* Fake replace cycle */
						data.replace(match, function(matched) {
							var args = Array.prototype.slice.call(arguments);
							args.pop(); // last arg is whole string
							var offset = args.pop(), // matched string start index
								substr = data.slice(0, offset), // slice source data from beginning to matched string start index
								secondLineIndex = substr.split(eol).length, // counting substring EOLs: index for second line of matched string
								totalLines = matched.split(eol).length; // counting matched string EOLs
							while ((totalLines -= 1) > 0) {
								ignoredLines[secondLineIndex + totalLines -1] = true;
							}
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
		return 'L'+ linenumber +': '+ message;
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
			msg = '\nErrors found at '+ path;
			warnings.forEach(function(warning) {
				msg += '\n\t'+ warning;
			});
		}

		return msg;
	}

	function printOutput(output, amount) {
		var fileInfo = amount +' file'+ ((amount > 1) ? 's' : '') +' checked.';

		if(output.length > 0) {
			grunt.fail.warn(output +'\n')+ fileInfo +'\n';
		} else {
			grunt.log.ok('All spaces are correct.\n'+ fileInfo +'\n');
		}
	}


	/* Helper functions.
	/* ---------------------------------------------------------------------- */
	function extend(target) {
		var sources = [].slice.call(arguments, 1);
		sources.forEach(function (source) {
			for (var prop in source) {
				target[prop] = source[prop];
			}
		});
		return target;
	}
};
