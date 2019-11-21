'use strict';


var expect = require('chai').expect;
var parse = require('../lib/parsing.js').parse;
var Publishing = require('../lib/publishing.js');
var publish = Publishing.publish;
var createDefaultPublisher = Publishing.createDefaultPublisher;


describe('publish', function() {
  it('should return a primitive type name', function() {
    var node = parse('boolean');
    expect(publish(node)).to.equal('boolean');
  });


  it('should return a global type name', function() {
    var node = parse('Window');
    expect(publish(node)).to.equal('Window');
  });


  it('should return an user-defined type name', function() {
    var node = parse('goog.ui.Menu');
    expect(publish(node)).to.equal('goog.ui.Menu');
  });


  it('should return a generic type has a parameter', function() {
    var node = parse('Array.<string>');
    expect(publish(node)).to.equal('Array<string>');
  });


  it('should return a generic type has 2 parameters', function() {
    var node = parse('Object.<string, number>');
    expect(publish(node)).to.equal('Object<string, number>');
  });


  it('should return a JsDoc-formal generic type', function() {
    var node = parse('String[]');
    expect(publish(node)).to.equal('Array<String>');
  });


  it('should return a formal type union', function() {
    var node = parse('(number|boolean)');
    expect(publish(node)).to.equal('(number|boolean)');
  });


  it('should return a informal type union', function() {
    var node = parse('number|boolean');
    expect(publish(node)).to.equal('number|boolean');
  });

  it('should return a type query node', function() {
    var node = parse('typeof x');
    expect(publish(node)).to.equal('typeof x');
  });

  it('should return an import type node', function() {
    var node = parse('import("./lodash4ever")');
    expect(publish(node)).to.equal('import("./lodash4ever")');
  });

  it('should return a record type with an entry', function() {
    var node = parse('{myNum}');
    expect(publish(node)).to.equal('{myNum}');
  });


  it('should return a record type with 2 entries', function() {
    var node = parse('{myNum: number, myObject}');
    expect(publish(node)).to.equal('{myNum: number, myObject}');
  });


  it('should return a generic type has a parameter as a record type', function() {
    var node = parse('Array<{length}>');
    expect(publish(node)).to.equal('Array<{length}>');
  });


  it('should return a nullable type has a nullable type operator on the head', function() {
    var node = parse('?number');
    expect(publish(node)).to.equal('?number');
  });


  it('should return a nullable type has a nullable type operator on the tail', function() {
    var node = parse('goog.ui.Component?');
    expect(publish(node)).to.equal('?goog.ui.Component');
  });


  it('should return a non-nullable type has a nullable type operator on the head', function() {
    var node = parse('!Object');
    expect(publish(node)).to.equal('!Object');
  });


  it('should return a non-nullable type has a nullable type operator on the tail', function() {
    var node = parse('Object!');
    expect(publish(node)).to.equal('!Object');
  });


  it('should return a function type', function() {
    var node = parse('Function');
    expect(publish(node)).to.equal('Function');
  });


  it('should return a function type has no parameters', function() {
    var node = parse('function()');
    expect(publish(node)).to.equal('function()');
  });


  it('should return a function type has a parameter', function() {
    var node = parse('function(string)');
    expect(publish(node)).to.equal('function(string)');
  });


  it('should return a function type has 2 parameters', function() {
    var node = parse('function(string, boolean)');
    expect(publish(node)).to.equal('function(string, boolean)');
  });


  it('should return a function type has a return', function() {
    var node = parse('function(): number');
    expect(publish(node)).to.equal('function(): number');
  });


  it('should return a function type has a context', function() {
    var node = parse('function(this:goog.ui.Menu, string)');
    expect(publish(node)).to.equal('function(this: goog.ui.Menu, string)');
  });


  it('should return a constructor type', function() {
    var node = parse('function(new:goog.ui.Menu, string)');
    expect(publish(node)).to.equal('function(new: goog.ui.Menu, string)');
  });


  it('should return a function type has a variable parameter', function() {
    var node = parse('function(string, ...number): number');
    expect(publish(node)).to.equal('function(string, ...number): number');
  });


  it('should return a function type has parameters have some type operators', function() {
    var node = parse('function(?string=, number=)');
    expect(publish(node)).to.equal('function(?string=, number=)');
  });

  it('should return an arrow type with no parameters', function() {
    var node = parse('() => string');
    expect(publish(node)).to.equal('() => string');
  });

  it('should return an arrow type with two parameters', function() {
    var node = parse('(x: true, y: false) => string');
    expect(publish(node)).to.equal('(x: true, y: false) => string');
  });

  it('should return an arrow type with one parameter', function() {
    var node = parse('(x: true) => string');
    expect(publish(node)).to.equal('(x: true) => string');
  });

  it('should return an arrow type with one variadic parameter', function() {
    var node = parse('(...x: any[]) => string');
    expect(publish(node)).to.equal('(...x: Array<any>) => string');
  });

  it('should return a construct signature with one parameter', function() {
    var node = parse('new (x: true) => string');
    expect(publish(node)).to.equal('new (x: true) => string');
  });

  it('should return a goog.ui.Component#forEachChild', function() {
    var node = parse('function(this:T,?,number):?');
    expect(publish(node)).to.equal('function(this: T, ?, number): ?');
  });


  it('should return a variable type', function() {
    var node = parse('...number');
    expect(publish(node)).to.equal('...number');
  });


  it('should return an optional type has an optional type operator on the head', function() {
    var node = parse('=number');
    expect(publish(node)).to.equal('number=');
  });


  it('should return an optional type has an optional type operator on the tail', function() {
    var node = parse('number=');
    expect(publish(node)).to.equal('number=');
  });


  it('should return an all type', function() {
    var node = parse('*');
    expect(publish(node)).to.equal('*');
  });


  it('should return an unknown type', function() {
    var node = parse('?');
    expect(publish(node)).to.equal('?');
  });


  it('should return an undefined type with an "undefined" keyword', function() {
    var node = parse('undefined');
    expect(publish(node)).to.equal('undefined');
  });


  it('should return a null type with an "null" keyword', function() {
    var node = parse('null');
    expect(publish(node)).to.equal('null');
  });


  it('should return a module type', function() {
    var node = parse('module:foo/bar');
    expect(publish(node)).to.equal('module:foo/bar');
  });

  it('should return a module type with member', function() {
    var node = parse('module:foo/bar#abc');
    expect(publish(node)).to.equal('module:foo/bar#abc');
  });

  it('should return a module type with event member', function() {
    var node = parse('module:foo/bar#event:abc');
    expect(publish(node)).to.equal('module:foo/bar#event:abc');
  });


  it('should return a module type with a prefix nullable type operator', function() {
    var node = parse('?module:foo/bar');
    expect(publish(node)).to.equal('?module:foo/bar');
  });


  it('should return a module type with a postfix nullable type operator', function() {
    var node = parse('module:foo/bar?');
    expect(publish(node)).to.equal('?module:foo/bar');
  });


  it('should return a string value type', function() {
    var node = parse('"stringValue"');
    expect(publish(node)).to.equal('"stringValue"');
  });


  it('should return a number value type', function() {
    var node = parse('0123456789');
    expect(publish(node)).to.equal('0123456789');
  });


  it('should return a bin number value type', function() {
    var node = parse('0b01');
    expect(publish(node)).to.equal('0b01');
  });


  it('should return an oct number value type', function() {
    var node = parse('0o01234567');
    expect(publish(node)).to.equal('0o01234567');
  });


  it('should return a hex number value type', function() {
    var node = parse('0x0123456789abcdef');
    expect(publish(node)).to.equal('0x0123456789abcdef');
  });


  it('should return an external node type', function() {
    var node = parse('external:string');
    expect(publish(node)).to.equal('external:string');
  });


  it('should return a module type with a generic type operator', function() {
    // Because the new generic type syntax was arrived, the old type generic
    // with the module keyword is not equivalent to the legacy behavior.
    //
    // For example, we get 2 parts as 'module:foo/bar.' and '<string>', when
    // the following type expression are arrived.
    //   var node = parse('module:foo/bar.<string>');
    var node = parse('module:foo/bar<string>');
    expect(publish(node)).to.equal('module:foo/bar<string>');
  });


  it('should can take a custom publisher by the 2nd argument', function() {
    var ast = {
      type: 'NAME',
      name: 'MyClass',
    };

    var customPublisher = createDefaultPublisher();
    customPublisher.NAME = function(node) {
      return '<a href="./types/' + node.name + '.html">' + node.name + '</a>';
    };

    var string = publish(ast, customPublisher);
    expect(string).to.equal('<a href="./types/MyClass.html">MyClass</a>');
  });
});
