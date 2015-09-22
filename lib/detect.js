var Promise = require('es6-promise-polyfill').Promise;
var check = require('./check');

function detect(name, commands, locations) {
  locations = locations[process.platform] || [];

  return new Promise(function(resolve, reject) {
    function wrap(array, fn) {
      return array.map(function(item) {
        return fn(item, name).then(function(cmd) {
          if (!resolved) {
            resolved = true;
            resolve(cmd);
          }
        });
      });
    }

    var resolved = false;

    Promise.all([]
      .concat(wrap(commands, check.command))
      .concat(wrap(locations, check.path))
    ).then(function() {
      if (!resolved) {
        reject();
      }
    });
  });
}

module.exports = detect;
module.exports.lazy = function(name, commands, locations) {
  var memo;

  return function() {
    if (!memo) {
      memo = detect(name, commands, locations);
    }

    return memo;
  };
}
