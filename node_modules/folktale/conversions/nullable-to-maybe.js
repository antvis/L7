'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var _require = require('../maybe/maybe'),
    Nothing = _require.Nothing,
    Just = _require.Just;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall a:
 *     (a or None) => Maybe a
 */


var nullableToMaybe = function nullableToMaybe(a) {
  return a != null ? Just(a) : /*else*/Nothing();
};

module.exports = nullableToMaybe;