var Promise = require('es6-promise-polyfill').Promise;
var check = require('./check');

function detect(name, commands, args, locations) {
  locations = locations[process.platform] || [];

  return new Promise(function(resolve, reject) {
    function run(task) {
      return this(task, name, args).then(
        resolve,    // any success resolves the main promise immediately
        function(){ /* ignore any reject */ }
      );
    }    

    Promise.all([]
      .concat(commands.map(run, check.command))
      .concat(locations.map(run, check.path))
    ).then(function(results) {
      reject('Not detected');
    }, reject);
  });
}

module.exports = detect;
module.exports.lazy = function(name, commands, args, locations) {
  var memo;

  return function() {
    if (!memo) {
      memo = detect(name, commands, args, locations);
    }

    return memo;
  };
}
