var jetbrains = require('./common/jetbrains');

var detect = jetbrains.detect({
  appFolder: 'WebStorm',
  name: 'WebStorm IDE',
  executable: 'webstorm'
});
var open = require('../open').detectAndOpenFactory(detect, jetbrains.settings);

module.exports = {
  settings: jetbrains.settings,
  detect: detect,
  open: open
};
