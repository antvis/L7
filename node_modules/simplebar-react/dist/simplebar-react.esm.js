/**
 * simplebar-react - v1.2.3
 * React component for SimpleBar
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat
 * Under MIT License
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'simplebar';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function SimpleBar(_ref) {
  var children = _ref.children,
      scrollableNodeProps = _ref.scrollableNodeProps,
      options = _objectWithoutProperties(_ref, ["children", "scrollableNodeProps"]);

  return React.createElement("div", _extends({
    "data-simplebar": true
  }, options), React.createElement("div", {
    className: "simplebar-wrapper"
  }, React.createElement("div", {
    className: "simplebar-height-auto-observer-wrapper"
  }, React.createElement("div", {
    className: "simplebar-height-auto-observer"
  })), React.createElement("div", {
    className: "simplebar-mask"
  }, React.createElement("div", {
    className: "simplebar-offset"
  }, React.createElement("div", _extends({}, scrollableNodeProps, {
    className: "simplebar-content-wrapper".concat(scrollableNodeProps && scrollableNodeProps.className ? " ".concat(scrollableNodeProps.className) : '')
  }), React.createElement("div", {
    className: "simplebar-content"
  }, children)))), React.createElement("div", {
    className: "simplebar-placeholder"
  })), React.createElement("div", {
    className: "simplebar-track simplebar-horizontal"
  }, React.createElement("div", {
    className: "simplebar-scrollbar"
  })), React.createElement("div", {
    className: "simplebar-track simplebar-vertical"
  }, React.createElement("div", {
    className: "simplebar-scrollbar"
  })));
}
SimpleBar.propTypes = {
  children: PropTypes.node
};

export default SimpleBar;
