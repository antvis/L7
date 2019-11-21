<h1 align="center">
  <br>
  <img width="365" src="https://cdn.rawgit.com/data-uri/datauri/master/media/datauri.svg" alt="datauri">
  <br>
  <br>
  <br>
</h1>

Node.js [Module](#module) and [CLI](http://npm.im/datauri-cli) to generate [Data URI scheme](http://en.wikipedia.org/wiki/Data_URI_scheme).

>  The data URI scheme is a uniform resource identifier (URI) scheme that provides a way to include data in-line in web pages as if they were external resources.

from: [Wikipedia](http://en.wikipedia.org/wiki/Data_URI_scheme)

[![Build Status](https://travis-ci.org/data-uri/datauri.svg?branch=master)](http://travis-ci.org/data-uri/datauri) [![Coverage Status](https://coveralls.io/repos/data-uri/datauri/badge.svg?branch=master&service=github)](https://coveralls.io/github/data-uri/datauri?branch=master) [![Dependency Status](https://www.versioneye.com/user/projects/560b7b3f5a262f001e0007e2/badge.svg?style=flat)](https://www.versioneye.com/user/projects/560b7b3f5a262f001e0007e2) [![NPM version](http://img.shields.io/npm/dm/datauri.svg?style=flat)](https://www.npmjs.org/package/datauri)

MODULE
-------
`npm install --save datauri`

1. [From file path](#readable-stream)
  * [Asynchronous](#readable-stream)
    * [Readable Stream](#readable-stream)
    * [Promise](#promise-node-012-works-with-es2016-asyncawait)
    * [Callback](#callback)
  * [Synchronous](#synchronous-class)
    * [Class](#synchronous-class)
    * [Function](#synchronous-function)
2. [From a Buffer](#from-a-buffer)
3. [From a String](#from-a-string)
4. [Method chaining](#method-chaining)
5. [Task plugins using datauri](#tools-using-datauri)
  * [npm script](#npm-script)
  * [gulp](#gulp)
  * [grunt](#grunt)
6. [Develop](#develop)
7. [License](#license)
8. [ChangeLog](https://github.com/data-uri/datauri/releases)
9. [Tools using datauri](https://github.com/data-uri/datauri/blob/master/README.md#tools-using-datauri)

### Readable Stream
```js
const Datauri = require('datauri');
const datauri = new Datauri();

datauri.pipe(process.stdout);
datauri.encode('test/myfile.png');
```

```js
const Datauri = require('datauri');
const datauri = new Datauri();

datauri.on('encoded', content => console.log(content));
//=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";

datauri.on('error', err => console.log(err));
datauri.encode('test/myfile.png');
```

### Promise (node 0.12+, works with es2016 async/await)
```js
'use strict';

const DataURI = require('datauri').promise;
// babelers: import { promise as DataURI } from 'datauri';

DataURI('test/myfile.png')
  .then(content => console.log(content))
  //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  .catch(err => { throw err; });
```

### Callback
```js
const DataURI = require('datauri');
const datauri = new DataURI();

datauri.encode('test/myfile.png', (err, content) => {
  if (err) {
      throw err;
  }

  console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

  console.log(this.mimetype); //=> "image/png"
  console.log(this.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
  console.log(this.getCSS()); //=> "\n.case {\n    background-image: url('data:image/png;base64,iVBORw..."
  console.log(this.getCSS({
    class: "myClass",
    width: true,
    height: true
  })); //=> adds image width and height and custom class name
});

```


### Synchronous Class
If DataURI class is instanciated with a file path, the same will be processed synchronously.

```js
const Datauri = require('datauri');
let   datauri = new Datauri('test/myfile.png');

console.log(datauri.content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
console.log(datauri.mimetype); //=> "image/png"
console.log(datauri.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
console.log(datauri.getCSS()); //=> "\n.case {\n    background-image: url('data:image/png;base64,iVBORw..."
console.log(datauri.getCSS("myClass")); //=> "\n.myClass {\n    background-image: url('data:image/png;base64,iVBORw..."
```

### Synchronous Function
```js
const Datauri = require('datauri').sync;

console.log(Datauri('test/myfile.png')); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```
or for ES2015/6 lovers

```js
import { sync as DataURI } from 'datauri';

console.log(DataURI('test/myfile.png')); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### From a Buffer
If you already have your file as a Buffer, use this. It's much faster than passing a string.

```js
const Datauri = require('datauri'),
const datauri = new Datauri();

//...
const buffer = fs.readFileSync('./hello');
//...

datauri.format('.png', buffer);

console.log(datauri.content); //=> "data:image/png;base64,eGtjZA=="
console.log(datauri.mimetype); //=> "image/png"
console.log(datauri.base64); //=> "eGtjZA=="
console.log(datauri.getCSS({
  class: "myClass",
  width: true,
  height: true
})); //=> adds image width and height and custom class name

```

### From a string
```js
const DataURI = require('datauri');
const datauri = new Datauri();

datauri.format('.png', 'xkcd');

console.log(datauri.content); //=> "data:image/png;base64,eGtjZA=="
console.log(datauri.mimetype); //=> "image/png"
console.log(datauri.base64); //=> "eGtjZA=="
console.log(datauri.getCSS({
  class: "myClass",
  width: true,
  height: true
})); //=> adds image width and height and custom class name

```

#### Method chaining
```js
//...
datauri
  .on('encoded', content => {
    console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    console.log(this.mimetype); //=> "image/png"
    console.log(this.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
    console.log(this.getCSS()); //=> "\n.case {\n    background-image: url('data:image/png;base64,iVBORw..."
    console.log(this.getCSS({
      class: "myClass"
    }); //=> "\n.myClass {\n    background-image: url('data:image/png;base64,iVBORw..."
  })
  .on('error', err => console.error(err))
  .encode('test/myfile.png');
```

DEVELOP
-------

```CLI
$ npm install
```

To run test specs

```CLI
$ npm test
```

## License

MIT License
(c) [Data-URI.js](http://github.com/data-uri)
