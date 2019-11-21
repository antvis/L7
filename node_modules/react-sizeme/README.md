<p>&nbsp;</p>

<p align='center'>
  <img src='https://raw.githubusercontent.com/ctrlplusb/react-sizeme/master/assets/logo.png' width='250'/>
  <p align='center'>Make your React Components aware of their width and/or height!</p>
</p>

<p>&nbsp;</p>

[![npm](https://img.shields.io/npm/v/react-sizeme.svg?style=flat-square)](http://npm.im/react-sizeme)
[![MIT License](https://img.shields.io/npm/l/react-sizeme.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Travis](https://img.shields.io/travis/ctrlplusb/react-sizeme.svg?style=flat-square)](https://travis-ci.org/ctrlplusb/react-sizeme)
[![Codecov](https://img.shields.io/codecov/c/github/ctrlplusb/react-sizeme.svg?style=flat-square)](https://codecov.io/github/ctrlplusb/react-sizeme)

- Blazingly fast. 😛
- Responsive Components!
- Easy to use.
- Extensive browser support.
- Supports any Component type, i.e. stateless/class.
- Really small bundle size.

Use it via the render prop pattern (supports `children` or `render` prop):

```javascript
import { SizeMe } from 'react-sizeme'

function MyApp() {
  return (
    <SizeMe>
      {({ size }) => <div>My width is {size.width}px</div>}
    </SizeMe>
  )
}
```

Or, via a higher order component:

```javascript
import { withSize } from 'react-sizeme'

function MyComponent({ size }) {
  return <div>My width is {size.width}px</div>
}

export default withSize()(MyComponent)
```

<p>&nbsp;</p>

---

## TOCs

- [Intro](https://github.com/ctrlplusb/react-sizeme#intro)
- [Installation](https://github.com/ctrlplusb/react-sizeme#installation)
- [Configuration](https://github.com/ctrlplusb/react-sizeme#configuration)
- [Component Usage](https://github.com/ctrlplusb/react-sizeme#component-usage)
- [HOC Usage](https://github.com/ctrlplusb/react-sizeme#hoc-usage)
  - [`onSize` callback alternative usage](https://github.com/ctrlplusb/react-sizeme#onsize-callback-alternative-usage)
- [Under the hood](https://github.com/ctrlplusb/react-sizeme#under-the-hood)
- [Examples](#examples)
  - [Loading different child components based on size](#loading-different-child-components-based-on-size)
- [Server Side Rendering](https://github.com/ctrlplusb/react-sizeme#server-side-rendering)
- [Extreme Appreciation](https://github.com/ctrlplusb/react-sizeme#extreme-appreciation)

<p>&nbsp;</p>

---

## Intro

Give your Components the ability to have render logic based on their height and/or width. Responsive design on the Component level. This allows you to create highly reusable components that can adapt to wherever they are rendered.

Check out a working demo here: https://react-sizeme.now.sh

<p>&nbsp;</p>

---

## Installation

```javascript
npm install react-sizeme
```

<p>&nbsp;</p>

---

## Configuration

The following configuration options are available. Please see the usage docs for how to pass these configuration values into either the [component](#component-usage) or [higher order function](#hoc-usage).

- `monitorWidth` (_boolean_, **default**: true)

  If true, then any changes to your Components rendered width will cause an recalculation of the "size" prop which will then be be passed into your Component.

- `monitorHeight` (_boolean_, **default**: false)

  If true, then any changes to your Components rendered height will cause an
  recalculation of the "size" prop which will then be be passed into
  your Component.

  > PLEASE NOTE: that this is set to `false` by default

- `refreshRate` (_number_, **default**: 16)

  The maximum frequency, in milliseconds, at which size changes should be recalculated when changes in your Component's rendered size are being detected. This should not be set to lower than 16.

- `refreshMode` (_string_, **default**: 'throttle')

  The mode in which refreshing should occur. Valid values are "debounce" and "throttle".

  "throttle" will eagerly measure your component and then wait for the refreshRate to pass before doing a new measurement on size changes.

  "debounce" will wait for a minimum of the refreshRate before it does a measurement check on your component.

  "debounce" can be useful in cases where your component is animated into the DOM.

  > NOTE: When using "debounce" mode you may want to consider disabling the placeholder as this adds an extra delay in the rendering time of your component.

- `noPlaceholder` (_boolean_, **default**: false)

  By default we render a "placeholder" component initially so we can try and "prefetch" the expected size for your component. This is to avoid any unnecessary deep tree renders. If you feel this is not an issue for your component case and you would like to get an eager render of
  your component then disable the placeholder using this config option.

  > NOTE: You can set this globally. See the docs on first render.

<p>&nbsp;</p>

---

## Component Usage

We provide a "render props pattern" based component. You can import it like so:

```javascript
import { SizeMe } from 'react-sizeme'
```

You then provide it either a `render` or `children` prop containing a function/component that will receive a `size` prop (an object with `width` and `height` properties):

```javascript
<SizeMe>{({ size }) => <div>My width is {size.width}px</div>}</SizeMe>
```

_or_

```javascript
<SizeMe render={({ size }) => <div>My width is {size.width}px</div>} />
```

To provide [configuration](#configuration) you simply add any customisation as props. For example:

```javascript
<SizeMe
  monitorHeight
  refreshRate={32}
  render={({ size }) => <div>My width is {size.width}px</div>}
/>
```

<p>&nbsp;</p>

---

## HOC Usage

We provide you with a higher order component function called `withSize`. You can import it like so:

```javascript
import { withSize } from 'react-sizeme'
```

Firstly, you have to call the `withSize` function, passing in an optional [configuration](#configuration) object should you wish to customise the behaviour:

```javascript
const withSizeHOC = withSize()
```

You can then use the returned Higher Order Component to decorate any of your existing Components with the size awareness ability:

```javascript
const SizeAwareComponent = withSizeHOC(MyComponent)
```

Your component will then receive a `size` prop (an object with `width` and `height` properties).

> Note that the values could be undefined based on the configuration you provided (e.g. you explicitly do not monitor either of the dimensions)

Below is a full example:

```javascript
import sizeMe from 'react-sizeme'

class MyComponent extends Component {
  render() {
    const { width, height } = this.props.size

    return (
      <div>
        My size is {width || -1}px x {height || -1}px
      </div>
    )
  }
}

export default sizeMe({ monitorHeight: true })(MyComponent)
```

### `onSize` callback alternative usage

The higher order component also allows an alternative usage where you provide an `onSize` callback function.

This allows the "parent" to manage the `size` value rather than your component, which can be useful in specific circumstances.

Below is an example of it's usage.

Firstly, create a component you wish to know the size of:

```jsx
import sizeMe from 'react-sizeme'

function MyComponent({ message }) {
  return <div>{message}</div>
}

export default sizeMe()(MyComponent)
```

Now create a "parent" component providing it a `onSize` callback function to the size aware component:

```jsx
class ParentComponent extends React.Component {
  onSize = size => {
    console.log('MyComponent has a width of', size.width)
  }

  render() {
    return <MyComponent message="Hello world" onSize={this.onSize} />
  }
}
```

<p>&nbsp;</p>

---

## Under the hood

It can be useful to understand the rendering workflow should you wish to debug any issues we may be having.

In order to size your component we have a bit of a chicken/egg scenario. We can't know the width/height of your Component until it is rendered. This can lead wasteful rendering cycles should you choose to render your components based on their width/height.

Therefore for the first render of your component we actually render a lightweight placeholder in place of your component in order to obtain the width/height. If your component was being passed a `className` or `style` prop then these will be applied to the placeholder so that it can more closely resemble your actual components dimensions.

So the first dimensions that are passed to your component may not be "correct" dimensions, however, it should quickly receive the "correct" dimensions upon render.

Should you wish to avoid the render of a placeholder and have an eager render of your component then you can use the `noPlaceholder` configuration option. Using this configuration value your component will be rendered directly, however, the `size` prop may contain `undefined` for width and height until your component completes its first render.

<p>&nbsp;</p>

---

## Examples

### Loading different child components based on size

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import LargeChildComponent from './LargeChildComponent';
import SmallChildComponent from './SmallChildComponent';
import sizeMe from 'react-sizeme';

function MyComponent(props) {
  const { width, height } = props.size;

  const ToRenderChild = height > 600
    ? LargeChildComponent
    : SmallChildComponent;

  return (
    <div>
      <h1>My size is {width}x{height}</div>
      <ToRenderChild />
    </div>
  );
}
MyComponent.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  })
}

export default sizeMe({ monitorHeight: true })(MyComponent);
```

> EXTRA POINTS! Combine the above with a code splitting API (e.g. Webpack's System.import) to avoid unnecessary code downloads for your clients. Zing!

<p>&nbsp;</p>

---

## Server Side Rendering

Okay, I am gonna be up front here and tell you that using this library in an SSR context is most likely a bad idea. If you insist on doing so you then you should take the time to make yourself fully aware of any possible repercussions you application may face.

A standard `sizeMe` configuration involves the rendering of a placeholder component. After the placeholder is mounted to the DOM we extract it's dimension information and pass it on to your actual component. We do this in order to avoid any unnecessary render cycles for possibly deep component trees. Whilst this is useful for a purely client side set up, this is less than useful for an SSR context as the delivered page will contain empty placeholders. Ideally you want actual content to be delivered so that users without JS can still have an experience, or SEO bots can scrape your website.

To avoid the rendering of placeholders in this context you can make use of the `noPlaceholders` global configuration value. Setting this flag will disables any placeholder rendering. Instead your wrapped component will be rendered directly - however it's initial render will contain no values within the `size` prop (i.e. `width`, `height`, and `position` will be `null`).

```javascript
import sizeMe from 'react-sizeme'

// This is a global variable. i.e. will be the default for all instances.
sizeMe.noPlaceholders = true
```

> Note: if you only partialy server render your application you may want to use the component level configuration that allows disabling placeholders per component (e.g. `sizeMe({ noPlaceholder: true })`)

It is up to you to decide how you would like to initially render your component then. When your component is sent to the client and mounted to the DOM `SizeMe` will calculate and send the dimensions to your component as normal. I suggest you tread very carefully with how you use this updated information and do lots of testing using various screen dimensions. Try your best to avoid unnecessary re-rendering of your components, for the sake of your users.

If you come up with any clever strategies for this please do come share them with us! :)

<p>&nbsp;</p>

---

## Extreme Appreciation!

We make use of the awesome [element-resize-detector](https://github.com/wnr/element-resize-detector) library. This library makes use of an scroll/object based event strategy which outperforms window resize event listening dramatically. The original idea for this approach comes from another library, namely [css-element-queries](https://github.com/marcj/css-element-queries) by Marc J. Schmidt. I recommend looking into these libraries for history, specifics, and more examples. I love them for the work they did, whithout which this library would not be possible. :sparkle-heart:
