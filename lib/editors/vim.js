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
  // we use only system parts so we haven't to check anything except os
  if (process.platform === 'darwin') {
    return Promise.resolve();
  }

  Promise.reject('"Open in vim" does not implemented for your platform (' + process.platform + ')');
};

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
