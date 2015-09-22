var child_process = require('child_process');
var Promise = require('es6-promise-polyfill').Promise;
var number = require('./utils').number;
var quote = require('./utils').quote;
var extractFilename = require('./utils').extractFilename;

function makeArguments(filename, settings) {
  var info = extractFilename(filename);
  var values = {
    line: info.line + number(settings.line, 1),
    column: info.column + number(settings.column, 1)
  };

  return settings.pattern
    .replace(
      new RegExp('\\{(' + Object.keys(values).join('|') + ')\\}', 'g'),
      function(m, name) {
        return values[name];
      }
    )
    // replace `{filename}` and joined right string for quoted filename,
    // as it could has spaces
    //
    //   '{filename} --line 1 --column 2'
    //    -> '"filename" --line 1 --column 2'
    //
    //   '{filename}:1:2'
    //    -> '"filename:1:2"'
    //
    .replace(/\{filename\}(\S*)/, function(m, rest) {
      return quote(info.filename + rest);
    });
}

function open(detect, filename, settings) {
  return detect.then(function(cmd) {
    return new Promise(function(resolve, reject) {
      child_process.exec(cmd + ' ' + makeArguments(filename, settings), function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

module.exports = open;
module.exports.factory = function(detect, settings){
  return function openInEditor(filename) {
    return open(detect(), filename, settings);
  }
};
