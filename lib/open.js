var Promise = require('es6-promise-polyfill').Promise;
var exec = require('child_process').exec;
var number = require('./utils').number;
var quote = require('./utils').quote;
var extractFilename = require('./utils').extractFilename;

function makeArguments(filename, settings) {
  var info = extractFilename(filename);
  var pattern = settings.pattern;
  var values = {
    line: info.line + number(settings.line, 1),
    column: info.column + number(settings.column, 1)
  };

  if (!/\{filename\}/.test(pattern)) {
    pattern += ' {filename}:{line}:{column}';
  }

  return pattern
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
      cmd = quote(cmd) + ' ' + makeArguments(filename, settings);

      exec(cmd, function(err) {
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
module.exports.factory = function(detect, settings) {
  return function openInEditor(filename) {
    return open(detect(), filename, settings);
  };
};
