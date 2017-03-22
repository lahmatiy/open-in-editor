var exec = require('child_process').exec;
var number = require('./utils').number;
var quote = require('./utils').quote;
var extractFilename = require('./utils').extractFilename;
var append = require('./utils').append;

function makeArguments(filename, settings) {
  var info = extractFilename(filename);
  var pattern = settings.pattern || '';
  var values = {
    projectPath: process.env.PROJECT_PATH || process.PWD || process.cwd(),
    line: info.line + number(settings.line, 1),
    column: info.column + number(settings.column, 1)
  };

  if (!/\{filename\}/.test(pattern)) {
    pattern = append(pattern, '{filename}:{line}:{column}');
  }

  return pattern
    .replace(
      new RegExp('\\{(' + Object.keys(values).join('|') + ')\\}', 'g'),
      function(m, name) {
        return values[name];
      }
    )
    // replace `{filename}` and adjoined right string for quoted filename,
    // since filename can have spaces
    //
    //   {filename} --line 1 --column 2
    //   => "filename" --line 1 --column 2
    //
    //   {filename}:1:2
    //   => "filename:1:2"
    //
    .replace(/\{filename\}(\S*)/, function(m, rest) {
      return quote(info.filename + rest, settings.escapeQuotes);
    });
}

function open(cmd, filename, settings) {
  return new Promise(function(resolve, reject) {
    var args;

    settings = settings || {};
    args = makeArguments(filename, settings);
    cmd = settings.patternOnly ? args : append(quote(cmd), args);

    exec(cmd, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = open;
module.exports.factory = function(cmd, settings) {
  return function openInEditor(filename) {
    return open(cmd, filename, settings);
  };
};

module.exports.detectAndOpenFactory = function(detect, settings) {
  return function openInEditor(filename) {
    return detect().then(function(cmd) {
      open(cmd, filename, settings);
    });
  };
};
