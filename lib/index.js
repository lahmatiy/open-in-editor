var number = require('./utils').number;
var editors = require('./editors');
var extractFilename = require('./utils').extractFilename;
var openFactory = require('./open').factory;

module.exports = {
  configure: function(options, cb) {
    options = options || {};
    cb = cb || function() {};

    var sourceLineOffset = number(options.line, 1);
    var sourceColumnOffset = number(options.column, 1);
    var editor = options.editor;
    var cmd = options.cmd;
    var open;

    if (!cmd && !editor) {
      if (editors.hasOwnProperty(process.env.OPEN_FILE)) {
        editor = process.env.OPEN_FILE;
      } else {
        cmd = process.env.OPEN_FILE ||
              process.env.VISUAL ||
              process.env.EDITOR;
      }
    }

    if (cmd) {
      open = openFactory(cmd);
    } else {
      if (!editor) {
        cb('Editor is not specified');
        return;
      }

      if (!editors.hasOwnProperty(editor)) {
        cb('Wrong value for `editor` option: ' + editor);
        return;
      }

      open = editors[editor].open;
    }

    return {
      open: function(filename) {
        if (!filename) {
          return Promise.reject('File is not specified');
        }

        var info = extractFilename(filename);

        return open([
          info.filename,
          Math.max(info.line - sourceLineOffset, 0),
          Math.max(info.column - sourceColumnOffset, 0)
        ].join(':'));
      }
    };
  }
};
