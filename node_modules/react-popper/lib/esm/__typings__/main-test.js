import _extends from "@babel/runtime/helpers/extends";
// Please remember to update also the TypeScript test files that can
// be found under `/typings/tests` please. Thanks! 🤗
import React from 'react';
import { Manager, Reference, Popper } from '..';
export var Test = function Test() {
  var _React$createElement;

  return React.createElement(Manager, null, React.createElement(Reference, null), React.createElement(Reference, null, function (_ref) {
    var ref = _ref.ref;
    return React.createElement("div", {
      ref: ref
    });
  }), React.createElement(Popper // $FlowExpectError: should be boolean
  , (_React$createElement = {
    eventsEnabled: "foo"
  }, _React$createElement["eventsEnabled"] = true, _React$createElement.positionFixed = 2, _React$createElement["positionFixed"] = true, _React$createElement.modifiers = {
    flip: {
      enabled: 'bar',
      order: 'foo'
    }
  }, _React$createElement["modifiers"] = {
    flip: {
      enabled: false
    }
  }, _React$createElement), function (_ref2) {
    var ref = _ref2.ref,
        style = _ref2.style,
        placement = _ref2.placement,
        outOfBoundaries = _ref2.outOfBoundaries,
        scheduleUpdate = _ref2.scheduleUpdate,
        arrowProps = _ref2.arrowProps;
    return React.createElement("div", {
      ref: ref,
      style: _extends({}, style, {
        opacity: outOfBoundaries ? 0 : 1
      }),
      "data-placement": placement,
      onClick: function onClick() {
        return scheduleUpdate();
      }
    }, "Popper", React.createElement("div", {
      ref: arrowProps.ref,
      style: arrowProps.style
    }));
  }), React.createElement(Popper, null, function (_ref3) {
    var ref = _ref3.ref,
        style = _ref3.style,
        placement = _ref3.placement;
    return React.createElement("div", {
      ref: ref,
      style: style,
      "data-placement": placement
    }, "Popper");
  }));
};