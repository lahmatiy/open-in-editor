var fs = require('fs');
var path = require('path');
var lazyDetect = require('../../detect').lazy;

var settings = {
  pattern: '{projectPath} --line {line} {filename}'
};

var winDirs = (function() {
  var jetbrainsFolder = 'c:/Program Files (x86)/JetBrains/';

  if (!fs.existsSync(jetbrainsFolder)) {
    return [];
  }

  return fs.readdirSync(jetbrainsFolder)
    .map(function(name) {
      return path.join(jetbrainsFolder, name);
    })
    .filter(function(path) {
      return fs.statSync(path).isDirectory();
    });
})();

module.exports = function(config) {
  var detect = lazyDetect(config.name, [], '', {
    darwin: [
      '/Applications/' + config.appFolder + '.app/Contents/MacOS/' + config.executable
    ],
    win32: winDirs.map(function(dir) {
      return dir + '/bin/' + config.executable + '.exe';
    })
  });
  var open = require('../../open').detectAndOpenFactory(detect, settings);

  return {
    settings: settings,
    detect: detect,
    open: open
  };
};
