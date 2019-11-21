'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var _require = require('../result/result'),
    Error = _require.Error,
    Ok = _require.Ok;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Maybe a, b) => Result b a
 */


var maybeToResult = function maybeToResult(aMaybe, failureValue) {
  return aMaybe.matchWith({
    Nothing: function Nothing() {
      return Error(failureValue);
    },
    Just: function Just(_ref) {
      var value = _ref.value;
      return Ok(value);
    }
  });
};

module.exports = maybeToResult;