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
 * name: module folktale/fantasy-land/infix
 */
module.exports = {
  apply: require('./apply').infix,
  bimap: require('./bimap').infix,
  chain: require('./chain').infix,
  concat: require('./concat').infix,
  empty: require('./empty').infix,
  equals: require('./equals').infix,
  map: require('./map').infix,
  of: require('./of').infix
};