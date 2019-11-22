## React Popper

[![Build Status](https://travis-ci.org/FezVrasta/react-popper.svg?branch=master)](https://travis-ci.org/FezVrasta/react-popper)
[![npm version](https://img.shields.io/npm/v/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![npm downloads](https://img.shields.io/npm/dm/react-popper.svg)](https://www.npmjs.com/package/react-popper)
[![Dependency Status](https://david-dm.org/souporserious/react-popper.svg)](https://david-dm.org/souporserious/react-popper)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Get support or discuss](https://img.shields.io/badge/chat-on_spectrum-6833F9.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyBpZD0iTGl2ZWxsb18xIiBkYXRhLW5hbWU9IkxpdmVsbG8gMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAgOCI%2BPGRlZnM%2BPHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU%2BPC9kZWZzPjx0aXRsZT5zcGVjdHJ1bTwvdGl0bGU%2BPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNSwwQy40MiwwLDAsLjYzLDAsMy4zNGMwLDEuODQuMTksMi43MiwxLjc0LDMuMWgwVjcuNThhLjQ0LjQ0LDAsMCwwLC42OC4zNUw0LjM1LDYuNjlINWM0LjU4LDAsNS0uNjMsNS0zLjM1UzkuNTgsMCw1LDBaTTIuODMsNC4xOGEuNjMuNjMsMCwxLDEsLjY1LS42M0EuNjQuNjQsMCwwLDEsMi44Myw0LjE4Wk01LDQuMThhLjYzLjYzLDAsMSwxLC42NS0uNjNBLjY0LjY0LDAsMCwxLDUsNC4xOFptMi4xNywwYS42My42MywwLDEsMSwuNjUtLjYzQS42NC42NCwwLDAsMSw3LjE3LDQuMThaIi8%2BPC9zdmc%2B)](https://spectrum.chat/popper-js/react-popper)

React wrapper around [Popper.js](https://popper.js.org).

**important note:** popper.js is **not** a tooltip library, it's a _positioning engine_ to be used to build features such as (but not restricted to) tooltips.

## Install

Via package managers:

```bash
npm install react-popper --save
# or
yarn add react-popper
```

Via `script` tag (UMD library exposed as `ReactPopper`):

```html
<script src="https://unpkg.com/react-popper/dist/index.umd.js"></script>
```

## Usage

> Using `react-popper@0.x`? You can find its documentation [clicking here](https://github.com/souporserious/react-popper/tree/v0.x)

Example:

```jsx
import { Manager, Reference, Popper } from 'react-popper';

const Example = () => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <button type="button" ref={ref}>
          Reference element
        </button>
      )}
    </Reference>
    <Popper placement="right">
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          Popper element
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  </Manager>
);
```

`react-popper` makes use of a React pattern called **"render prop"**, if you are not
familiar with it, please read more [on the official React documentation](https://reactjs.org/docs/render-props.html).

> Using React <=15 or Preact? The components created with them don't support to return
> [fragments](https://reactjs.org/docs/fragments.html), this means that you will need to
> wrap `<Reference />` and `<Popper />` into a single, common, `<div />` to make `react-popper` work.

### API documentation

The `Manager` component is a simple wrapper that needs to surround all the other `react-popper` components in order
to make them communicate with each others.

The `Popper` component accepts the properties `children`, `placement`, `modifiers`, `eventsEnabled` and `positionFixed`.

```jsx
<Popper
  innerRef={(node) => this.popperNode = node}
  placement="right"
  modifiers={{ preventOverflow: { enabled: false } }}
  eventsEnabled={true}
  positionFixed={false}
>
    { props => [...] }
</Popper>
```

##### `children`

```js
children: ({|
  ref: (?HTMLElement) => void,
  style: { [string]: string | number },
  placement: ?Placement,
  outOfBoundaries: ?boolean,
  scheduleUpdate: () => void,
  arrowProps: {
    ref: (?HTMLElement) => void,
    style: { [string]: string | number },
  },
|}) => Node
```

A function (render prop) that takes as argument an object containing the following properties:

- **`ref`**: used to retrieve the [React refs](https://reactjs.org/docs/refs-and-the-dom.html) of the **popper** element.
- **`style`**: contains the necessary CSS styles (React CSS properties) which are computed by Popper.js to correctly position the **popper** element.
- **`placement`**: describes the placement of your popper after Popper.js has applied all the modifiers
  that may have flipped or altered the originally provided `placement` property. You can use this to alter the
  style of the popper and or of the arrow according to the definitive placement. For instance, you can use this
  property to orient the arrow to the right direction.
- **`outOfBoundaries`**: a boolean signifying if the popper element is overflowing its boundaries.
- **`scheduleUpdate`**: a function you can call to schedule a Popper.js position update. It will directly call the [Popper#scheduleUpdate](https://popper.js.org/popper-documentation.html#Popper.scheduleUpdate) method.
- **`arrowProps`**: an object, containing `style` and `ref` properties that are identical to the
  ones provided as the first and second arguments of `children`, but relative to the **arrow** element. The `style` property contains `left` and `top` offset values, which are used to center the arrow within the popper. These values can be merged with further custom styling and positioning. See [the demo](https://github.com/FezVrasta/react-popper/blob/8994933c430e48ab62e71495be71e4f440b48a5a/demo/styles.js#L100) for an example.

##### `innerRef`

```js
innerRef?: (?HTMLElement) => void
```

Function that can be used to obtain popper reference

##### `placement`

```js
placement?: PopperJS$Placement;
```

One of the accepted placement values listed in the [Popper.js documentation](https://popper.js.org/popper-documentation.html#Popper.placements).  
Your popper is going to be placed according to the value of this property.  
Defaults to `bottom`.

```js
outOfBoundaries: ?boolean;
```

A boolean that can be used to hide the popper element in case it's overflowing
from its boundaries. [Read more](https://popper.js.org/popper-documentation.html#modifiers..hide).

##### `eventsEnabled`

```js
eventsEnabled?: boolean;
```

Tells `react-popper` to enable or disable the [Popper.js event listeners](https://popper.js.org/popper-documentation.html#Popper.Defaults.eventsEnabled). `true` by default.

##### `positionFixed`

Set this property to `true` to tell Popper.js to use the `position: fixed` strategy
to position the popper element. By default it's false, meaning that it will use the
`position: absolute` strategy.

##### `modifiers`

```js
modifiers?: PopperJS$Modifiers;
```

An object containing custom settings for the [Popper.js modifiers](https://popper.js.org/popper-documentation.html#modifiers).  
You can use this property to override their settings or to inject your custom ones.

## Usage with `ReactDOM.createPortal`

Popper.js is smart enough to work even if the **popper** and **reference** elements aren't
in the same DOM context.  
This means that you can use [`ReactDOM.createPortal`](https://reactjs.org/docs/portals.html)
(or any pre React 16 alternative) to move the popper component somewhere else in the DOM.

This can be useful if you want to position a tooltip inside an `overflow: hidden` container
that you want to make overflow. Please note that you can also try the `positionFixed` strategy
to obtain a similar effect with less hassle.

```jsx
import { Manager, Reference, Popper } from 'react-popper';

const Example = () => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <button type="button" ref={ref}>
          Reference
        </button>
      )}
    </Reference>
    {ReactDOM.createPortal(
      <Popper>
        {({ placement, ref, style }) => (
          <div ref={ref} style={style} data-placement={placement}>
            Popper
          </div>
        )}
      </Popper>,
      document.querySelector('#destination')
    )}
  </Manager>
);
```

## Usage without a reference `HTMLElement`

Whenever you need to position a popper based on some arbitrary coordinates, you can provide `Popper` with a `referenceElement` property that is going to be used in place of the `referenceProps.getRef` React ref.

The `referenceElement` property must be an object with an interface compatible with an `HTMLElement` as described in the [Popper.js referenceObject documentation](https://popper.js.org/popper-documentation.html#referenceObject), this implies that you may also provide a real HTMLElement if needed.

If `referenceElement` is defined, it will take precedence over any `referenceProps.ref` provided refs.

```jsx
import { Popper } from 'react-popper';

class VirtualReference {
  getBoundingClientRect() {
    return {
      top: 10,
      left: 10,
      bottom: 20,
      right: 100,
      width: 90,
      height: 10,
    };
  }

  get clientWidth() {
    return this.getBoundingClientRect().width;
  }

  get clientHeight() {
    return this.getBoundingClientRect().height;
  }
}

// This is going to create a virtual reference element
// positioned 10px from top and left of the document
// 90px wide and 10px high
const virtualReferenceElement = new VirtualReference();

// This popper will be positioned relatively to the
// virtual reference element defined above
const Example = () => (
  <Popper referenceElement={virtualReferenceElement}>
    {({ ref, style, placement, arrowProps }) => (
      <div ref={ref} style={style} data-placement={placement}>
        Popper element
        <div ref={arrowProps.ref} style={arrowProps.style} />
      </div>
    )}
  </Popper>
);
```

## Flow and TypeScript types

This library is built with Flow but it supports TypeScript as well.

You can find the exported Flow types in `src/index.js`, and the
TypeScript definitions in `typings/react-popper.d.ts`.

## Running Locally

#### clone repo

`git clone git@github.com:FezVrasta/react-popper.git`

#### move into folder

`cd ~/react-popper`

#### install dependencies

`npm install` or `yarn`

#### run dev mode

`npm run demo:dev` or `yarn demo:dev`

#### open your browser and visit:

`http://localhost:1234/`
