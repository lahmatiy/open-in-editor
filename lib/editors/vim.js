var runInTerminal = require('./common/terminal');

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: runInTerminal('vim {filename} \\"+call cursor({line}, {column})\\"')
};

var detect = require('../detect').platformSupport(['darwin'], 'vim');
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
