var settings = {
  executable: 'vim',
  // enable the tabs if vim compiled with the +clientserver option
  // pattern: '--servername OE --remote-tab-silent "+call cursor({line}, {column})" {filename}',
  pattern: '"+call cursor({line}, {column})" {filename}',
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
