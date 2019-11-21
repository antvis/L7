Symbol.prototype.description <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

[![browser support][testling-svg]][testling-url]

An ECMAScript spec-compliant `Symbol.prototype.description` shim. Invoke its "shim" method to shim Symbol.prototype.description if it is unavailable.
*Note*: `Symbol#description` requires a true ES6 environment, specifically one with native Symbols.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES6-supported environment and complies with the [spec](https://github.com/michaelficarra/Symbol-description-proposal/).

Most common usage:
```js
var description = require('symbol.prototype.description');

assert(description(Symbol('foo')) === 'foo');
assert(description(Symbol()) === undefined);
assert(description(Symbol(undefined)) === undefined);
assert(description(Symbol(null)) === 'null');

// note: this should be the empty string, but in many engines,
// it is impossible to distinguish Symbol() and Symbol('')
// without globally replacing `Symbol`
assert(description(Symbol('')) === undefined);

if (!Symbol.prototype.description) {
	description.shim();
}

assert(description(Symbol('foo')) === Symbol('foo').description);
assert(description(Symbol()) === Symbol().description);
assert(description(Symbol(undefined)) === Symbol(undefined).description);
assert(description(Symbol(null)) === Symbol(null).description);

assert(Symbol('').description === ''); // this works fine!
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.com/package/symbol.prototype.description
[npm-version-svg]: http://versionbadg.es/es-shims/Symbol.prototype.description.svg
[travis-svg]: https://travis-ci.org/es-shims/Symbol.prototype.description.svg
[travis-url]: https://travis-ci.org/es-shims/Symbol.prototype.description
[deps-svg]: https://david-dm.org/es-shims/Symbol.prototype.description.svg
[deps-url]: https://david-dm.org/es-shims/Symbol.prototype.description
[dev-deps-svg]: https://david-dm.org/es-shims/Symbol.prototype.description/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Symbol.prototype.description#info=devDependencies
[testling-svg]: https://ci.testling.com/es-shims/Symbol.prototype.description.png
[testling-url]: https://ci.testling.com/es-shims/Symbol.prototype.description
[npm-badge-png]: https://nodei.co/npm/symbol.prototype.description.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/symbol.prototype.description.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/symbol.prototype.description.svg
[downloads-url]: http://npm-stat.com/charts.html?package=symbol.prototype.description
