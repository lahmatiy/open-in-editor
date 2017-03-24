var settings = {
  executable: 'emacs',
  pattern: '--no-splash "+{line}:{column}" {filename}'
};

var detect = require('../detect').platformSupport(['darwin', 'linux'], settings.executable);
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
