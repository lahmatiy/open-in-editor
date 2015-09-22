var settings = {
  pattern: '{filename}:{line}:{column}'
};

var detect = require('../detect').lazy('Atom Editor', ['atom'], {});

var open = require('../open').factory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
