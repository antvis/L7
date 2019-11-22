'use strict';

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


var Maybe = require('./maybe');

var _require = require('../adt/union/union'),
    typeSymbol = _require.typeSymbol;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * name: module folktale/maybe
 */


module.exports = (_module$exports = {
  Just: Maybe.Just,
  Nothing: Maybe.Nothing,
  hasInstance: Maybe.hasInstance,
  of: Maybe.of,
  empty: Maybe.empty,
  fromJSON: Maybe.fromJSON
}, _defineProperty(_module$exports, typeSymbol, Maybe[typeSymbol]), _defineProperty(_module$exports, 'fantasy-land/of', Maybe['fantasy-land/of']), _defineProperty(_module$exports, 'fromNullable', function fromNullable(aNullable) {
  return require('../conversions/nullable-to-maybe')(aNullable);
}), _defineProperty(_module$exports, 'fromResult', function fromResult(aResult) {
  return require('../conversions/result-to-maybe')(aResult);
}), _defineProperty(_module$exports, 'fromValidation', function fromValidation(aValidation) {
  return require('../conversions/validation-to-maybe')(aValidation);
}), _module$exports);