# rc-switch
---

switch ui component for react.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-switch.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-switch
[travis-image]: https://img.shields.io/travis/react-component/switch.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/switch
[coveralls-image]: https://img.shields.io/coveralls/react-component/switch.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/switch?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/switch.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/switch
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-switch.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-switch

## Feature

* support ie8,ie8+,chrome,firefox,safari

## install

[![rc-switch](https://nodei.co/npm/rc-switch.png)](https://npmjs.org/package/rc-switch)

## Usage

```js
import ReactDOM from 'react-dom';
import Switch from 'rc-switch';

ReactDOM.render(<Switch />, container);
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
          <td>prefixCls</td>
          <td>String</td>
          <td>rc-switch</td>
          <td></td>
        </tr>
        <tr>
          <td>className</td>
          <td>String</td>
          <td>''</td>
          <td>additional class name of root node</td>
        </tr>
        <tr>
          <td>checked</td>
          <td>boolean</td>
          <td>false</td>
          <td>whether switch is checked</td>
        </tr>
        <tr>
          <td>defaultChecked</td>
          <td>boolean</td>
          <td>false</td>
          <td>whether switch is checked on init</td>
        <tr>
          <td>onChange</td>
          <td>Function(checked, event)</td>
          <td></td>
          <td>called when switch is checked or unchecked</td>
        </tr>
        <tr>
          <td>tabIndex</td>
          <td>number</td>
          <td></td>
          <td>tab-index of switch node</td>
        </tr>
        <tr>
          <td>onClick</td>
          <td>Function(checked, event)</td>
          <td></td>
          <td>called when switch is clicked</td>
        </tr>
        <tr>
          <td>autoFocus</td>
          <td>boolean</td>
          <td></td>
          <td>get focus when mounts</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>boolean</td>
          <td>false</td>
          <td>whether switch is disabled</td>
        </tr>
        <tr>
          <td>loadingIcon</td>
          <td>React.ReactNode</td>
          <td></td>
          <td>specific the extra node. generally used in loading icon.</td>
        </tr>
    </tbody>
</table>

## Development

```
npm install
npm start
```

Online demo: http://react-component.github.io/switch/examples/

## License

rc-switch is released under the MIT license.
