var jetbrains = require('./common/jetbrains');

var detect = jetbrains.detect({
  appFolder: 'IntelliJ IDEA 14 CE',
  name: 'IDEA 14 CE',
  executable: 'idea'
});
var open = require('../open').detectAndOpenFactory(detect, jetbrains.settings);

module.exports = {
  settings: jetbrains.settings,
  detect: detect,
  open: open
};
