# ext

_(Previously known as `es5-ext`)_

## JavaScript standard extensions (with respect to evolving standard)

Non-standard or soon to be standard language utilities in a future proof, non-invasive form.

Doesn't enforce transpilation step. Where it's applicable utilities/extensions are safe to use in all ES3+ implementations.

### Installation

```bash
npm install ext
```

### Utilities

#### Global

##### `globalThis` _(ext/global-this)_

Returns global object. Resolve native [globalThis](https://github.com/tc39/proposal-global) if implemented, otherwise fallback to internal resolution of a global object.

```javascript
const globalThis = require("ext/global-this");

globalThis.Array === Array; // true
```

#### Object

##### `Object.entries` _(ext/object/entries)_

[Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) implementation.

Returns native `Object.entries` if it's implemented, otherwise library implementation is returned

```javascript
const entries = require("ext/object/entries");

entries({ foo: "bar" }); // [["foo", "bar"]]
```

#### Function

##### `Function.identity` _(ext/function/identity)_

Returns input argument.

```javascript
const identity = require("ext/function/identity");

identity("foo"); // "foo"
```

#### Thenable.prototype

##### `thenable.finally` _(ext/thenable\_/finally)_

`finally` method for any _thenable_ input

```javascript
const finally = require("ext/thenable_/finally");

finally.call(thenable, () => console.log("Thenable resolved"));
```

#### Math

##### `Math.ceil10` _(ext/math/ceil-10)_

Decimal ceil

```javascript
const ceil10 = require("ext/math/ceil-10");

ceil10(55.51, -1); // 55.6
ceil10(-59, 1); // -50;
```

##### `Math.floor10` _(ext/math/floor-10)_

Decimal floor

```javascript
const floor10 = require("ext/math/floor-10");

floor10(55.59, -1); // 55.5
floor10(59, 1); // 50
```

##### `Math.round10` _(ext/math/round-10)_

Decimal round

```javascript
const round10 = require("ext/math/round-10");

round10(55.549, -1); // 55.5
round10(1.005, -2); // 1.01
```
