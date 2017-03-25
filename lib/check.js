var exec = require('child_process').exec;
var fs = require('fs');
var shell = require('./editors/common/shell');

function checkCommand(cmd, name, args) {
  if (!args) {
    return Promise.reject('No args to check command: ' + cmd);
  }

  return new Promise(function(resolve, reject) {
    var command = shell(cmd, args).toString();
    exec(command.cmd, function(err, output) {
      if (err || output.indexOf(name) !== 0) {
        reject(err);
      } else {
        resolve(cmd);
      }
    });
  });
}

function checkPath(path, name) {
  if (!fs.existsSync(path)) {
    return Promise.reject('Path does not exist: ' + path);
  }

  return Promise.resolve(path);
}

module.exports = {
  command: checkCommand,
  path: checkPath
};
