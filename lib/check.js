var Promise = require('es6-promise-polyfill').Promise;
var child_process = require('child_process');
var fs = require('fs');
var quote = require('./utils').quote;

function checkCommand(cmd, name) {
  return new Promise(function(resolve, reject) {
    child_process.exec(cmd + ' -h', function(err, output) {
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
    return Promise.reject();
  }

  return checkCommand(quote(path), name);
}

module.exports = {
  command: checkCommand,
  path: checkPath
};
