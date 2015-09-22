var settings = {
  pattern: '{filename}:{line}:{column}'
};

var detect = require('../detect').lazy('Sublime Text', ['subl'], {
  darwin: [
    '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'
  ]
});

var open = require('../open').factory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
