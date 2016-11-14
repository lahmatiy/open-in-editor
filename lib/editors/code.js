var atHomeDir = require('../utils').atHomeDir;

var settings = {
  pattern: '-r -g {filename}:{line}:{column}'
};

var detect = require('../detect').lazy('Visual Studio Code', ['code'], '-h', {
  darwin: [
    '/Applications/Visual Studio Code.app/Contents/MacOS/Electron'
  ],
  win32: [
    'C:/Program Files/Microsoft VS Code/bin/code.cmd',
    'C:/Program Files (x86)/Microsoft VS Code/bin/code.cmd',
    atHomeDir('AppData/Local/Code/bin/code.cmd')
  ]
});

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
