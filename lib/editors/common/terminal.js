var osascript = function(script) {
  return 'osascript -e \'' + script + '\'';
};

var terminal = function(cmd) {
  return 'tell application "Terminal" to do script "' + cmd + '"';
};

var runInTerminalDarwin = function(cmd) {
  return osascript(terminal('cd {projectPath}; ' + cmd));
};

var runInTerminalLinux = function(cmd) {
  return 'gnome-terminal -x sh -c \'sh -c "cd {projectPath}; ' + cmd + '"\'';
};

var support = {
  darwin: runInTerminalDarwin,
  linux: runInTerminalLinux
}

var runInTerminal = function(cmd) {
  return support[process.platform](cmd);
};

module.exports = runInTerminal;
