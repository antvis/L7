# rc-editor-mention
---

React Mention Component


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-editor-mention.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-editor-mention
[travis-image]: https://img.shields.io/travis/react-component/editor-mention.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/editor-mention
[coveralls-image]: https://img.shields.io/coveralls/react-component/editor-mention.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/editor-mention?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/editor-mention.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/editor-mention
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-editor-mention.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-editor-mention


## Browser Support
## Browser Support

| ![IE / Edge](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png) <br /> IE / Edge | ![Firefox](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png) <br /> Firefox | ![Chrome](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png) <br /> Chrome | ![Safari](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png ) <br /> Safari | ![iOS Safari](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png) <br />iOS Safari | ![Chrome for Anroid](https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png) <br/> Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge [1, 2]| last 2 versions| last 2 versions| last 2 versions| not fully supported [3] | not fully supported [3]

[1] May need a shim or a polyfill for some syntax used in Draft.js ([docs](https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#polyfills)). 

[2] IME inputs have known issues in these browsers, especially Korean ([docs](https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#ime-and-internet-explorer)).

[3] There are known issues with mobile browsers, especially on Android ([docs](https://draftjs.org/docs/advanced-topics-issues-and-pitfalls.html#mobile-not-yet-supported)).


## Screenshots

<img src="" width="288"/>


## Development

```
npm install
npm start
```

## Example

http://localhost:8001/examples/


online example: http://react-component.github.io/editor-mention/


## Feature

* support ie8,ie8+,chrome,firefox,safari


## install


[![rc-editor-mention](https://nodei.co/npm/rc-editor-mention.png)](https://npmjs.org/package/rc-editor-mention)


## Usage

```js
var Mention = require('rc-editor-mention');
var React = require('react');
React.render(<Mention />, container);
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
          <td>className</td>
          <td>String</td>
          <td></td>
          <td>additional css class of root dom node</td>
        </tr>
        <tr>
          <td>placement</td>
          <td>String</td>
          <td>"bottom"</td>
          <td>suggestion placement, available values: "top", "bottom"</td>
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

rc-editor-mention is released under the MIT license.
