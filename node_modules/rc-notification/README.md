# rc-notification
---

React Notification UI Component

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-notification.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-notification
[travis-image]: https://img.shields.io/travis/react-component/notification.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/notification
[coveralls-image]: https://img.shields.io/coveralls/react-component/notification.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/notification?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/notification.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/notification
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-notification.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-notification


## Development

```
npm install
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/notification/examples/


## Feature

* support ie9,ie9+,chrome,firefox,safari


## install

[![rc-notification](https://nodei.co/npm/rc-notification.png)](https://npmjs.org/package/rc-notification)

## Usage

```js
var Notification = require('rc-notification');
Notification.newInstance({}, notification => {
  notification.notice({
    content: 'content'
  });
});
```

## API

### Notification.newInstance(props, (notification) => void) => void

props details:

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
          <td>prefixCls</td>
          <td>String</td>
          <td></td>
          <td>prefix class name for notification container</td>
        </tr>
        <tr>
          <td>style</td>
          <td>Object</td>
          <td>{'top': 65, left: '50%'}</td>
          <td>additional style for notification container.</td>
        </tr>
        <tr>
          <td>getContainer</td>
          <td>getContainer(): HTMLElement</td>
          <td></td>
          <td>function returning html node which will act as notification container</td>
        </tr>
    </tbody>
</table>

### notification.notice(props)

props details:

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
          <td>content</td>
          <td>React.Element</td>
          <td></td>
          <td>content of notice</td>
        </tr>
        <tr>
          <td>key</td>
          <td>String</td>
          <td></td>
          <td>id of this notice</td>
        </tr>
        <tr>
          <td>closable</td>
          <td>Boolean</td>
          <td></td>
          <td>whether show close button</td>
        </tr>
        <tr>
          <td>onClose</td>
          <td>Function</td>
          <td></td>
          <td>called when notice close</td>
        </tr>
        <tr>
          <td>duration</td>
          <td>number</td>
          <td>1.5</td>
          <td>after duration of time, this notice will disappear.(seconds)</td>
        </tr>
        <tr>
          <td>style</td>
          <td>Object</td>
          <td> { right: '50%' } </td>
          <td>additional style for single notice node.</td>
        </tr>
        <tr>
          <td>maxCount</td>
          <td>number</td>
          <td></td>
          <td>max notices show, drop first notice if exceed limit</td>
        </tr>
        <tr>
          <td>closeIcon</td>
          <td>ReactNode</td>
          <td></td>
          <td>specific the close icon.</td>
        </tr>
    </tbody>
</table>

### notification.removeNotice(key:string)

remove single notice with specified key

### notification.destroy()

destroy current notification

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

rc-notification is released under the MIT license.
