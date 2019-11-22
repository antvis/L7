"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnstyledLink = exports.FrameWrap = void 0;

var _theming = require("@storybook/theming");

var _router = require("@storybook/router");

var FrameWrap = _theming.styled.div(function (_ref) {
  var offset = _ref.offset;
  return {
    position: 'absolute',
    overflow: 'auto',
    left: 0,
    right: 0,
    bottom: 0,
    top: offset,
    zIndex: 3,
    transition: 'all 0.1s linear',
    height: "calc(100% - ".concat(offset, "px)"),
    background: 'transparent'
  };
});

exports.FrameWrap = FrameWrap;
var UnstyledLink = (0, _theming.styled)(_router.Link)({
  color: 'inherit',
  textDecoration: 'inherit',
  display: 'inline-block'
});
exports.UnstyledLink = UnstyledLink;