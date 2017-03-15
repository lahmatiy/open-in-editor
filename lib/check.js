var exec = require('child_process').exec;
var fs = require('fs');
var quote = require('./utils').quote;

function checkCommand(cmd, name, args) {
  if (!args) {
    return Promise.reject('No args to check command: ' + cmd);
  }

  return new Promise(function(resolve, reject) {
    exec(cmd + ' ' + args, function(err, output) {
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
