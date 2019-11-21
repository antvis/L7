# require-resolve 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Code Climate][climate-image]][climate-url] [![Coverage Status][coveralls-image]][coveralls-url]

Use the node way to resolve required path to absolute path.

[The node way](https://nodejs.org/api/modules.html#modules_file_modules)

## Install

```bash
$ npm install --save require-resolve
```


## Usage

```javascript
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
```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).


## License

Copyright (c) 2015 Zhonglei Qiu. Licensed under the MIT license.


[climate-url]: https://codeclimate.com/github/qiu8310/require-resolve
[climate-image]: https://codeclimate.com/github/qiu8310/require-resolve/badges/gpa.svg
[npm-url]: https://npmjs.org/package/require-resolve
[npm-image]: https://badge.fury.io/js/require-resolve.svg
[travis-url]: https://travis-ci.org/qiu8310/require-resolve
[travis-image]: https://travis-ci.org/qiu8310/require-resolve.svg?branch=master
[daviddm-url]: https://david-dm.org/qiu8310/require-resolve.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/qiu8310/require-resolve
[coveralls-url]: https://coveralls.io/r/qiu8310/require-resolve
[coveralls-image]: https://coveralls.io/repos/qiu8310/require-resolve/badge.png
