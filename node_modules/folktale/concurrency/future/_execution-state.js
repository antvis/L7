'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
var _require = require('../../adt/union'),
    union = _require.union,
    derivations = _require.derivations;

var equality = derivations.equality,
    debugRepresentation = derivations.debugRepresentation;

// --[ Implementation ]------------------------------------------------

/*~ stability: experimental */

var ExecutionState = union('folktale:ExecutionState', {
  /*~
   */
  Pending: function Pending() {
    return {};
  },


  /*~
   */
  Cancelled: function Cancelled() {
    return {};
  },


  /*~
   */
  Resolved: function Resolved(value) {
    return { value: value };
  },


  /*~
   */
  Rejected: function Rejected(reason) {
    return { reason: reason };
  }
}).derive(equality, debugRepresentation);

// --[ Exports ]-------------------------------------------------------
module.exports = ExecutionState;