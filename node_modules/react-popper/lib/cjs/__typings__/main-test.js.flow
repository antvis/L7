// @flow

// Please remember to update also the TypeScript test files that can
// be found under `/typings/tests` please. Thanks! 🤗

import React from 'react';
import { Manager, Reference, Popper } from '..';

export const Test = () => (
  <Manager>
    {/* $FlowExpectError: empty children */}
    <Reference />
    <Reference>{({ ref }) => <div ref={ref} />}</Reference>
    <Popper
      // $FlowExpectError: should be boolean
      eventsEnabled="foo"
      eventsEnabled
      // $FlowExpectError: should be boolean
      positionFixed={2}
      positionFixed
      // $FlowExpectError: enabled should be boolean, order number
      modifiers={{ flip: { enabled: 'bar', order: 'foo' } }}
      modifiers={{ flip: { enabled: false } }}
    >
      {({
        ref,
        style,
        placement,
        outOfBoundaries,
        scheduleUpdate,
        arrowProps,
      }) => (
        <div
          ref={ref}
          style={{ ...style, opacity: outOfBoundaries ? 0 : 1 }}
          data-placement={placement}
          onClick={() => scheduleUpdate()}
        >
          Popper
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
    <Popper>
      {({ ref, style, placement }) => (
        <div ref={ref} style={style} data-placement={placement}>
          Popper
        </div>
      )}
    </Popper>
  </Manager>
);
