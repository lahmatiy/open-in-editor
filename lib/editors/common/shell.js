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
 *    shell('ls')
 *    shell('ls', '-l')
 *    shell.parse('sh -c')
 *    shell.parse('sh -c').concat(shell.parse('ls -l'))
 *
 * It also supports an argument parameters. It could be useful if it's needed to use some
 * variables in the command and be ensured what the escaping is correctly applied to them values.
 *
 * Example:
 *    shell.parse('ls -l {dir}').withParams({dir: '/root'})
 *    shell.parse('sh -c', shell.parse('ls -l {dir}')).withParams({dir: '/root'})
 *
 * Arguments are variable number of strings or shell objects
 */
function shell() {
  return new ShellCommand(Array.prototype.slice.call(arguments));
}

function parse() {
  return new ShellCommand(ShellCommand.parse(Array.prototype.slice.call(arguments)));
}

shell.parse = parse;

function replaceParams(params, value) {
  return value.replace ? value.replace(/\{([^}]+)\}/g, function(whole, name) {
    return params[name] ? params[name] : whole;
  }) : value;
}

function ShellCommand(args) {
  this.args = Array.isArray(args) ? args : [];
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
  return shellEscape(args.map(String));
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
  command.args = command.args.concat(args.reduce(function(result, value) {
    return result.concat(ShellCommand.isShellCommand(value) ? value.args : [value]);
  }, []));
  command.params = assign.apply(null, [command.params].concat(args.map(function(value) {
    return ShellCommand.isShellCommand(value) ? value.params : {};
  })));

  return command;
};

ShellCommand.prototype.toString = function toString() {
  return ShellCommand.quote(this.args.map(function(value) {
    return ShellCommand.isShellCommand(value) ? String(value.withParams(this.params)) : replaceParams(this.params, value);
  }, this));
};

ShellCommand.prototype.withParams = function withParams(params) {
  var command = this.clone();
  assign(command.params, params);
  return command;
};

module.exports = shell;
