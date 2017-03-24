var settings = {
  cmd: 'vim',
  // FIXME: check for vim supports the +clientserver option
  pattern: '--servername VIM --remote-tab-silent "+call cursor({line}, {column})" {filename}',
  terminal: true
};

var detect = require('../detect').platformSupport(['darwin', 'linux'], 'vim');
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
