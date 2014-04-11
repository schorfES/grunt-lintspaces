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
