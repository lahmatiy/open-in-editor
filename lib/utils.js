var osHomeDir = require('os-homedir')();
var path = require('path');

module.exports = {
  number: function(value, fallback) {
    return isNaN(value) ? fallback : value;
  },
  quote: function(value, escapeQuotes) {
    value = String(value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\"');

    return escapeQuotes ?
      '\\"' + value + '\\"' :
      '"' + value + '"';
  },
  extractFilename: function(filename) {
    var parts = filename.match(/^(.+?)((?::\d+){0,4})$/);
    var segment = parts[2].split(':').slice(1);

    return {
      filename: parts[1],
      line: parseInt(segment[0] || 0, 10),
      column: parseInt(segment[1] || 0, 10)
    };
  },
  fail: function(msg) {
    console.error(String(msg).trimRight());
    process.exit(2);
  },
  atHomeDir: function(filename) {
    return path.join(osHomeDir, filename);
  },
  any: function(promises, err) {
    return new Promise(function(resolve, reject) {
      Promise.all(promises.map(function(item) {
        if (item && typeof item.then == 'function') {
          return item.then(
            resolve,    // any success resolves the main promise immediately
            function() { /* ignore any reject */ }
          );
        }

        return item;
      })).then(function(results) {
        reject(err);
      }, reject);
    });
  },
  append: function(str, appendix) {
    return String(str).replace(/\s*$/, (str ? ' ' : '') + appendix);
  },
  assign: function(dest, src) {
    for (var key in src) {
      if (Object.prototype.hasOwnProperty.call(src, key)) {
        dest[key] = src[key];
      }
    }

    return dest;
  }
};
