var child_process = require('child_process');
var number = require('./utils').number;
var extractFilename = require('./utils').extractFilename;
var fail = require('./utils').fail;
var editors = require('./editors');

module.exports = {
  configure: function(options) {
    options = options || {};

    if (!options.editor) {
      fail('Editor is not specified');
    }

    if (!editors.hasOwnProperty(options.editor)) {
      fail('Wrong value for `editor` option: ' + options.editor);
    }

    var editor = require('./editors/' + editors[options.editor]);
    var sourceLineOffset = number(options.line, 1);
    var sourceColumnOffset = number(options.column, 1);

    return {
      open: function(filename) {
        var info = extractFilename(filename);

        return editor.open([
          info.filename,
          Math.max(info.line - sourceLineOffset, 0),
          Math.max(info.column - sourceColumnOffset, 0)
        ].join(':'));
      }
    };
  }
};
