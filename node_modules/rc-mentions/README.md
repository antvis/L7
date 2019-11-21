# rc-mentions
---

React Mentions

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Dependencies](https://img.shields.io/david/react-component/mentions.svg?style=flat-square)](https://david-dm.org/react-component/mentions)
[![DevDependencies](https://img.shields.io/david/dev/react-component/mentions.svg?style=flat-square)](https://david-dm.org/react-component/mentions?type=dev)
[![npm download][download-image]][download-url]
[![Storybook](https://gw.alipayobjects.com/mdn/ob_info/afts/img/A*CQXNTZfK1vwAAAAAAAAAAABjAQAAAQ/original)](https://github.com/react-component/mentions)

[Storybook]: https://github.com/storybooks/press/blob/master/badges/storybook.svg
[npm-image]: http://img.shields.io/npm/v/rc-mentions.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-mentions
[travis-image]: https://img.shields.io/travis/react-component/mentions.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/mentions
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/mentions.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/mentions/branch/master
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-mentions.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-mentions

## Screenshots

<img src="https://user-images.githubusercontent.com/5378891/57270992-2fd48780-70c0-11e9-91ae-c614d0b49a45.png" />

## Feature

* support ie9,ie9+,chrome,firefox,safari

### Keyboard

* Open mentions (focus input || focus and click)
* KeyDown/KeyUp/Enter to navigate menu

## install

[![rc-mentions](https://nodei.co/npm/rc-mentions.png)](https://npmjs.org/package/rc-mentions)

## Usage

### basic use

```js
import Mentions from 'rc-mentions';

const { Option } = Mentions;

var Demo = (
  <Mentions>
    <Option value="light">Light</Option>
    <Option value="bamboo">Bamboo</Option>
    <Option value="cat">Cat</Option>
  </Mentions>
);
React.render(<Demo />, container);
```

## API

### Mentions props

| name     | description    | type     | default      |
|----------|----------------|----------|--------------|
| autoFocus | Auto get focus when component mounted | boolean | `false` |
| defaultValue | Default value | string | - |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) => boolean | - |
| notFoundContent | Set mentions content when not match | ReactNode | 'Not Found' |
| placement | Set popup placement | 'top' \| 'bottom' | 'bottom' |
| prefix | Set trigger prefix keyword | string \| string[] | '@' |
| rows | Set row count | number | 1 |
| split | Set split string before and after selected mention | string | ' ' |
| validateSearch | Customize trigger search logic | (text: string, props: MentionsProps) => void | - |
| value | Set value of mentions | string | - |
| onChange | Trigger when value changed |(text: string) => void | - |
| onSelect | Trigger when user select the option | (option: OptionProps, prefix: string) => void | - |
| onSearch | Trigger when prefix hit | (text: string, prefix: string) => void | - |
| onFocus | Trigger when mentions get focus | React.FocusEventHandler<HTMLTextAreaElement> | - |
| onBlur | Trigger when mentions lose focus | React.FocusEventHandler<HTMLTextAreaElement> | - |
| getPopupContainer | DOM Container for suggestions | () => HTMLElement | - |

### Methods

| name     | description    |
|----------|----------------|
| focus() | Component get focus |
| blur() | Component lose focus |

## Development

```
npm install
npm start
```

## Example

http://localhost:9001/

online example: http://react-component.github.io/mentions/

## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```


## License

rc-mentions is released under the MIT license.
