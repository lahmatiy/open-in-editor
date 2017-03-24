var settings = {
  executable: 'vim',
  // FIXME: enable tabs if vim compiled with the +clientserver option
  // pattern: '--servername VIM --remote-tab-silent "+call cursor({line}, {column})" {filename}',
  pattern: '"+call cursor({line}, {column})" {filename}',
  terminal: true
};

var detect = require('../detect').platformSupport(['darwin', 'linux'], settings.executable);
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
