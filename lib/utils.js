module.exports = {
  number: function(value, fallback) {
    return isNaN(value) ? fallback : value;
  },
  quote: function(value) {
    value = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\"');

    return '"' + value + '"';
  },
  extractFilename: function(filename) {
    var parts = filename.match(/^(.+?)((?::\d+){0,4})$/);
    var segment = parts[2].split(':').slice(1);

    return {
      filename: parts[1],
      line: parseInt(segment[0] || 0, 10),
      column: parseInt(segment[1] || 0, 10)
    }
  },
  fail: function(msg) {
    console.error(msg);
    process.exit(2);
  }
};
