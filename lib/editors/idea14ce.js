var ide = require('./jetbrains-ide');

var detect = ide.detect({
  appFolder: 'IntelliJ IDEA 14 CE',
  name: 'IDEA 14 CE',
  executable: 'idea'
});
var open = require('../open').detectAndOpenFactory(detect, ide.settings);

module.exports = {
  settings: ide.settings,
  detect: detect,
  open: open
};
