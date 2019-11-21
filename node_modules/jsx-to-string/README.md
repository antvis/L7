# jsx-to-string

Parse your React JSX components to string

[![Build Status](https://api.travis-ci.org/grommet/jsx-to-string.svg)](https://travis-ci.org/grommet/jsx-to-string)

### Install

```sh
npm install jsx-to-string
```

### Usage

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
// or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

console.log(jsxToString(<Basic test1="test" />)); //outputs: <Basic test1="test" />
```

### Defaults

  1. The default value for function is `...`. Use `keyValueOverride` for custom key values.

### Options
  * useFunctionCode (boolean)

    Optional. Defaults to false. Whether or not to use the function actual source code instead of `...`

    For example:

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

let _onClickHandler = function () {
  //no-op
}
console.log(jsxToString(<Basic onClick={_onClickHandler} />, {
  useFunctionCode: true
})); //outputs: <Basic onClick={function _onClickHandler() { //no-op }} />
```

* functionNameOnly (boolean)

  Optional. Defaults to false. Whether prop function values should contain only the name.
  This flag will only be used if `useFunctionCode` is set to true.

  For example:

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
render() {
  return (
    <div />
  );
}
}); //this is your react component

let _onClickHandler = function () {
//no-op
}
console.log(jsxToString(<Basic onClick={_onClickHandler} />, {
  functionNameOnly: true,
  useFunctionCode: true
})); //outputs: <Basic onClick={_onClickHandler} />
```

  * keyValueOverride (object)

    A key-value map that overrides the value of any React props with exact match with the given key. For example:

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

let _onClickHandler = function () {
  //no-op
}
console.log(jsxToString(<Basic onClick={_onClickHandler} />, {
  keyValueOverride: {
    onClick: '_onClickHandler'
  }
})); //outputs: <Basic onClick={_onClickHandler} />
```

  * ignoreProps (array)

    An array of string keys that should be ignored from the JSX string. For example:

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

console.log(jsxToString(<Basic test1="ignore" />, {
  ignoreProps: ['test1']
})); //outputs: <Basic />
```

  * ignoreTags (array)

    An array of string tags that should be ignored from the JSX string. For example:

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

console.log(jsxToString(<Basic><svg /><img /><p>I am alone</p></Basic>, {
  ignoreTags: ['svg', 'img']
})); //outputs: <Basic><p>I am alone</p></Basic>
```

  * shortBooleanSyntax (boolean)

  Optional. Defaults to false. Whether or not to show the short or long boolean syntax.

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

console.log(jsxToString(<Basic test test2={false} test3={true}>, {
  shortBooleanSyntax: true,
})); //outputs: <Basic test test2={false} test3 />
```

  * displayName (string)

    A custom value to be used as the component name. For example:

```js
import React from 'react';
import jsxToString from 'jsx-to-string';
//or var jsxToString = require('jsx-to-string');

let Basic = React.createClass({
  render() {
    return (
      <div />
    );
  }
}); //this is your react component

console.log(jsxToString(<Basic test1="ignore" />, {
  displayName: 'CustomName'
})); //outputs: <CustomName />
```

### License

[MIT](https://github.com/alansouzati/jsx-to-string/blob/master/LICENSE)
