var extractFilename = require('./utils').extractFilename;
var number = require('./utils').number;
var assign = require('./utils').assign;
var editors = require('./editors');
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

    // if editor option is set then fail on wrong value
    if (editor && !editors.hasOwnProperty(editor)) {
      cb('Wrong value for `editor` option: ' + editor);
      return;
    }

    if (cmd) {
      var settings = {};

      // use editor settings as base
      if (editors.hasOwnProperty(editor)) {
        assign(settings, editors[editor].settings);
      }

      open = openFactory(cmd, assign(settings, options));
    } else {
      if (!editor) {
        cb('Editor is not specified');
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
