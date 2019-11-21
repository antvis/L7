# TimePicker

React TimePicker

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Dependencies](https://img.shields.io/david/react-component/time-picker.svg?style=flat-square)](https://david-dm.org/react-component/time-picker)
[![DevDependencies](https://img.shields.io/david/dev/react-component/time-picker.svg?style=flat-square)](https://david-dm.org/react-component/time-picker?type=dev)
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-time-picker.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-time-picker
[travis-image]: https://img.shields.io/travis/react-component/time-picker.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/time-picker
[codecov-image]: https://codecov.io/gh/react-component/time-picker/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/react-component/time-picker
[download-image]: https://img.shields.io/npm/dm/rc-time-picker.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-time-picker

example
--------

http://react-component.github.io/time-picker/

install
-------

```
npm install rc-time-picker
```

Usage
-----

```
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
import 'rc-time-picker/assets/index.css';
ReactDOM.render(<TimePicker />, container);
```

API
---

### TimePicker

| Name                    | Type                              | Default | Description |
|-------------------------|-----------------------------------|---------|-------------|
| prefixCls               | String                            | 'rc-time-picker' | prefixCls of this component |
| clearText               | String                            | 'clear' | clear tooltip of icon |
| disabled                | Boolean                           | false   | whether picker is disabled |
| allowEmpty              | Boolean                           | true | allow clearing text |
| open                    | Boolean                           | false | current open state of picker. controlled prop |
| defaultValue            | moment                            | null | default initial value |
| defaultOpenValue        | moment                            | moment() | default open panel value, used to set utcOffset,locale if value/defaultValue absent |
| value                   | moment                            | null | current value |
| placeholder             | String                            | '' | time input's placeholder |
| className               | String                            | '' | time picker className |
| id                      | String                            | '' | time picker id |
| popupClassName          | String                            | '' | time panel className |
| popupStyle              | object                            | {} | customize popup style
| showHour                | Boolean                           | true | whether show hour | |
| showMinute              | Boolean                           | true | whether show minute |
| showSecond              | Boolean                           | true | whether show second |
| format                  | String                            | - | moment format |
| disabledHours           | Function                          | - | disabled hour options |
| disabledMinutes         | Function                          | - | disabled minute options |
| disabledSeconds         | Function                          | - | disabled second options |
| use12Hours              | Boolean                           | false | 12 hours display mode |
| hideDisabledOptions     | Boolean                           | false | whether hide disabled options |
| onChange                | Function                          | null | called when select a different value |
| onAmPmChange            | Function                          | null | called when select an am/pm value |
| addon                   | Function                          | - | called from timepicker panel to render some addon to its bottom, like an OK button. Receives panel instance as parameter, to be able to close it like `panel.close()`.|
| placement               | String                            | bottomLeft | one of ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] |
| transitionName          | String                            | ''  |  |
| name                    | String                            | - | sets the name of the generated input |
| onOpen                  | Function({ open })                |   | when TimePicker panel is opened      |
| onClose                 | Function({ open })                |   | when TimePicker panel is closed      |
| hourStep                | Number                            | 1 | interval between hours in picker  |
| minuteStep              | Number                            | 1 | interval between minutes in picker  |
| secondStep              | Number                            | 1 | interval between seconds in picker  |
| focusOnOpen             | Boolean                           | false | automatically focus the input when the picker opens |
| inputReadOnly             | Boolean                           | false | set input to read only |
| inputIcon             | ReactNode                           |  | specific the select icon. |
| clearIcon             | ReactNode                           |  | specific the clear icon. |

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

License
-------

rc-time-picker is released under the MIT license.
