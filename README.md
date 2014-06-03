#grunt-lintspaces

A Grunt task for checking spaces in files depending on the nodemodule
[lintspaces](https://github.com/schorfES/node-lintspaces).

If you're looking for a [gulpjs](http://gulpjs.com/) task to validate your
files, take a look at this one:

* [gulp-lintspaces](https://github.com/ck86/gulp-lintspaces)

## Getting Started
_If you haven't used [grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide._

From the same directory as your project's Gruntfile and package.json, install
this plugin with the following command:

```bash
npm install grunt-lintspaces --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-lintspaces');
```

Inside your `grunt.js` file add a section named `lintspaces`. This section
specifies the tasks. Each task takes sources and options as parameters.

## Parameters

### sources ```src```

This sets the path of the files to be checked.

## Options

### newline at end of file option

Tests for newlines at the end of all files. Default value is `false`.

```javascript
	newline: true
```

### maximum newlines option

Test for the maximum amount of newlines between code blocks. Default value is
`false`. To enable this validation a number larger than `0` is expected.

```javascript
	newlineMaximum: 2
```

### trailingspaces option

Tests for useless whitespaces (trailing whitespaces) at each line ending of all
files. Default value is `false`.

```javascript
	trailingspaces: true
```

If you want to exclude lines which only contain whitespace from this check, set 
`trailingspaces: 'ignore empty'`.

### indentation options

Tests for correct indentation using tabs or spaces. Default value is `false`.
To enable indentation check use the value `'tabs'` or `'spaces'`.

```javascript
	indentation: 'tabs'
```

If the indentation option is set to `'spaces'`, there is also the possibility
to set the amount of spaces per indentation using the `spaces` option. Default value is `4`.

```javascript
	indentation: 'spaces',
	spaces: 2
```

### ignores option

Use the `ignores` option when special lines such as comments should be ignored.
Provide an array of regular expressions to the `ignores` property.

```javascript
	ignores: [
		/\/\*[\s\S]*?\*\//g,
		/foo bar/g
	]
```

There are some _**build in**_ ignores for comments which you can apply by using
these strings:

* 'js-comments'
* 'c-comments'
* 'java-comments'
* 'as-comments'
* 'xml-comments'
* 'html-comments'
* 'python-comments'
* 'ruby-comments'
* 'applescript-comments'

_(build in strings and userdefined regular expressions are mixable in the
`ignores` array)_

```javascript
	ignores: [
		'js-comments',
		/foo bar/g
	]
```

**Feel free to contribute some new regular expressions as build in!**

### .editorconfig option

It's possible to overwrite the default and given options by setting up a path
to an external editorconfig file by unsing the `editorconfig`option. For a basic
configuration of a _.editorconfig_ file check out the
[EditorConfig Documentation](http://editorconfig.org/).

```javascript
	editorconfig: '.editorconfig'
```

The following .editorconfig values are supported:

* `insert_final_newline` will check if a newline is set
* `indent_style` will check the indentation
* `indent_size` will check the amount of spaces
* `trim_trailing_whitespace` will check for useless whitespaces

## Configuration Examples

```javascript
lintspaces: {
	all: {
		src: [
			'**/*'
		],
		options: {
			newline: true,
			newlineMaximum: 2,
			trailingspaces: true,
			indentation: 'spaces',
			spaces: 2
		}
	},
	javascript: {
		src: [
			'js/src/**/*.js'
		],
		options: {
			newline: true,
			trailingspaces: true,
			indentation: 'tabs',
			ignores: ['js-comments']
		}
	},
	external: {
		src: [
			'**/*'
		],
		options: {
			editorconfig: '.editorconfig'
		}
	}
}
```

## Contribution

### Tests & Validation

Run `grunt` to lint and run the tests.

## License

[LICENSE (MIT)](https://github.com/schorfES/grunt-lintspaces/blob/master/LICENSE)
