var path = require('path');
var helperPath = path.resolve(__dirname, 'visualstudio.vbs');

var settings = {
  pattern: '{filename} {line} {column}'
};

var detect = require('../detect').platformSupport(['win32'], 'Visual Studio', helperPath);
var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
