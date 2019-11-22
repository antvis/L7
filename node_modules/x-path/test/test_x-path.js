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

var path = require('../');
var assert = require('should');

/*
 ### isAbsolutePath
 ### isRelativePath
 ### isRootDirectory
 ### unifyPathSeparate
 ### normalizePathSeparate
 ### isDirectory
 ### isFile
 ### isDirectorySync
 ### isFileSync
 */
describe('xPath', function () {

  var root = process.platform === 'win32' ? 'C:/' : '/',
    sep = require('path').sep;


  it('#isAbsolutePath', function () {
    path.isAbsolutePath(root + 'use').should.equal(true);
    path.isAbsolutePath('use').should.equal(false);
  });

  it('#isRelativePath', function () {
    path.isRelativePath('./use').should.equal(true);
    path.isRelativePath('../use').should.equal(true);
    path.isRelativePath('use').should.equal(false);
  });

  it('#isRootDirectory', function () {
    path.isRootDirectory(root).should.equal(true);
    path.isRootDirectory('use').should.equal(false);
  });

  it('#unifyPathSeparate', function () {
    path.unifyPathSeparate('a/b/c').should.equal('a/b/c'.replace(/\//g, sep));
  });

  it('#normalizePathSeparate', function () {
    path.normalizePathSeparate('a\\b/c').should.equal('a/b/c');
  });

  it('#isDirectory exist', function (done) {
    path.isDirectory(__dirname, done);
  });

  it('#isDirectory not exist', function (done) {
    path.isDirectory(path.join(__dirname, 'a/b/csafj'), done);
  });

  it('#isFile exist', function (done) {
    path.isFile(__filename, done);
  });

  it('#isFile not exist', function (done) {
    path.isFile(path.join(__filename, 'csafj'), done);
  });


  it('#isDirectorySync', function () {
    path.isDirectorySync(__dirname).should.equal(true);
    path.isDirectorySync(path.join(__dirname, 'a/b/csafj')).should.equal(false);
  });

  it('#isFileSync', function () {
    path.isFileSync(__filename).should.equal(true);
    path.isFileSync(path.join(__dirname, 'aadcsafj')).should.equal(false);
  });

});
