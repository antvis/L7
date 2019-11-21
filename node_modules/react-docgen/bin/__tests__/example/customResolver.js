/*
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Dummy resolver that always returns the same AST node
 */

const code = `
  ({
    displayName: 'Custom',
  })
`;

module.exports = function(ast, recast) {
  return new recast.types.NodePath(recast.parse(code)).get(
    'program',
    'body',
    0,
    'expression'
  );
};
