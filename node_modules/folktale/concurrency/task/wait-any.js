'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability: experimental
 * type: |
 *   forall v, e: ([Task e v Any]) => Task e v Any
 */
var waitAny = function waitAny(tasks) {
  if (tasks.length === 0) {
    throw new Error('Task.waitAny() requires a non-empty array of tasks.');
  }

  return tasks.reduce(function (a, b) {
    return a.or(b);
  });
};

module.exports = waitAny;