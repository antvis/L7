/*
 * require-resolve
 * https://github.com/qiu8310/require-resolve"
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

'use strict';

var requireResolve = require('../'),
  path = require('path');

// Resolve a absolute file
console.log(requireResolve(__filename));

// Resolve a relative file
console.log(requireResolve('./example/simple.js', path.dirname(path.dirname(__filename))));


// output:
/*
{
  src: '/Users/{your_name}/Workspace/require-resolve/example/simple.js',
  pkg: {
    name: 'require-resolve',
    version: '0.0.1',
    main: 'src/require-resolve.js',
    root: '/Users/{your_name}/Workspace/require-resolve'
  }
}
*/


// Resolve a node module file
console.log(requireResolve('glup', __filename));
console.log(requireResolve('glup/taskTree', __filename));

