module.exports = function(grunt) {

	var
		DEFAULTS = {
			encoding: 'utf8',
			newline: false,
			indentation: false, //'tabs' or 'spaces' or false
			spaces: 4, //amount of spaces when 'indentation' is set to 'spaces'
			trailingspaces: false
		},
		MESSAGES = {
			INDENTATION_TABS: 'no correct indentation with tabs.',
			INDENTATION_SPACES: 'no correct indentation with spaces.',
			INDENTATION_SPACES_AMOUNT: 'incorrect amout of spaces as indentation.',
			TRAILINGSPACES: 'trailing spaces found.',
			NEWLINE: 'no newline at end of file.',
			NEWLINE_AMOUNT: 'too many new lines at end of file.'
		}
	;

	grunt.registerMultiTask('lintspaces', 'Checking spaces', function() {
		var
			options = this.options(DEFAULTS),
			output = ''
		;

		this.files.forEach(function(file) {
			file.src.forEach(function(path) {
				var
					data = grunt.file.read(path, options.encoding),
					lines = data.split('\n'),
					warnings = []
				;

				lines.forEach(function(line, index) {
					//check indentation:
					pushWarning(warnings, checkIndentation(options, line, index));
					//check trailingspaces:
					pushWarning(warnings, checkTrailingspaces(options, line, index));
				});

				//check newline at end of file:
				pushWarning(warnings, checkNewline(options, lines));

				//print found warning for file
				output += formatWarnings(options, path, warnings);
			});

			printOutput(output);
		});

	});



	/* Validation functions. */
	function checkIndentation(options, line, index) {
		if(typeof options.indentation === 'string' && typeof line === 'string') {
			var
				tabsRegExp = /^\t*(?!\s).*$/, //leading tabs without leading spaces
				spacesRegExp = /(^$|^ *(?!\t)[^ ].*$)/, //no empty line or leading spaces without leading tabs
				spacesLeadingRegExp = /^( *).*$/,
				matchSpaces
			;

			switch(options.indentation) {
				case 'tabs':
					if(!tabsRegExp.test(line)) {
						//indentation failed...
						return formatMessage(index + 1, MESSAGES.INDENTATION_TABS);
					}
					break;

				case 'spaces':
					if(!spacesRegExp.test(line)) {
						//indentation failed...
						return formatMessage(index + 1, MESSAGES.INDENTATION_SPACES);
					} else {
						//indentation correct, is amount of spaces correct?
						if(typeof options.spaces === 'number') {
							matchSpaces = line.match(spacesLeadingRegExp);
							if(matchSpaces.length > 1 && matchSpaces[1].length % options.spaces !== 0) {
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

			//check last line:
			if(lines[index].length > 0) {
				return formatMessage(index + 1, MESSAGES.NEWLINE);
			}

			//check line before last line:
			if(lines[index - 1].length === 0) {
				return formatMessage(index, MESSAGES.NEWLINE_AMOUNT);
			}
		}
	}



	/* Helper functions for formating output. */
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

	function printOutput(output) {
		if(output.length > 0) {
			grunt.fail.warn(output +'\n');
		} else {
			grunt.log.ok('All spaces are correct.');
		}
	}
};
