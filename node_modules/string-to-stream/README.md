# string-to-stream [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://img.shields.io/travis/feross/string-to-stream/master.svg
[travis-url]: https://travis-ci.org/feross/string-to-stream
[npm-image]: https://img.shields.io/npm/v/string-to-stream.svg
[npm-url]: https://npmjs.org/package/string-to-stream
[downloads-image]: https://img.shields.io/npm/dm/string-to-stream.svg
[downloads-url]: https://npmjs.org/package/string-to-stream
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

#### Convert a string into a stream (streams2)

[![browser support](https://ci.testling.com/feross/string-to-stream.png)](https://ci.testling.com/feross/string-to-stream)

### install

```
npm install string-to-stream
```

### usage

Use `string-to-stream` like this:

```js
var str = require('string-to-stream')

str('hi there').pipe(process.stdout) // => 'hi there'
```

### license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
