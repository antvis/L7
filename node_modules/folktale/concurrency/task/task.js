'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Task = require('./_task');

var noop = function noop() {};

/*~
 * stability: experimental
 * type: |
 *   forall value, reason:
 *     (
 *       ({
 *          resolve: (value) => Void,
 *          reject: (reason) => Void,
 *          cancel: () => Void,
 *          cleanup: (() => Void) => Void,
 *          onCancelled: (() => Void) => Void,
 *          get isCancelled: Boolean
 *        }) => Void
 *     ) => Task reason value
 */
var task = function task(computation) {
  return new Task(computation);
};

module.exports = task;