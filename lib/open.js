var exec = require('child_process').exec;
var number = require('./utils').number;
var shell = require('./editors/common/shell');
var extractFilename = require('./utils').extractFilename;
var assign = require('./utils').assign;
var terminal = require('./editors/common/terminal');


function getShellPattern(settings) {
  var pattern = settings.pattern || '';

  if (typeof pattern === 'string') {
    pattern = shell(pattern);
  }

  if (!/\{filename\}/.test('' + pattern)) {
    pattern = pattern.concat('{filename}:{line}:{column}');
  }

  return pattern;
}

function makeArguments(filename, settings, projectPath) {
  var info = extractFilename(filename);

  var values = {
    projectPath: settings.projectPath,
    line: info.line + number(settings.line, 1),
    column: info.column + number(settings.column, 1),
    filename: info.filename
  };

  return values;
}

function open(cmd, filename, settings) {
  return new Promise(function(resolve, reject) {
    var projectPath = process.env.PROJECT_PATH || process.PWD || process.cwd();
    var options = assign({}, {
      binary: cmd || settings.binary,
      projectPath: projectPath,
      terminal: false
    }, settings);

    var args = makeArguments(filename, options, projectPath);
    var pattern = getShellPattern(options);
    var command = (options.patternOnly ? pattern : shell(options.binary).concat(pattern)).withParams(args);
    if (options.terminal) {
      command = terminal(command);
    }

    var script = '' + command;
    console.log(script);
    exec(script, {cwd: projectPath}, function(err) {
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
