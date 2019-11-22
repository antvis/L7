# NestedObjectAssign
[![Build Status](https://travis-ci.org/Geta/NestedObjectAssign.svg?branch=master)](https://travis-ci.org/Geta/NestedObjectAssign)
[![dependencies Status](https://david-dm.org/geta/NestedObjectAssign/status.svg)](https://david-dm.org/geta/NestedObjectAssign)

This package extends the functionality given by Object.assign() to also include the values of nested objects.

## Installation
```
npm install --save nested-object-assign
```

## Usage
Works just like Object.Assign, add an empty object first (the object you want the other objects merged into), then as many objects as you wish afterwards, comma separated.

```js
import nestedObjectAssign from 'nested-object-assign';
const defaults = {}

function test() {
    let data = nestedObjectAssign({}, defaults, object1, object2, object3);
}
```

## Tests
Tests were done for these node.js versions:
* 8
* 7
* 6