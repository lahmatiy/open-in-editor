var check = require('./check');
var any = require('./utils').any;

function detect(name, commands, args, locations) {
  function run(task) {
    return this(task, name, args);
  }

  locations = locations[process.platform] || [];

  return any(
    [].concat(
      commands.map(run, check.command),
      locations.map(run, check.path)
    ),
    'Not detected'
  );
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
};
module.exports.platformSupport = function(platforms, editor, resolveValue) {
  return function() {
    // we use only system parts so we haven't to check anything except os
    if (platforms.indexOf(process.platform) !== -1) {
      return Promise.resolve(resolveValue);
    }

    return Promise.reject('"Open in ' + editor + '" does not implemented for your platform (' + process.platform + ')');
  };
};
