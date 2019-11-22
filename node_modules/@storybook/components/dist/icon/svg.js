"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _theming = require("@storybook/theming");

var Svg = _theming.styled.svg({
  // Fix rendering bugs in Chrome for hdpi
  shapeRendering: 'inherit',
  transform: 'translate3d(0,0,0)'
}, function (_ref) {
  var inline = _ref.inline;
  return inline ? {
    display: 'inline-block'
  } : {
    display: 'block'
  };
});

exports["default"] = Svg;
Svg.displayName = 'Svg';