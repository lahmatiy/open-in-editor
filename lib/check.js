var Promise = require('es6-promise-polyfill').Promise;
var child_process = require('child_process');
var fs = require('fs');
var quote = require('./utils').quote;

function checkCommand(cmd, name, args) {
  return new Promise(function(resolve, reject) {
    if (!args) {
      return reject('No args to check command: ' + cmd);
    }

    child_process.exec(cmd + ' ' + args, function(err, output) {
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
