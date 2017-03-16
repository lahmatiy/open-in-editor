'use strict';

var utils = require('../utils');
var detectFor = utils.detectFor;

var runInTerminal = require('../common/terminal').runInTerminal

var settings = {
  patternOnly: true,
  escapeQuotes: true,
  pattern: runInTerminal('emacs --no-splash \\"+{line}:{column}\\" {filename} ')
};

var detect = detectFor(['darwin'], 'emacs');
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
