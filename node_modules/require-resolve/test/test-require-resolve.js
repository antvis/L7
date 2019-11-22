'use strict';


/*
  ASSERT:
    ok(value, [message]) - Tests if value is a true value.
    equal(actual, expected, [message]) - Tests shallow, coercive equality with the equal comparison operator ( == ).
    notEqual(actual, expected, [message]) - Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
    deepEqual(actual, expected, [message]) - Tests for deep equality.
    notDeepEqual(actual, expected, [message]) - Tests for any deep inequality.
    strictEqual(actual, expected, [message]) - Tests strict equality, as determined by the strict equality operator ( === )
    notStrictEqual(actual, expected, [message]) - Tests strict non-equality, as determined by the strict not equal operator ( !== )
    throws(block, [error], [message]) - Expects block to throw an error.
    doesNotThrow(block, [error], [message]) - Expects block not to throw an error.
    ifError(value) - Tests if value is not a false value, throws if it is a true value. Useful when testing the first argument, error in callbacks.

  SHOULD.JS:
    http://shouldjs.github.io/
*/

var requireResolve = require('../');
var path = require('x-path');
var assert = require('should');
var file = require('grunt').file;

describe('requireResolve', function () {

  var join = path.join,
    root = join(__dirname, 'temp');

  beforeEach(function() { file.mkdir(root); });
  afterEach(function() { file.delete(root); });

  function genPkgFile(f, obj) {
    obj = obj || {};
    obj.name = obj.name || 'mod';
    f = join(path.dirname(f), 'package.json');
    return file.write(f, JSON.stringify(obj));
  }

  it('should resolve a absolute path', function() {
    var f = join(root, 'index.js');
    file.write(f, '');
    requireResolve(root + '/index.js', '').src.should.be.equal(f);
    requireResolve(root + '/index', '').src.should.be.equal(f);
    requireResolve(root + '/', '').src.should.be.equal(f);
    requireResolve(root, '').src.should.be.equal(f);
  });

  it('should resolve a relative path', function() {
    var f1 = join(root, 'f1.js'),
      f2 = join(root, 'lib', 'index.json');
    file.write(f2, '');
    requireResolve('./lib/index.json', f1).src.should.be.equal(f2);
    requireResolve('./lib/index', f1).src.should.be.equal(f2);
    requireResolve('./lib/', f1).src.should.be.equal(f2);
    requireResolve('./lib', f1).src.should.be.equal(f2);
  });

  it('should resolve a module path', function() {
    var f1 = join(root, 'f1.js'),
      f2 = join(root, 'node_modules/mod', 'index.js');
    file.write(f2, '');
    requireResolve('mod/index.js', f1).src.should.be.equal(f2);
    requireResolve('mod/index', f1).src.should.be.equal(f2);
    requireResolve('mod/', f1).src.should.be.equal(f2);
    requireResolve('mod', f1).src.should.be.equal(f2);
  });

  it('should return null when path can not resolved', function() {
    var f = join(root, 'f1.js'),
      absF = join(root, 'lib/absF.js'),
      relativePath = './lib/absF.js',
      modF = join(root, 'node_modules/mod', 'modF.js'),
      modF2 = join(root, 'node_modules/mod2/lib', 'index.js');

    assert.equal(requireResolve(absF, f), null);
    assert.equal(requireResolve(relativePath, f), null);
    assert.equal(requireResolve(modF, f), null);
    assert.equal(requireResolve('mod2', f), null);
    assert.equal(requireResolve('mod2/lib', f), null);

    file.write(absF, '');
    file.write(modF, '');

    assert.notEqual(requireResolve(absF, f), null);
    assert.notEqual(requireResolve(relativePath, f), null);
    assert.notEqual(requireResolve(modF, f), null);
  });

  it('should resolve sub module\'s directory files', function() {
    var modF = join(root, 'node_modules/mod/lib/index.js'),
      f = join(root, 'f1.js');

    file.write(modF, '');

    requireResolve('mod/lib/index.js', f).src.should.be.equal(modF);
    requireResolve('mod/lib/index', f).src.should.be.equal(modF);
    requireResolve('mod/lib/', f).src.should.be.equal(modF);
    requireResolve('mod/lib', f).src.should.be.equal(modF);
  });


  describe('parse package.json', function() {
    var f, absF, relativePath, modF;
    beforeEach(function() {
      f = join(root, 'f1.js');
      absF = join(root, 'lib/absF.js');
      relativePath = './lib/absF.js';
      modF = join(root, 'node_modules/mod', 'modF.js');
      file.write(absF, '');
      file.write(modF, '');
    });

    it('should resolve directory according package.json main attribute', function() {
      genPkgFile(absF, {main: 'absF', version: 1});
      requireResolve('./lib', f).should.containDeep({src: absF, pkg: {version: 1}});
    });

    it('should cached last version', function() {
      // because of cache, so the package.json change but the resolved version don't change
      // on the other hand, node also will cache required file
      genPkgFile(absF, {main: 'absF', version: 2});
      requireResolve('./lib', f).should.containDeep({src: absF, pkg: {version: 1}});
      requireResolve('./lib/absF.js', f).should.containDeep({src: absF, pkg: {version: 1}});
    });

    it('should invalid if package.json doesn\'t specify version attribute', function() {
      var ff = join(root, 'ff/ff.js');
      genPkgFile(ff, {main: 'ff.js'});
      file.write(ff, '');
      assert.equal(null, requireResolve('./ff/', f));
      assert.equal(null, requireResolve('./ff', f));
      assert.equal(null, requireResolve(root + '/ff/', f));
      assert.equal(null, requireResolve(root + '/ff', f));

      assert.notEqual(null, requireResolve('./ff/ff', f));
    });

    it('should resolved when main is directory', function() {
      genPkgFile(modF, {main: './', version: 1});
      var ff = join(path.dirname(modF), '/index.js');
      file.write(ff, '');
      requireResolve('mod/', f).src.should.equal(ff);
    });
  });

});
