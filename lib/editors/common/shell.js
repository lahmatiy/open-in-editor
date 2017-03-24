var shellQuote = require('shell-quote');
var shellEscape = require('command-join');
var assign = require('../../utils').assign;

function shell(...args) {
  return new ShellCommand(args);
}

function ShellCommand(args) {
  this._args = ShellCommand.parseArgs(args);
  this._params = {};
}

ShellCommand.isShellCommand = function isShellCommand(value) {
  return value.constructor === ShellCommand;
};

ShellCommand.parse = function parse(value) {
  return ShellCommand.isShellCommand(value) ? value : shellQuote.parse('' + value);
};

ShellCommand.parseArgs = function parseArgs(args) {
  return Array.prototype.concat(...(args.map(ShellCommand.parse)));
};

ShellCommand.quote = function quote(args) {
  return shellEscape(args.map(function(arg) {
    return arg && arg.op ? arg.op : arg;
  }));
};

ShellCommand.prototype.toString = function toString() {
  return ShellCommand.quote(this._args.map(this._quoteArgs.bind(this)));
};

ShellCommand.prototype.withParams = function withParams(params) {
  return assign(shell([]), this, {
    _params: assign({}, this._params, params)
  });
};

ShellCommand.prototype.concat = function concat(...args) {
  return assign(shell([]), this, {
    _args: this._args.concat(ShellCommand.parseArgs(args).reduce(function(dest, src) {
      return dest.concat(ShellCommand.isShellCommand(src) ? src._args : [src]);
    }, [])),
    _params: assign.apply(null, [{}, this._params].concat(args.map(function(arg) {
      return ShellCommand.isShellCommand(arg) ? arg._params : {};
    })))
  });
};

ShellCommand.prototype._quoteArgs = function _quoteArgs(value) {
  return ShellCommand.isShellCommand(value) ? value.withParams(this._params).toString() : this._replaceParams(value);
};

ShellCommand.prototype._replaceParams = function _replaceParams(value) {
  return value.replace ? value.replace(/\{([^}]+)\}/g, function(whole, name) {
    return this._params[name] ? this._params[name] : whole;
  }.bind(this)) : value;
};

module.exports = shell;
