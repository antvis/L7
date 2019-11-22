# rc-slider
---

Slider UI component for React

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![david-dm deps][david-dm-image]][david-dm-url]
[![david-dm dev deps][david-dm-dev-image]][david-dm-dev-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-slider.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-slider
[travis-image]: https://img.shields.io/travis/react-component/slider.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/slider
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/slider/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/slider/branch/master
[david-dm-image]: https://david-dm.org/react-component/slider/status.svg
[david-dm-url]: https://david-dm.org/react-component/slider
[david-dm-dev-image]: https://david-dm.org/react-component/slider/dev-status.svg
[david-dm-dev-url]: https://david-dm.org/react-component/slider?type=dev
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-slider.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-slider

## Screenshots

<img src="https://t.alipayobjects.com/images/T1ki8fXeprXXXXXXXX.png" width="550"/>

<img src="https://t.alipayobjects.com/images/T1pPhfXhBqXXXXXXXX.png" width="550"/>

<img src="https://t.alipayobjects.com/images/T1wO8fXd4rXXXXXXXX.png" width="550"/>

<img src="http://i.giphy.com/l46Cs36c9HrHMExoc.gif"/>


## Features

* Supports IE9, IE9+, Chrome, Firefox & Safari

## Install

```bash
npm install --save rc-slider
```

[![rc-slider](https://nodei.co/npm/rc-slider.png)](https://npmjs.org/package/rc-slider)

## Usage

````js
import React from 'react';
import ReactDOM from 'react-dom';
import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

ReactDOM.render(
  <div>
    <Slider />
    <Range />
  </div>,
  container
);
`````

## API

### createSliderWithTooltip(Slider | Range) => React.Component

An extension to make Slider or Range support Tooltip on handle.

```jsx
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
```

[Online demo](http://react-component.github.io/slider/examples/handle.html)

After Range or Slider was wrapped by createSliderWithTooltip, it will have the following props:

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| tipFormatter | (value: number): React.ReactNode | `value => value` | A function to format tooltip's overlay |
| tipProps | Object | `{` <br>`placement: 'top',` <br> ` prefixCls: 'rc-slider-tooltip',` <br> `overlay: tipFormatter(value)` <br> `}` | A function to format tooltip's overlay |

### Common API

The following APIs are shared by Slider and Range.

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| className | string | `''` | Additional CSS class for the root DOM node |
| min | number | `0` | The minimum value of the slider |
| max | number | `100` | The maximum value of the slider |
| marks | `{number: ReactNode}` or`{number: { style, label }}` | `{}` | Marks on the slider. The key determines the position, and the value determines what will show. If you want to set the style of a specific mark point, the value should be an object which contains `style` and `label` properties. |
| step | number or `null` | `1` | Value to be added or subtracted on each step the slider makes. Must be greater than zero, and `max` - `min` should be evenly divisible by the step value. <br /> When `marks` is not an empty object, `step` can be set to `null`, to make `marks` as steps. |
| vertical | boolean | `false` | If vertical is `true`, the slider will be vertical. |
| handle | (props) => React.ReactNode | | A handle generator which could be used to customized handle. |
| included | boolean | `true` | If the value is `true`, it means a continuous value interval, otherwise, it is a independent value. |
| reverse | boolean | `false` | If the value is `true`, it means the component is rendered reverse. |
| disabled | boolean | `false` | If `true`, handles can't be moved. |
| dots | boolean | `false` | When the `step` value is greater than 1, you can set the `dots` to  `true` if you want to render the slider with dots. |
| onBeforeChange | Function | NOOP | `onBeforeChange` will be triggered when `ontouchstart` or `onmousedown` is triggered. |
| onChange | Function | NOOP | `onChange` will be triggered while the value of Slider changing. |
| onAfterChange | Function | NOOP | `onAfterChange` will be triggered when `ontouchend` or `onmouseup` is triggered. |
| minimumTrackStyle | Object |  | please use  `trackStyle` instead. (`only used for slider, just for compatibility , will be deprecate at rc-slider@9.x `) |
| maximumTrackStyle | Object |  | please use  `railStyle` instead (`only used for slider, just for compatibility , will be deprecate at rc-slider@9.x`) |
| handleStyle | Array[Object] \| Object | `[{}]` | The style used for handle. (`both for slider(`Object`) and range(`Array of Object`), the array will be used for multi handle following element order`) |
| trackStyle | Array[Object] \| Object | `[{}]` | The style used for track. (`both for slider(`Object`) and range(`Array of Object`), the array will be used for multi track following element order`)|
| railStyle | Object | `{}` | The style used for the track base color.  |
| dotStyle | Object | `{}` | The style used for the dots. |
| activeDotStyle | Object | `{}` | The style used for the active dots. |

### Slider

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| defaultValue | number | `0` | Set initial value of slider. |
| value | number | - | Set current value of slider. |
| tabIndex | number | `0` | Set the tabIndex of the slider handle. |

### Range

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| defaultValue | `number[]` | `[0, 0]` | Set initial positions of handles. |
| value | `number[]` | | Set current positions of handles. |
| tabIndex | number[] | `[0, 0]` | Set the tabIndex of each handle. |
| count | number | `1` | Determine how many ranges to render, and multiple handles will be rendered (number + 1). |
| allowCross | boolean | `true` | `allowCross` could be set as `true` to allow those handles to cross. |
| pushable | boolean or number | `false` | `pushable` could be set as `true` to allow pushing of surrounding handles when moving a handle. When set to a number, the number will be the minimum ensured distance between handles. Example: ![](http://i.giphy.com/l46Cs36c9HrHMExoc.gif) |

## Development

```
npm install
npm start
```

## Example

`npm start` and then go to `http://localhost:8005/examples/`

Online examples: [http://react-component.github.io/slider/](http://react-component.github.io/slider/)

## Test Case

`http://localhost:8005/tests/runner.html?coverage`

## Coverage

`http://localhost:8005/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8088/tests/runner.html?coverage`

## License

`rc-slider` is released under the MIT license.
