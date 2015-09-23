var os = require('osenv');
var path = require('path');

var settings = {
  pattern: '{filename}:{line}:{column}'
};

var detect = require('../detect').lazy('Atom Editor', ['atom'], '-h', {
  darwin: [
    '/Applications/Atom.app/Contents/Resources/app/atom.sh'
  ],
  win32: [
    path.join(os.home(), 'AppData/Local/atom/bin/atom.cmd')
  ]
});

var open = require('../open').factory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
