[![NPM version](https://img.shields.io/npm/v/open-in-editor.svg)](https://www.npmjs.com/package/open-in-editor)

Simplify file open in editor.

Supported editors:

- [Sublime Text](http://www.sublimetext.com/)
- [Atom Editor](https://atom.io/)
- [Visual Studio Code](https://code.visualstudio.com/)

But you also can use any other editor that supported file opening by terminal command.

> More editors are comming soon, PRs are welcome.

## Install

```
npm install open-in-editor
```

## Usage

First of all you should create interface with your settings.

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  // options
}, function(err) {
  console.error('Something goes wrong: ' + err);
});
```

Created interface have single method `open`. This method runs terminal command that opens editor. Result of method is Promise instance:

```js
editor.open('path/to/file.js:3:10')
  .then(function() {
    console.log('Success!');
  }, function(err) {
    console.error('Something goes wrong: ' + err);
  });
```

## API

```
openInEditor.configure([options][, failCallback]);
```

Arguments:

- `options` – *optional* uses for setup command to launch editor. If no options set it will try to get command from [environment](#Environment)
- `failCallback` – *optional* function that calls when something goes wrong on editor setup.

If editor is set up successful `configure` method returns interface with single method `open`. `open` method accepts file reference in format: `filename[:line[:column]]`. `line` and `column` tells editor where to place cursor when file is opened.

### Options

#### editor

Type: `String`

Values: `sublime`, `atom`, `code`

Default: *not set*

Allows set editor to open file. Option accepts one preset value. When some value is set, we try to detect command to launch editor if possible.

Supported editors:

- `sublime` – Sublime Text
- `atom` – Atom Editor
- `code` – Visual Studio Code

#### cmd

Type: `String`

Default: *not set*

Specify command to launch editor. If some value set to option then `editor` is ignoring.

Command could contains some patterns to be replaced by actual values. Supported values: `filename`, `line` and `column`.

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  cmd: 'code -r -g {filename}:{line}:{column}'
});
```

If no `{filename}` pattern in command then `{filename}:{line}:{column}` is appending. So, previous example could be simplified:

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  cmd: 'code -r -g'
});
```

#### line

Type: `Number`

Default: `1`

Defines what is the first line in filename reference that pass to `open`method. Usually it's lines starts with `1`. But you can pass file offset starts with `0`.

#### column

Type: `Number`

Default: `1`

Defines what is the first coulmn in filename reference that pass to `open`method. Usually it's coulmns starts with `1`. But you can pass file offset starts with `0`.

## Environment

If no `editor` or `cmd` value specified, we try to get command to launch editor from environment settings. Follow values could be used (in descending of priority):

- `process.env.OPEN_FILE`
- `process.env.VISUAL`
- `process.env.EDITOR`

If any value found it uses as value for `cmd` option. But `OPEN_FILE` a little bit different: if value is one of allowed values for `editor` it uses as value for `editor` option, otherwise it uses as value for `cmd`.

You can set env setting on any command launch:

```
OPEN_FILE=atom oe path/to/file.js:4:15
OPEN_FILE="code -r -g" node script.js
```

## CLI

Package could be installed globally.

```
npm install open-in-editor -g
```

In this case `oe` command will be available in terminal. Usage of command:

```
Usage:

  oe [filename] [options]

Options:

      --cmd <command>      Command to open file
      --debug              Debug errors
  -e, --editor <editor>    Editor: atom, code, sublime
  -f, --file <filename>    File to open
  -h, --help               Output usage information
  -v, --version            Output the version
```

## Related projects

- [express-open-in-editor](https://github.com/lahmatiy/express-open-in-editor) – Express extension to open files from browser

## License

MIT
