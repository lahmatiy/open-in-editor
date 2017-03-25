var shellQuote = require('shell-quote');
var shellEscape = require('command-join');
var assign = require('../../utils').assign;

/**
 * Build a shell command from arguments.
 *
 * It correctly escapes the arguments when it's converted to a string.
 *
 * Example:
 *
 *    shell('vim', 'the code.txt').toString() -> "vim 'the code.txt'"
 *
 * API:
 *
 *    shell('ls -l')
 *    shell('ls', '-l')
 *    shell('sh -c', shell('ls -l'))
 *
 * It also supports an argument parameters. It could be useful if it's needed to use some
 * variables in the command and be ensured what the escaping is correctly applied to them values.
 *
 * Example:
 *    shell('ls -l {dir}').withParams({dir: '/root'})
 *    shell('sh -c', shell('ls -l {dir}')).withParams({dir: '/root'})
 *
 * Arguments are variable number of strings or shell objects
 */
function shell(...args) {
  return new ShellCommand(args);
}

function ShellCommand(args) {
  this._args = ShellCommand.parse(args);
  this._params = {};
}

ShellCommand.isShellCommand = function isShellCommand(value) {
  return value.constructor === ShellCommand;
};

ShellCommand.createEmpty = function createEmpty() {
  return new ShellCommand([]);
};

ShellCommand.parse = function parse(args) {
  var parseArg = function parse(value) {
    return ShellCommand.isShellCommand(value) ? value : shellQuote.parse('' + value);
  };
  return Array.prototype.concat(...(args.map(parseArg)));
};

ShellCommand.quote = function quote(args) {
  return shellEscape(args.map(function(arg) {
    return arg && arg.op ? arg.op : arg;
  }));
};

ShellCommand.prototype.concat = function concat(...args) {
  return assign(ShellCommand.createEmpty(), this, {
    _args: this._args.concat(ShellCommand.parse(args).reduce(function(dest, src) {
      return dest.concat(ShellCommand.isShellCommand(src) ? src._args : [src]);
    }, [])),
    _params: assign.apply(null, [{}, this._params].concat(args.map(function(arg) {
      return ShellCommand.isShellCommand(arg) ? arg._params : {};
    })))
  });
};

ShellCommand.prototype.toString = function toString() {
  return ShellCommand.quote(this._args.map(this._quoteArgs.bind(this)));
};

ShellCommand.prototype.withParams = function withParams(params) {
  return assign(ShellCommand.createEmpty(), this, {
    _params: assign({}, this._params, params)
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
