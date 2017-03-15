var path = require('path');

var helperPath = path.resolve(path.join(__dirname, 'open-in-msvs.vbs'));

var settings = {
  pattern: '/s /c ""' + helperPath + '" {filename} {line} {column}"'
};

var detect = function() {
  var lazy = require('../../detect').lazy('Visual Studio', [], '', {
    win32: [
      helperPath
    ]
  });
  return lazy().then(function() { return 'cmd.exe'; });
};

var open = require('../../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
