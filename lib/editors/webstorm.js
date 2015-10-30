var ide = require('./jetbrains-ide');

var detect = ide.detect({
  appFolder: 'WebStorm',
  name: 'WebStorm IDE',
  executable: 'webstorm'
});
var open = require('../open').detectAndOpenFactory(detect, ide.settings);

module.exports = {
  settings: ide.settings,
  detect: detect,
  open: open
};
