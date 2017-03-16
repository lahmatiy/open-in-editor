var osascript = function(script) {
  return 'osascript -e \'' + script + '\'';
};

var terminal = function(cmd) {
  return 'tell application "Terminal" to do script "' + cmd + '"';
};

var runInTerminal = function (cmd) {
  return osascript(terminal('cd {projectPath}; ' + cmd));
};

module.exports = {
  osascript: osascript,
  terminal: terminal,
  runInTerminal: runInTerminal
};
