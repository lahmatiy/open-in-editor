var chai = require('chai');
var expect = chai.expect;

var shell = require('../lib/editors/common/shell');

describe('shell command', function () {
  it('should take zero argument', function () {
    expect(shell() + '')
      .to.equal('');
  });

  it('should take single argument', function () {
    expect(shell('sh') + '')
      .to.equal('sh');
  });

  it('should take many arguments', function () {
    expect(shell('sh -c') + '')
      .to.equal('sh -c');
  });

  it('should take nested shell', function () {
    expect(shell('sh -c', shell('bash')) + '')
      .to.equal('sh -c bash');
  });

  it('should take nested shell with many arguments', function () {
    expect(shell('sh -c', shell('echo foo')) + '')
      .to.equal(`sh -c 'echo foo'`);
  });

  it('should take nested shell with arbitrary levels', function () {
    expect(shell('sh -c', shell('sh -c', shell('echo foo'))) + '')
      .to.equal(`sh -c 'sh -c '\\''echo foo'\\'`);
  });

  it('should substitute single param', function () {
    expect(shell('sh -c {path}').withParams({ path: 'foo' }) + '')
      .to.equal('sh -c foo');
  });

  it('should substitute param inside the argument', function () {
    expect(shell('sh -c {path}:1').withParams({ path: 'foo', line: 1 }) + '')
      .to.equal(`sh -c foo:1`);
  });

  it('should substitute param having some spaces in value', function () {
    expect(shell('sh -c {path}:1').withParams({ path: 'foo bar', line: 1 }) + '')
      .to.equal(`sh -c 'foo bar:1'`);
  });

  it('should propagate params to nested shells', function () {
    expect(shell('sh -c', shell('{path}')).withParams({ path: 'foo' }) + '')
      .to.equal('sh -c foo');
  });

  it('should propagete params having some spaces in value to nested shells', function () {
    expect(shell('sh -c', shell('echo {path}')).withParams({ path: 'foo bar' }) + '')
      .to.equal(`sh -c 'echo '\\''foo bar'\\'`);
  });

  it('should keep unparsed params', function () {
    expect(shell('cd {projectDir}') + '')
      .to.equal(`cd {projectDir}`);
  });

  it('should keep multiple unparsed params', function () {
    expect(shell('cd {projectDir} {line}') + '')
      .to.equal(`cd {projectDir} {line}`);
  });

  it('should append agruments', function () {
    expect(shell('sh').concat('-c -d') + '')
      .to.equal(`sh -c -d`);
  });

  it('should concat shell', function () {
    expect(shell('sh').concat(shell('-c -d')) + '')
      .to.equal(`sh -c -d`);
  });

  it('should concat shell with params', function () {
    expect(shell('sh').concat(shell('{foo}').withParams({foo: 'bar'})) + '')
      .to.equal(`sh bar`);
  });
});
