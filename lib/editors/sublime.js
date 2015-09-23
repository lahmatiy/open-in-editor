var settings = {
  pattern: '{filename}:{line}:{column}'
};

var detect = require('../detect').lazy('Sublime Text', ['subl'], '-h', {
  darwin: [
    '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'
  ],
  win32: [
    'C:/Program Files/Sublime Text/subl.exe',
    'C:/Program Files/Sublime Text 2/subl.exe',
    'C:/Program Files/Sublime Text 3/subl.exe',
    'C:/Program Files (x86)/Sublime Text/subl.exe',
    'C:/Program Files (x86)/Sublime Text 2/subl.exe',
    'C:/Program Files (x86)/Sublime Text 3/subl.exe'
  ]
});

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
