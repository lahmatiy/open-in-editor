'use strict';

var utils = require('../utils');
var terminal = utils.terminal;
var detectFor = utils.detectFor;

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: terminal('emacs --no-splash \\"+{line}:{column}\\" {filename} ')
};

var detect = detectFor(['darwin'], 'emacs');
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
