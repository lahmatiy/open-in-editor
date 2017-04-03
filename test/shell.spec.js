var assert = require('assert');
var shell = require('../lib/editors/common/shell');

testSuite('linux');
testSuite('win32');

function testSuite (platform) {
  function assertEqual (actual, expected, message) {
    if (typeof expected !== 'string') {
      expected = expected[platform];
    }
    if (String(actual) != expected) {
      assert.fail(String(actual), expected, message, '==', assertEqual);
    }
  }

  describe('platform ' + platform, function () {
    beforeEach(function () {
      this.originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: platform
      });
    });

    afterEach(function () {
      Object.defineProperty(process, 'platform', {
        value: this.originalPlatform
      });
    });

    describe('shell command', function () {
      it('should take zero argument', function () {
        var res = shell();
        assertEqual(res, '');
      });

      it('should take single argument', function () {
        var res = shell('sh');
        assertEqual(res, 'sh');
      });

      it('should take many arguments', function () {
        var res = shell.parse('sh -c');
        assertEqual(res, 'sh -c');
      });

      it('should take nested shell', function () {
        var res = shell.parse('sh -c', shell('bash'));
        assertEqual(res, 'sh -c bash');
      });

      it('should take nested shell with many arguments', function () {
        var res = shell.parse('sh -c', shell.parse('echo foo'));
        assertEqual(res, {
          linux: "sh -c 'echo foo'",
          win32: 'sh -c "echo foo"'
        });
      });

      it('should take nested shell with arbitrary levels', function () {
        var res = shell.parse('sh -c', shell.parse('sh -c', shell.parse('echo foo')));
        assertEqual(res, {
          linux: "sh -c 'sh -c '\\''echo foo'\\'",
          win32: 'sh -c "sh -c \\"echo foo\\""'
        });
      });

      it('should substitute single param', function () {
        var res = shell.parse('sh -c {path}').withParams({
          path: 'foo'
        });
        assertEqual(res, 'sh -c foo');
      });

      it('should substitute param inside the argument', function () {
        var res = shell.parse('sh -c {path}:1').withParams({
          path: 'foo',
          line: 1
        });
        assertEqual(res, 'sh -c foo:1');
      });

      it('should substitute param having some spaces in value', function () {
        var res = shell.parse('sh -c {path}:1').withParams({
          path: 'foo bar',
          line: 1
        });
        assertEqual(res, {
          linux: "sh -c 'foo bar:1'",
          win32: 'sh -c "foo bar:1"'
        });
      });

      it('should propagate params to nested shells', function () {
        var res = shell.parse('sh -c', shell('{path}')).withParams({
          path: 'foo'
        });
        assertEqual(res, 'sh -c foo');
      });

      it('should propagete params having some spaces in value to nested shells', function () {
        var res = shell.parse('sh -c', shell.parse('echo {path}')).withParams({
          path: 'foo bar'
        });
        assertEqual(res, {
          linux: "sh -c 'echo '\\''foo bar'\\'",
          win32: 'sh -c "echo \\"foo bar\\""'
        });
      });

      it('should keep unparsed params', function () {
        var res = shell.parse('cd {projectDir}');
        assertEqual(res, 'cd {projectDir}');
      });

      it('should keep multiple unparsed params', function () {
        var res = shell.parse('cd {projectDir} {line}');
        assertEqual(res, 'cd {projectDir} {line}');
      });

      it('should append agruments', function () {
        var res = shell('sh').concat(shell.parse('-c -d'));
        assertEqual(res, 'sh -c -d');
      });

      it('should concat shell', function () {
        var res = shell('sh').concat(shell.parse('-c -d'));
        assertEqual(res, 'sh -c -d');
      });

      it('should concat shell with params', function () {
        var res = shell('sh').concat(shell('{foo}').withParams({
          foo: 'bar'
        }));
        assertEqual(res, 'sh bar');
      });

      it('should handle path with spaces', function () {
        var res = shell('C:/Program Files (x86)/Microsoft VS Code/bin/code.cmd');
        assertEqual(res, {
          linux: "'C:/Program Files (x86)/Microsoft VS Code/bin/code.cmd'",
          win32: '"C:/Program Files (x86)/Microsoft VS Code/bin/code.cmd"'
        });
      });
    });
  });
}
