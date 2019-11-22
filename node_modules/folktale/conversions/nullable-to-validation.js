'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var _require = require('../validation/validation'),
    Success = _require.Success,
    Failure = _require.Failure;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (a or None, b) => Validation b a
 */


var nullableToValidation = function nullableToValidation(a, fallbackValue) {
  return a != null ? Success(a) : /*else*/Failure(fallbackValue);
};

module.exports = nullableToValidation;