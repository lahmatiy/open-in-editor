var settings = {
  executable: 'emacs',
  pattern: '--no-splash "+{line}:{column}" {filename}',
  platforms: ['darwin', 'linux'],
  terminal: true
};

var detect = require('../detect').platformSupport(settings.platforms, settings.executable);
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
