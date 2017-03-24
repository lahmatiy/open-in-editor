var chai = require('chai');
var expect = chai.expect;

chai.use(require('dirty-chai'));

var makeCommand = require('../lib/open').makeCommand;

describe('makeCommand', function () {
  it('should exits', function () {
    expect(makeCommand).to.be.ok();
  });

  it('should return cmd', function () {
    var res = makeCommand('vim', 'test.txt:1:1');
    expect(res.cmd).to.be.ok();
  });

  it('should return cwd', function () {
    var res = makeCommand('vim', 'test.txt:1:1');
    expect(res.cwd).to.be.ok();
  });

  it('should create editor command', function () {
    var res = makeCommand('editor', 'test.txt:1:1');
    expect(res.cmd).to.be.equal('editor test.txt:2:2');
  });

  it('should support `projectPath` option', function () {
    var res = makeCommand('editor', 'test.txt:1:1', { projectPath: '/root' });
    expect(res.cwd).to.be.equal('/root');
  });

  it('should support `terminal` option for linux', function () {
    var res = makeCommand('editor', 'test.txt:1:1', { terminal: true, platform: 'linux' });
    expect(res.cmd).to.be.match(/gnome-terminal/);
  });

  it('should support `terminal` option for darwin', function () {
    var res = makeCommand('editor', 'test.txt:1:1', { terminal: true, platform: 'darwin' });
    expect(res.cmd).to.be.match(/osascript/);
  });
});
