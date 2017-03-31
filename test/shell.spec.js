var assert = require('assert');
var shell = require('../lib/editors/common/shell');

describe('shell command', function () {
  it('should take zero argument', function () {
    var res = shell();
    assert.equal(res, '');
  });

  it('should take single argument', function () {
    var res = shell('sh');
    assert.equal(res, 'sh');
  });

  it('should take many arguments', function () {
    var res = shell('sh -c');
    assert.equal(res, 'sh -c');
  });

  it('should take nested shell', function () {
    var res = shell('sh -c', shell('bash'));
    assert.equal(res, 'sh -c bash');
  });

  it('should take nested shell with many arguments', function () {
    var res = shell('sh -c', shell('echo foo'));
    assert.equal(res, "sh -c 'echo foo'");
  });

  it('should take nested shell with arbitrary levels', function () {
    var res = shell('sh -c', shell('sh -c', shell('echo foo')));
    assert.equal(res, "sh -c 'sh -c '\\''echo foo'\\'");
  });

  it('should substitute single param', function () {
    var res = shell('sh -c {path}').withParams({
      path: 'foo'
    });
    assert.equal(res, 'sh -c foo');
  });

  it('should substitute param inside the argument', function () {
    var res = shell('sh -c {path}:1').withParams({
      path: 'foo',
      line: 1
    });
    assert.equal(res, 'sh -c foo:1');
  });

  it('should substitute param having some spaces in value', function () {
    var res = shell('sh -c {path}:1').withParams({
      path: 'foo bar',
      line: 1
    });
    assert.equal(res, "sh -c 'foo bar:1'");
  });

  it('should propagate params to nested shells', function () {
    var res = shell('sh -c', shell('{path}')).withParams({
      path: 'foo'
    });
    assert.equal(res, 'sh -c foo');
  });

  it('should propagete params having some spaces in value to nested shells', function () {
    var res = shell('sh -c', shell('echo {path}')).withParams({
      path: 'foo bar'
    });
    assert.equal(res, "sh -c 'echo '\\''foo bar'\\'");
  });

  it('should keep unparsed params', function () {
    var res = shell('cd {projectDir}');
    assert.equal(res, 'cd {projectDir}');
  });

  it('should keep multiple unparsed params', function () {
    var res = shell('cd {projectDir} {line}');
    assert.equal(res, 'cd {projectDir} {line}');
  });

  it('should append agruments', function () {
    var res = shell('sh').concat('-c -d');
    assert.equal(res, 'sh -c -d');
  });

  it('should concat shell', function () {
    var res = shell('sh').concat(shell('-c -d'));
    assert.equal(res, 'sh -c -d');
  });

  it('should concat shell with params', function () {
    var res = shell('sh').concat(shell('{foo}').withParams({
      foo: 'bar'
    }));
    assert.equal(res, 'sh bar');
  });
});
