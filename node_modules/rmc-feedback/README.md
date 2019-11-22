# rmc-feedback
---

:active pseudo-class with react/preact for mobile

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

[npm-image]: http://img.shields.io/npm/v/rmc-feedback.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rmc-feedback
[travis-image]: https://img.shields.io/travis/react-component/m-feedback.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/m-feedback
[coveralls-image]: https://img.shields.io/coveralls/react-component/m-feedback.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/m-feedback?branch=master

## Installation

`npm install --save rmc-feedback`

## Development

```
npm install
npm start
```

## Example

- local: http://localhost:8000/examples/
- online: http://react-component.github.io/m-feedback/

## Usage

```js
import TouchFeedback from 'rmc-feedback';

<TouchFeedback activeClassName="acitve" activeStyle={{ color: 'red'}} disabled={false}>
  <div>click to active</div>
</TouchFeedback>

```

## API

### props

| name        | description          | type   | default    |
|-------------|------------------------|--------|------------|
| disabled     |                     | boolean | false |
| activeClassName | className applied to child when active | string |  |
| activeStyle |  style applied to child when active (set to false to disable click feedback) | object | - |

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

rmc-feedback is released under the MIT license.
