'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = function (method, transformation) {
  if (typeof transformation !== 'function') {
    throw new TypeError(method + ' expects a function, but was given ' + transformation + '.');
  }
};