'use strict';

var utils = require('../utils');
var checkPlatformSupport = utils.checkPlatformSupport;

var runInTerminal = require('../common/terminal');

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: runInTerminal('emacs --no-splash \\"+{line}:{column}\\" {filename} ')
};

var detect = checkPlatformSupport(['darwin'], 'emacs');
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
