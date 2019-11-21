# rc-rate
---

React Rate Component


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-rate.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-rate
[travis-image]: https://img.shields.io/travis/react-component/rate.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/rate
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/rate/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/rate/branch/master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/rate.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/rate
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-rate.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-rate

## Screenshots

<img src="https://img.alicdn.com/tps/TB1ijlpLVXXXXb8XpXXXXXXXXXX-466-172.png" width="288"/>


## Development

```
npm install
npm start
```

## Example

http://localhost:8000/examples/


online example: http://react-component.github.io/rate/


## install


[![rc-rate](https://nodei.co/npm/rc-rate.png)](https://npmjs.org/package/rc-rate)


## Usage

```js
var Rate = require('rc-rate');
var React = require('react');
React.render(<Rate />, container);
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>count</td>
          <td>number</td>
          <td>5</td>
          <td>star numbers</td>
        </tr>
        <tr>
          <td>value</td>
          <td>number</td>
          <td></td>
          <td>controlled value</td>
        </tr>
        <tr>
          <td>defaultValue</td>
          <td>number</td>
          <td>0</td>
          <td>initial value</td>
        </tr>
        <tr>
          <td>allowHalf</td>
          <td>bool</td>
          <td>false</td>
          <td>support half star</td>
        </tr>
        <tr>
          <td>allowClear</td>
          <td>bool</td>
          <td>true</td>
          <td>reset when click again</td>
        </tr>
        <tr>
          <td>style</td>
          <td>object</td>
          <td>{}</td>
          <td></td>
        </tr>
        <tr>
          <td>onChange</td>
          <td>function(value: Number)</td>
          <td></td>
          <td>`onChange` will be triggered when click.</td>
        </tr>
        <tr>
          <td>onHoverChange</td>
          <td>function(value: Number)</td>
          <td></td>
          <td>`onHoverChange` will be triggered when hover on stars.</td>
        </tr>
        <tr>
          <td>character</td>
          <td>ReactNode</td>
          <td>★</td>
          <td>The each character of rate</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>bool</td>
          <td>false</td>
          <td></td>
        </tr>
    </tbody>
</table>


## Test Case

```
npm test
npm run chrome-test
```

## Coverage

```
npm run coverage
```

open coverage/ dir

## License

rc-rate is released under the MIT license.
