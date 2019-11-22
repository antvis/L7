'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/* eslint-disable no-magic-numbers, max-statements-per-line */
var defer = typeof setImmediate !== 'undefined' ? function (f) {
            return setImmediate(f);
} : typeof process !== 'undefined' ? function (f) {
            return process.nextTick(f);
} : /* otherwise */function (f) {
            return setTimeout(f, 0);
};
/* eslint-enable no-magic-numbers, max-statements-per-line */

module.exports = defer;