var child_process = require('child_process');

module.exports = function(options) {
  options = options || {};

  return function(filename, callback) {
    if (!options.editor) {
      callback('Editor command is no specified');
    }

    var cmd = options.editor + ' ' + filename;

    child_process.exec(cmd, function(err) {
      if (err) {
        callback(
          'Run command error: ' + err + '\n'
          String(err).replace(/[\r\n]+$/, '')
        );
      } else {
        callback();
      }
    });
  };
};
