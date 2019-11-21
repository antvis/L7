'use strict';

var chai = require('chai');
var expect = chai.expect;
var jsdoctypeparser = require('../index.js');


describe('jsdoctypeparser', function() {
  var expectedTypeMap = {
    parse: 'function',
    SyntaxError: 'function',
    publish: 'function',
    createDefaultPublisher: 'function',
    traverse: 'function',
    NodeType: 'object',
    SyntaxType: 'object',
  };


  Object.keys(expectedTypeMap).forEach(function(key) {
    var expectedType = expectedTypeMap[key];
    describe('.' + key, function() {
      it('should be exported', function() {
        expect(jsdoctypeparser[key]).to.be.a(expectedType);
      });
    });
  });
});
