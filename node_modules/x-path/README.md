# x-path 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Code Climate][climate-image]][climate-url] [![Coverage Status][coveralls-image]][coveralls-url]

An extention for native node path module.


## Install

```bash
$ npm install --save x-path
```


## Usage

```javascript
var path = require('x-path');

path.isAbsolutePath(somePath)
path.isRelativePath(somePath)

```

## API

### isAbsolutePath
### isRelativePath
### isRootDirectory
### unifyPathSeparate
### normalizePathSeparate
### isDirectory
### isFile
### isDirectorySync
### isFileSync


And three more come from [path-extra](https://github.com/jprichardson/node-path-extra)

* tempdir
* homedir
* datadir


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).


## License

Copyright (c) 2015 Node X Extras. Licensed under the MIT license.


[climate-url]: https://codeclimate.com/github/node-x-extras/x-path
[climate-image]: https://codeclimate.com/github/node-x-extras/x-path/badges/gpa.svg
[npm-url]: https://npmjs.org/package/x-path
[npm-image]: https://badge.fury.io/js/x-path.svg
[travis-url]: https://travis-ci.org/node-x-extras/x-path
[travis-image]: https://travis-ci.org/node-x-extras/x-path.svg?branch=master
[daviddm-url]: https://david-dm.org/node-x-extras/x-path.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/node-x-extras/x-path
[coveralls-url]: https://coveralls.io/r/node-x-extras/x-path
[coveralls-image]: https://coveralls.io/repos/node-x-extras/x-path/badge.png
