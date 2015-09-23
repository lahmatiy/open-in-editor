var atHomeDir = require('../utils').atHomeDir;

var settings = {
  pattern: '{filename}:{line}:{column}'
};

var detect = require('../detect').lazy('Atom Editor', ['atom'], '-h', {
  darwin: [
    '/Applications/Atom.app/Contents/Resources/app/atom.sh'
  ],
  win32: [
    atHomeDir('AppData/Local/atom/bin/atom.cmd')
  ]
});

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
