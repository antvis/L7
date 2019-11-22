'use strict';

var util = require('util');
var Parser = require('../lib/parsing.js');
var Fs = require('fs');
var Path = require('path');


var Fixtures = {
  CATHARSIS: readFixtureSync('catharsis-types'),
  CLOSURE_LIBRARY: readFixtureSync('closure-library-types'),
  JSDOC3: readFixtureSync('jsdoc-types'),
  JSDUCK: readFixtureSync('jsduck-types'),
  TYPESCRIPT: readFixtureSync('typescript-types'),
};


describe('Parser', function() {
  it('should not throw any errors when parsing tests/fixtures/*', function() {
    Object.keys(Fixtures).forEach(function(fixtureName) {
      Fixtures[fixtureName].forEach(function(fixture) {
        if (fixture.skip) return;

        try {
          Parser.parse(fixture.typeExprStr);
        }
        catch (e) {
          var debugMessage = util.format('parsing %s at %s:%d\n\n%s',
                                         fixture.typeExprStr,
                                         fixture.position.filePath,
                                         fixture.position.lineno,
                                         e.stack);

          throw new Error(debugMessage);
        }
      });
    });
  });
});


function readFixtureSync(fileName) {
  var filePath = Path.resolve(__dirname, 'fixtures', fileName);

  return Fs.readFileSync(filePath, 'utf8')
    .trim()
    .split(/\n/)
    .map(function(line, lineIdx) {
      return {
        // When the line starts with "//", we should skip it.
        skip: /^\/\//.test(line),

        typeExprStr: line.trim().replace(/^\{(.*)\}$/, '$1'),
        position: {
          filePath: filePath,
          lineno: lineIdx + 1,
        },
      };
    });
}
