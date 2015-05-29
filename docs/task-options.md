### showValid option

This is a specific option related to this task. When active all valid processed
files will be logged. Default value is `false`.

```javascript
	showValid: true
```

### showTypes option

This is a specific option related to this task. By default the type of each
message is shown by the color of the message text. To show at the beginning of
the message set this to `true`. Default value is `false`.

```javascript
	showTypes: true
```

### showCodes option

This is a specific option related to this task. When active all reporting codes
will appear at the end of each message. Default value is `false`.

```javascript
	showCodes: true
```

### junit option

When adding a path as string for the `junit` option, the grunt task will write
a junit xml report to the specified path. Default value is `false` – disabled.

```javascript
	junit: '.grunt/junit-lintspaces.xml'
```
