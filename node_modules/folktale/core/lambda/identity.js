"use strict";

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   ('a) => 'a
 */
var identity = function identity(value) {
  return value;
};

// --[ Exports ]-------------------------------------------------------
module.exports = identity;