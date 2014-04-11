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
