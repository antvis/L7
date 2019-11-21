"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBlockBackgroundStyle = void 0;

var getBlockBackgroundStyle = function getBlockBackgroundStyle(theme) {
  return {
    borderRadius: theme.appBorderRadius,
    background: theme.background.content,
    boxShadow: theme.base === 'light' ? 'rgba(0, 0, 0, 0.10) 0 1px 3px 0' : 'rgba(0, 0, 0, 0.20) 0 2px 5px 0',
    border: "1px solid ".concat(theme.appBorderColor)
  };
};

exports.getBlockBackgroundStyle = getBlockBackgroundStyle;