# rc-collapse
---

rc-collapse ui component for react

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]
[![Dependencies](https://img.shields.io/david/react-component/collapse.svg?style=flat-square)](https://david-dm.org/react-component/collapse)
[![DevDependencies](https://img.shields.io/david/dev/react-component/collapse.svg?style=flat-square)](https://david-dm.org/react-component/collapse?type=dev)

[npm-image]: http://img.shields.io/npm/v/rc-collapse.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-collapse
[travis-image]: https://img.shields.io/travis/react-component/collapse.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/collapse
[coveralls-image]: https://img.shields.io/coveralls/react-component/collapse.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/collapse?branch=master
[download-image]: https://img.shields.io/npm/dm/rc-collapse.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-collapse

## Development

```
npm install
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/collapse/


## Features

* support ie8,ie8+,chrome,firefox,safari

## Install

[![rc-collapse](https://nodei.co/npm/rc-collapse.png)](https://npmjs.org/package/rc-collapse)

## Usage

```js
var Collapse = require('rc-collapse');
var Panel = Collapse.Panel;
var React = require('react');
var ReactDOM = require('react-dom');
require('rc-collapse/assets/index.css');

var collapse = (
  <Collapse accordion={true}>
    <Panel header="hello" headerClass="my-header-class">this is panel content</Panel>
    <Panel header="title2">this is panel content2 or other</Panel>
  </Collapse>
);
ReactDOM.render(collapse, container);
```

## API

### Collapse

#### props:

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>activeKey</td>
          <td>String|Array<String></td>
          <th>The first panel key</th>
          <td>current active Panel key</td>
      </tr>
      <tr>
        <td>className</td>
        <td>String or object</td>
        <th></th>
        <td>custom className to apply</td>
      </tr>
      <tr>
          <td>defaultActiveKey</td>
          <td>String|Array<String></td>
          <th>null</th>
          <td>default active key</td>
      </tr>
      <tr>
          <td>destroyInactivePanel</td>
          <td>Boolean</td>
          <th>false</th>
          <td>If destroy the panel which not active, default false. </td>
      </tr>
      <tr>
          <td>accordion</td>
          <td>Boolean</td>
          <th>false</th>
          <td>accordion mode, default is null, is collapse mode</td>
      </tr>
      <tr>
          <td>onChange</td>
          <td>Function(key)</td>
          <th>noop</th>
          <td>called when collapse Panel is changed</td>
      </tr>
      <tr>
          <td>expandIcon</td>
          <td>(props: PanelProps) => ReactNode</td>
          <th></th>
          <td>specific the custom expand icon.</td>
      </tr>
    </tbody>
</table>

If `accordion` is null or false, every panel can open.  Opening another panel will not close any of the other panels.
`activeKey` should be an string, if passing an array (the first item in the array will be used).

If `accordion` is true, only one panel can be open.  Opening another panel will cause the previously opened panel to close.
`activeKey` should be an string, if passing an array (the first item in the array will be used).

### Collapse.Panel

#### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>header</td>
          <td>String or node</td>
          <th></th>
          <td>header content of Panel</td>
      </tr>
      <tr>
          <td>headerClass</td>
          <td>String</td>
          <th>' '</th>
          <td>custom className to apply to header</td>
      </tr>
      <tr>
          <td>showArrow</td>
          <td>boolean</td>
          <th>true</th>
          <td>show arrow beside header</td>
      </tr>
      <tr>
        <td>className</td>
        <td>String or object</td>
        <th></th>
        <td>custom className to apply</td>
      </tr>
      <tr>
        <td>style</td>
        <td>object</td>
        <th></th>
        <td>custom style</td>
      </tr>
      <tr>
        <td>openAnimation</td>
        <td>object</td>
        <th></th>
        <td>set the animation of open behavior, [more](https://github.com/react-component/animate#animation-format)</td>
      </tr>
      <tr>
        <td>disabled</td>
        <td>boolean</td>
        <th>false</th>
        <td>whether the panel is collapsible</td>
      </tr>
      <tr>
        <td>forceRender</td>
        <td>boolean</td>
        <th>false</th>
        <td>forced render of content in panel, not lazy render after clicking on header</td>
      </tr>
      <tr>
          <td>extra</td>
          <td>String | ReactNode</td>
          <th></th>
          <td>Content to render in the right of the panel header</td>
      </tr>
    </tbody>
</table>

#### key

If `key` is not provided, the panel's index will be used instead.

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

rc-collapse is released under the MIT license.
