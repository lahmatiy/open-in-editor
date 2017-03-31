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
function shell() {
  return new ShellCommand(Array.prototype.slice.call(arguments));
}

function replaceParams(params, value) {
  return value.replace ? value.replace(/\{([^}]+)\}/g, function(whole, name) {
    return params[name] ? params[name] : whole;
  }) : value;
}

function ShellCommand(args) {
  this.args = Array.isArray(args) ? ShellCommand.parse(args) : [];
  this.params = {};
}

ShellCommand.isShellCommand = function isShellCommand(value) {
  return value.constructor === ShellCommand;
};

ShellCommand.parse = function parse(args) {
  return args.reduce(function(result, value) {
    return result.concat(ShellCommand.isShellCommand(value) ? value : shellQuote.parse(String(value)));
  }, []);
};

ShellCommand.quote = function quote(args) {
  return shellEscape(args);
};

ShellCommand.prototype.clone = function clone() {
  var command = new ShellCommand();
  command.args = this.args.slice();
  command.params = assign({}, this.params);
  return command;
};

ShellCommand.prototype.concat = function concat() {
  var args = Array.prototype.slice.call(arguments);
  var command = this.clone();
  command.args = command.args.concat(ShellCommand.parse(args).reduce(function(result, value) {
    return result.concat(ShellCommand.isShellCommand(value) ? value.args : [value]);
  }, []));
  command.params = assign.apply(null, [command.params].concat(args.map(function(value) {
    return ShellCommand.isShellCommand(value) ? value.params : {};
  })));
  return command;
};

ShellCommand.prototype.toString = function toString() {
  return ShellCommand.quote(this.args.map(function(value) {
    return ShellCommand.isShellCommand(value) ? value.withParams(this.params).toString() : replaceParams(this.params, value);
  }, this));
};

ShellCommand.prototype.withParams = function withParams(params) {
  return assign(new ShellCommand(), this, {
    params: assign({}, this.params, params)
  });
};

module.exports = shell;
