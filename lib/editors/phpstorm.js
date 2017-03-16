var jetbrains = require('./common/jetbrains');

var detect = jetbrains.detect({
  appFolder: 'PhpStorm',
  name: 'PhpStorm IDE',
  executable: 'phpstorm'
});
var open = require('../open').detectAndOpenFactory(detect, jetbrains.settings);

module.exports = {
  settings: jetbrains.settings,
  detect: detect,
  open: open
};
