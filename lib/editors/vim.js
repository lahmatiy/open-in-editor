var runInTerminal = require('./common/terminal');

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: runInTerminal('vim --servername VIM --remote-tab-silent \\"+call cursor({line}, {column})\\" {filename}')
};

var detect = require('../detect').platformSupport(['darwin', 'linux'], 'vim');
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
