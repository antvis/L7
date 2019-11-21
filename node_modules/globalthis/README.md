# globalThis <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][npm-url]

An ECMAScript spec-compliant polyfill/shim for `globalThis`. Invoke its "shim" method to shim `globalThis` if it is unavailable.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec proposal](https://github.com/tc39/proposal-global).

Most common usage:
```js
var globalThis = require('globalThis')(); // returns native method if compliant
	/* or */
var globalThis = require('globalThis/polyfill')(); // returns native method if compliant
```

## Example

```js
var assert = require('assert');

// the below function is not CSP-compliant, but reliably gets the
// global object in sloppy mode in every engine.
var getGlobal = Function('return this');

assert.equal(globalThis, getGlobal());
```

```js
/* when `globalThis` is not present */
var shimmedGlobal = require('globalthis').shim();
	/* or */
var shimmedGlobal = require('globalthis/shim')();

assert.equal(shimmedGlobal, globalThis);
assert.equal(shimmedGlobal, getGlobal());
```

```js
/* when `globalThis` is present */
var shimmedGlobal = require('globalthis').shim();

assert.equal(shimmedGlobal, globalThis);
assert.equal(shimmedGlobal, getGlobal());
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[npm-url]: https://npmjs.org/package/globalthis
[npm-version-svg]: http://versionbadg.es/ljharb/globalThis.svg
[travis-svg]: https://travis-ci.org/ljharb/globalThis.svg
[travis-url]: https://travis-ci.org/ljharb/globalThis
[deps-svg]: https://david-dm.org/ljharb/globalThis.svg?theme=shields.io
[deps-url]: https://david-dm.org/ljharb/globalThis
[dev-deps-svg]: https://david-dm.org/ljharb/globalThis/dev-status.svg?theme=shields.io
[dev-deps-url]: https://david-dm.org/ljharb/globalThis#info=devDependencies
[testling-png]: https://ci.testling.com/ljharb/globalThis.png
[testling-url]: https://ci.testling.com/ljharb/globalThis
[npm-badge-png]: https://nodei.co/npm/globalthis.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/globalthis.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/globalthis.svg
[downloads-url]: http://npm-stat.com/charts.html?package=globalthis
