# React Tooltip

[![npm version](https://img.shields.io/npm/v/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![npm downloads](https://img.shields.io/npm/dm/react-popper-tooltip.svg?style=flat-square)](https://www.npmjs.com/package/react-popper-tooltip)
[![codecov](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip/branch/master/graph/badge.svg)](https://codecov.io/gh/mohsinulhaq/react-popper-tooltip)
[![Dependency Status](https://img.shields.io/david/mohsinulhaq/react-popper-tooltip.svg?style=flat-square)](https://david-dm.org/mohsinulhaq/react-popper-tooltip)

React tooltip component based on [react-popper](https://github.com/FezVrasta/react-popper), the React wrapper around [popper.js](https://popper.js.org/) library.

## Homepage

https://react-popper-tooltip.netlify.com

## Example

https://codesandbox.io/s/pykkz77z5j

### Usage

```bash
npm install react-popper-tooltip
```

or

```bash
yarn add react-popper-tooltip
```

```jsx
import React from 'react';
import {render} from 'react-dom';
import TooltipTrigger from 'react-popper-tooltip';

const Tooltip = ({
  arrowRef,
  tooltipRef,
  getArrowProps,
  getTooltipProps,
  placement
}) => (
  <div
    {...getTooltipProps({
      ref: tooltipRef,
      className: 'tooltip-container'
      /* your props here */
    })}
  >
    <div
      {...getArrowProps({
        ref: arrowRef,
        className: 'tooltip-arrow',
        'data-placement': placement
        /* your props here */
      })}
    />
    Hello, World!
  </div>
);

const Trigger = ({getTriggerProps, triggerRef}) => (
  <span
    {...getTriggerProps({
      ref: triggerRef,
      className: 'trigger'
      /* your props here */
    })}
  >
    Click Me!
  </span>
);

render(
  <TooltipTrigger placement="right" trigger="click" tooltip={Tooltip}>
    {Trigger}
  </TooltipTrigger>,
  document.getElementById('root')
);
```

`TooltipTrigger` is the only component exposed by the package. It's just a positioning engine. What to render is left completely to the user, which can be provided using render props. Your props should be passed through `getTriggerProps`, `getTooltipProps` and `getArrowProps`.

Read more about [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) pattern if you're not familiar with this approach.

## Quick start

If you would like our opinionated container and arrow styles for your tooltip for quick start, you may import `react-popper-tooltip/dist/styles.css`, and use the classes `tooltip-container` and `tooltip-arrow` as follows:

### Tooltip.js

```jsx
import React from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

const Tooltip = ({children, tooltip, hideArrow, ...props}) => (
  <TooltipTrigger
    {...props}
    tooltip={({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement
    }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: 'tooltip-container'
        })}
      >
        {!hideArrow && (
          <div
            {...getArrowProps({
              ref: arrowRef,
              className: 'tooltip-arrow',
              'data-placement': placement
            })}
          />
        )}
        {tooltip}
      </div>
    )}
  >
    {({getTriggerProps, triggerRef}) => (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: 'trigger'
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
);

export default Tooltip;
```

Then you can use it as shown in the example below.

```jsx
<Tooltip placement="top" trigger="click" tooltip="Hi there!">
  Click me
</Tooltip>
```

## Examples

To fiddle with our example recipes, run:

```bash
> npm install
> npm run docs
```

or

```bash
> yarn
> yarn docs
```

and open up [localhost:3000](http://localhost:3000) in your browser.

## Props

### children

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children and tooltip functions](#children-and-tooltip-functions)".

### tooltip

> `function({})` | _required_

This is called with an object. Read more about the properties of this object in
the section "[Children and tooltip functions](#children-and-tooltip-functions)".

### defaultTooltipShown

> `boolean` | defaults to `false`

This is the initial visibility state of the tooltip.

### onVisibilityChange

> `function(tooltipShown: boolean)`

Called with the tooltip state, when the visibility of the tooltip changes

### tooltipShown

> `boolean` | **control prop**

Use this prop if you want to control the visibility state of the tooltip.

`react-popper-tooltip` manages its own state internally. You can use this prop to pass the
visibility state of the tooltip from the outside. You will be required to keep this state up to
date (this is where `onVisibilityChange` becomes useful), but you can also control the state
from anywhere, be that state from other components, `redux`, `react-router`, or anywhere else.

### delayShow

> `number` | defaults to `0`

Delay in showing the tooltip (ms).

### delayHide

> `number` | defaults to `0`

Delay in hiding the tooltip (ms).

### placement

> `string` | defaults to `right`

The tooltip placement. Valid placements are:

- `auto`
- `top`
- `right`
- `bottom`
- `left`

Each placement can have a variation from this list:

- `-start`
- `-end`

### trigger

> `string` or `string[]` | defaults to `"hover"`

The event(s) that trigger the tooltip. One of `click`, `right-click`, `hover`, `focus`, and `none`, or an array of them.

### getTriggerRef

> `function(HTMLElement) => void`

Function that can be used to obtain a trigger element reference.

### closeOnOutOfBoundaries

> `boolean` | defaults to `true`

Whether to close the tooltip when it's trigger is out of the boundary.

### usePortal

> `boolean` | defaults to `true`

Whether to use `React.createPortal` for creating tooltip.

### portalContainer

> `HTMLElement` | defaults to `document.body`

Element to be used as portal container

### followCursor

> `boolean` | defaults to `false`

Whether to spawn the tooltip at the cursor position.

Recommended usage with hover trigger and no arrow element

### modifiers

> `object`

Modifiers passed directly to the underlying popper.js instance.
For more information, refer to Popper.js’
[modifier docs](https://popper.js.org/popper-documentation.html#modifiers)

Modifiers, applied by default:

```
{
  preventOverflow: {
    boundariesElement: 'viewport'
  }
}
```

## Children and tooltip functions

This is where you render whatever you want. `react-popper-tooltip` uses two render props `children`
and `tooltip`. `Children` prop is used to trigger the appearance of the tooltip and `tooltip`
displays the tooltip itself.

You use it like so:

```jsx
const tooltip = (
  <TooltipTrigger tooltip={tooltip => <div>{/* more jsx here */}</div>}>
    {trigger => <div>{/* more jsx here */}</div>}
  </TooltipTrigger>
);
```

### prop getters

> See [the blog post about prop getters](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)

These functions are used to apply props to the elements that you render.
It's advisable to pass all your props to that function rather than applying them on the element
yourself to avoid your props being overridden (or overriding the props returned). For example
`<button {...getTriggerProps({onClick: event => console.log(event))}>Click me</button>`

### children function

| property        | type           | description                                                           |
| --------------- | -------------- | --------------------------------------------------------------------- |
| triggerRef      | `function ref` | returns the react ref you should apply to the trigger element.        |
| getTriggerProps | `function({})` | returns the props you should apply to the trigger element you render. |

### tooltip function

| property        | type           | description                                                           |
| --------------- | -------------- | --------------------------------------------------------------------- |
| arrowRef        | `function ref` | return the react ref you should apply to the tooltip arrow element.   |
| tooltipRef      | `function ref` | return the react ref you should apply to the tooltip element.         |
| getArrowProps   | `function({})` | return the props you should apply to the tooltip arrow element.       |
| getTooltipProps | `function({})` | returns the props you should apply to the tooltip element you render. |
| placement       | `string`       | return the dynamic placement of the tooltip.                          |

## Inspiration and Thanks!

This library is based on [react-popper](https://github.com/FezVrasta/react-popper), the official
react wrapper around [Popper.js](https://popper.js.org).

Using of render props, prop getters and doc style of this library are heavily inspired by
[downshift](https://github.com/paypal/downshift).
