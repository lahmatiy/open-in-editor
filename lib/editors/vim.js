var utils = require('../utils');
var detectFor = utils.detectFor;

var runInTerminal = require('../common/terminal').runInTerminal

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: runInTerminal('vim {filename} \\"+call cursor({line}, {column})\\"')
};

var detect = detectFor(['darwin'], 'vim');

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
