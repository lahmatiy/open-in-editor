var utils = require('../utils');
var checkPlatformSupport = utils.checkPlatformSupport;

var runInTerminal = require('../common/terminal');

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: runInTerminal('vim {filename} \\"+call cursor({line}, {column})\\"')
};

var detect = checkPlatformSupport(['darwin'], 'vim');

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
