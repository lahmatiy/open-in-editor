var Promise = require('es6-promise-polyfill').Promise;

var osascript = function(script) {
  return 'osascript -e \'' + script + '\'';
};

var terminal = function(cmd) {
  return 'tell application "Terminal" to do script "' + cmd + '"';
};

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: osascript(
    terminal(
      'cd {projectPath};' +
      'vim {filename} \\"+call cursor({line}, {column})\\"'
    )
  )
};

var detect = function() {
  return new Promise(function(resolve, reject) {
    // we use only system parts so we haven't to check anything except os
    if (process.platform === 'darwin') {
      resolve();
    }
    reject('"Open in vim" implementation does not exist for your system.');
  });
};

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
