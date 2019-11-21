# window-size [![NPM version](https://img.shields.io/npm/v/window-size.svg?style=flat)](https://www.npmjs.com/package/window-size) [![NPM monthly downloads](https://img.shields.io/npm/dm/window-size.svg?style=flat)](https://npmjs.org/package/window-size)  [![NPM total downloads](https://img.shields.io/npm/dt/window-size.svg?style=flat)](https://npmjs.org/package/window-size) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/window-size.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/window-size) [![Windows Build Status](https://img.shields.io/appveyor/ci/jonschlinkert/window-size.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/jonschlinkert/window-size)

> Reliable way to get the height and width of terminal/console, since it's not calculated or updated the same way on all platforms, environments and node.js versions.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save window-size
```

## Usage

```js
var size = require('window-size');
```

## CLI

```sh
$ window-size
# height: 40
# width : 145
```

## API

### windowSize

The main export is either an object with `width` and `height` properties, or `undefined` if unable to get width and height.

```js
var size = require('window-size');
console.log(size); 
//=> {width: 80, height: 25}
```

### .get

Calls the main function to get the up-to-date window size.

```js
console.log(size.get());
//=> {width: 80, height: 25}
```

**Example**

See [example.js](example.js) for the code used in the below gif.

```js
process.stdout.on('resize', function() {
  console.log(size.get());
});
```

![resize event example](https://github.com/jonschlinkert/window-size/blob/master/resize.gif)

**HEADS UP!**

Note that some platforms only provide the initial terminal size, not the actual size after it has been resized by the user.

### .env

Get `process.env.COLUMNS` and `process.env.ROWS`, if defined. Called by the main function if for some reason size was not available from `process.stdout` and `process.stderr`.

```js
console.log(size.env());
```

### .tty

Attempts to get the size from `tty`. Called by the main function if for some reason size was not available from `process.stdout`, `process.stderr` or `process.env`.

```js
console.log(size.tty());
```

### .win

Get the terminal size in Windows 10+.

```js
console.log(size.win());
```

Note that this method calls [execSync](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options) to get the size, and must be called directly, as it **is not** called by the main function.

### .tput

Get the terminal size by calling the unix `$ tput` command.

```js
console.log(size.tput());
```

Note that this method calls [execSync](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options) to get the size, and must be called directly, as it **is not** called by the main function.

### utils

In some environments the main export may not be able to find a window size using the default methods. In this case, `size` will be `undefined` and the functions will not be exported.

Because of this, the functions have been exported in a separate file and can be required directly.

```js
var utils = require('window-size/utils');
console.log(utils.win());
```

## About

### Related projects

* [base-cli](https://www.npmjs.com/package/base-cli): Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a… [more](https://github.com/node-base/base-cli) | [homepage](https://github.com/node-base/base-cli "Plugin for base-methods that maps built-in methods to CLI args (also supports methods from a few plugins, like 'base-store', 'base-options' and 'base-data'.")
* [lint-deps](https://www.npmjs.com/package/lint-deps): CLI tool that tells you when dependencies are missing from package.json and offers you a… [more](https://github.com/jonschlinkert/lint-deps) | [homepage](https://github.com/jonschlinkert/lint-deps "CLI tool that tells you when dependencies are missing from package.json and offers you a choice to install them. Also tells you when dependencies are listed in package.json but are not being used anywhere in your project. Node.js command line tool and API")
* [yargs](https://www.npmjs.com/package/yargs): yargs the modern, pirate-themed, successor to optimist. | [homepage](http://yargs.js.org/ "yargs the modern, pirate-themed, successor to optimist.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor** |  
| --- | --- |  
| 23 | [jonschlinkert](https://github.com/jonschlinkert) |  
| 11 | [doowb](https://github.com/doowb) |  
| 4  | [bcoe](https://github.com/bcoe) |  
| 3  | [icyflame](https://github.com/icyflame) |  
| 2  | [derhuerst](https://github.com/derhuerst) |  
| 1  | [karliky](https://github.com/karliky) |  

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.7.0, on July 27, 2018._