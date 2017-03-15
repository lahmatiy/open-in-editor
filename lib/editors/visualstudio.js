var path = require('path');
var helperPath = path.resolve(__dirname, 'visualstudio.vbs');

var settings = {
  pattern: '{filename} {line} {column}'
};

var detect = function() {
  if (process.platform === 'win32') {
    return Promise.resolve(helperPath);
  }

  return Promise.reject('"Open in Visual Studio" does not implemented for your platform (' + process.platform + ')')
};

var open = require('../open').detectAndOpenFactory(detect, settings);

module.exports = {
  settings: settings,
  detect: detect,
  open: open
};
