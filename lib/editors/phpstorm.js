var ide = require('./jetbrains-ide');

var detect = ide.detect({
  appFolder: 'PhpStorm',
  name: 'PhpStorm IDE',
  executable: 'phpstorm'
});
var open = require('../open').detectAndOpenFactory(detect, ide.settings);

module.exports = {
  settings: ide.settings,
  detect: detect,
  open: open
};
