var settings = {
  pattern: '{projectPath} --line {line} {filename}'
};

var fs = require('fs');
var path = require('path');

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

var detect = function(ide) {
  return require('../detect').lazy(ide.name, [], '', {
    darwin: [
      '/Applications/' + ide.appFolder + '.app/Contents/MacOS/' + ide.executable
    ],
    win32: winDirs.map(function(dir){
      return dir + '/bin/' + ide.executable + '.exe';
    })
  });
};

module.exports = {
  settings: settings,
  detect: detect
};
