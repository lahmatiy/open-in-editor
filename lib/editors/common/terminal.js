var shell = require('./shell');
var assign = require('../../utils').assign;

var osascript = function(script) {
  return shell.parse('osascript -e').concat(script);
};

var terminal = function(cmd) {
  return 'tell application "Terminal" to do script "' + cmd + '"';
};

var runInTerminalDarwin = function(cmd) {
  return osascript(terminal(cmd));
};

var runInTerminalLinux = function(cmd) {
  return shell.parse('gnome-terminal -x sh -c', cmd);
};

var supported = {
  darwin: runInTerminalDarwin,
  linux: runInTerminalLinux
};

var getTerminal = function(options) {
  var opts = assign({platform: process.platform}, options || {});

  if (!supported[opts.platform]) {
    throw new Error('Not supported');
  }

  return supported[opts.platform];
};

var runInTerminal = function(cmd, options) {
  var terminal = getTerminal(options);
  return terminal(cmd);
};

module.exports = runInTerminal;
