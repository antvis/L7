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
 * signature: compose(f, g)(value)
 * type: |
 *   (('b) => 'c, ('a) => 'b) => (('a) => 'c)
 */
var compose = function compose(f, g) {
  return function (value) {
    return f(g(value));
  };
};

// --[ Convenience ]---------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (('b) => 'c) . (('a) => 'b) => (('a) => 'c)
 */
compose.infix = function (that) {
  return compose(that, this);
};

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Function...) -> Function
 */
compose.all = function () {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  /* eslint-disable no-magic-numbers */
  if (fns.length < 1) {
    // eslint-disable-next-line prefer-rest-params
    throw new TypeError("compose.all requires at least one argument, " + arguments.length + " given.");
  }
  return fns.reduce(compose);
}; /* eslint-enable no-magic-numbers */

// --[ Exports ]-------------------------------------------------------
module.exports = compose;