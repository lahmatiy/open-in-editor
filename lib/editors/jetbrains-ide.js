var settings = {
  pattern: '{filename} --line {line}'
};

var detect = function(ide) {
  return require('../detect').lazy(ide.name, [], '', {
    darwin: [
      '/Applications/' + ide.appFolder + '.app/Contents/MacOS/' + ide.executable
    ]
    // TODO win
  });
};

module.exports = {
  settings: settings,
  detect: detect
};
