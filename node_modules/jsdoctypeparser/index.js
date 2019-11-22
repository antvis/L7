'use strict';


var parsing = require('./lib/parsing.js');
var publishing = require('./lib/publishing.js');
var traversing = require('./lib/traversing.js');
var NodeType = require('./lib/NodeType.js');
var SyntaxType = require('./lib/SyntaxType.js');


/**
 * Namespace for jsdoctypeparser.
 * @namespace
 * @exports jsdoctypeparser
 */
module.exports = {
  parse: parsing.parse,
  SyntaxError: parsing.SyntaxError,
  publish: publishing.publish,
  createDefaultPublisher: publishing.createDefaultPublisher,
  traverse: traversing.traverse,
  NodeType: NodeType,
  SyntaxType: SyntaxType,
};
