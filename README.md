[![NPM version](https://img.shields.io/npm/v/open-in-editor.svg)](https://www.npmjs.com/package/open-in-editor)

NPM package to open a file in editor.

Supported editors:

- [Sublime Text](http://www.sublimetext.com/)
- [Atom Editor](https://atom.io/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [PhpStorm](https://www.jetbrains.com/phpstorm/)
- [IDEA 14 Community Edition](https://www.jetbrains.com/idea/download/)
- [Vim](http://www.vim.org/)
- [Emacs](https://www.gnu.org/software/emacs/)
- [Visual Studio](https://www.visualstudio.com/)

You also can use any other editor that is able to open files from command line.

## Installation

```
npm install open-in-editor
```

## Usage

First of all you should create an interface with your settings.

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  // options
}, function(err) {
  console.error('Something went wrong: ' + err);
});
```

Resulting object has a single method `open`. This method runs terminal command that opens an editor. Result of this method is a promise:

```js
editor.open('path/to/file.js:3:10')
  .then(function() {
    console.log('Success!');
  }, function(err) {
    console.error('Something went wrong: ' + err);
  });
```

## API

```
openInEditor.configure([options][, failCallback]);
```

Arguments:

- `options` – *optional* is used to set up a command to launch an editor. If no options set it will try to get the command from [environment](#environment)
- `failCallback` – *optional* function that is called when something's wrong with editor setup.

If editor setup was successful `configure` method returns an interface with single method `open`. The method accepts file reference with the following format: `filename[:line[:column]]`, where `line` and `column` tell the editor where to place cursor when file is opened.

### Options

#### editor

Type: `String` or `null`  
Values: `'sublime'`, `'atom'`, `'code'`, `'webstorm'`, `'phpstorm'`, `'idea14ce'`, `'vim'`, `'emacs'`, `'visualstudio'`  
Default: `null`

Editor to open a file. Once value is set, we try to detect a command to launch an editor.

Supported editors:

- `sublime` – Sublime Text
- `atom` – Atom Editor
- `code` – Visual Studio Code
- `webstorm` – WebStorm
- `phpstorm` - PhpStorm
- `idea14ce` – IDEA 14 CE
- `vim` – Vim (via Terminal, Mac OS only)
- `emacs` – Emacs (via Terminal, Mac OS only)
- `visualstudio` – Visual Studio

#### cmd

Type: `String` or `null`  
Default: `null`

Command to launch an editor.

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  cmd: '/path/to/editor/app'
});
```

If `editor` option is also set, an editor settings are using as default settings.

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  editor: 'code',
  cmd: '/path/to/editor/app' // will be called as '/path/to/editor/app -r -g {filename}:{line}:{column}'
});
```

#### pattern

Type: `String` or `null`  
Default: `null`

Option to specify arguments for a command. Pattern can contain placeholders to be replaced by actual values. Supported placeholders: `filename`, `line` and `column`.

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  cmd: 'code',
  pattern: '-r -g {filename}:{line}:{column}'
});
```

If there's no `{filename}` placeholder in the command then `{filename}:{line}:{column}` is appended. That way previous example can be simplified:

```js
var openInEditor = require('open-in-editor');
var editor = openInEditor.configure({
  cmd: 'code',
  pattern: '-r -g' // the same as '-r -g {filename}:{line}:{column}'
});
```

#### line

Type: `Number`  
Default: `1`

Defines the number of the first line in the editor. Usually it's `1`, but you can set it to `0`.

#### column

Type: `Number`  
Default: `1`

Defines the number of the first column in the editor. Usually it's `1`, but you can set it to `0`.


## Environment

If no `editor` or `cmd` option is specified, we try to get the command to launch an editor using environment settings. Following values can be used (in descending priority):

- `process.env.OPEN_FILE`
- `process.env.VISUAL`
- `process.env.EDITOR`

First value found is used. If it's `process.env.VISUAL` or `process.env.EDITOR`, it's used directly as `cmd` option. But `process.env.OPEN_FILE` is different: if value is a valid for `editor` option, it's used for it, otherwise it's used as a value for `cmd` option.

You can set env settings per command:

```
OPEN_FILE=atom oe path/to/file.js:4:15
OPEN_FILE="code -r -g" node script.js
```

## CLI

Package could be installed globally.

```
npm install open-in-editor -g
```

In this case `oe` command will be available in terminal.

```
Usage:

  oe [filename] [options]

Options:

      --cmd <command>      Command to open file
      --debug              Debug errors
  -e, --editor <editor>    Editor: atom, code, sublime, webstorm, phpstorm, idea14ce, vim, visualstudio, emacs
  -f, --file <filename>    File to open
  -h, --help               Output usage information
  -p, --pattern <pattern>  Filename pattern and args, i.e. something going after cmd
  -v, --version            Output the version
```

## Related projects

- [express-open-in-editor](https://github.com/lahmatiy/express-open-in-editor) – `Express` extension to open files from browser.
- [babel-plugin-source-wrapper](https://github.com/restrry/babel-plugin-source-wrapper) – `Babel` plugin that instruments source code to associate objects with location they defined in code base.
- [Component Inspector](https://github.com/lahmatiy/component-inspector) – developer tool to inspect components that can open component creation source location in editor. Has integrations for `React`, `Backbone` and can be adopted for other frameworks.

## License

MIT
