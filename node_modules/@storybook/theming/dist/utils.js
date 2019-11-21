"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.darkenColor = exports.lightenColor = exports.mkColor = void 0;

var _polished = require("polished");

var _clientLogger = require("@storybook/client-logger");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var mkColor = function mkColor(color) {
  return {
    color: color
  };
}; // Check if it is a string. This is for the sake of warning users
// and the successive guarding logics that use String methods.


exports.mkColor = mkColor;

var isColorString = function isColorString(color) {
  if (typeof color !== 'string') {
    _clientLogger.logger.warn("Color passed to theme object should be a string. Instead " + "".concat(color, "(").concat(_typeof(color), ") was passed."));

    return false;
  }

  return true;
}; // Passing arguments that can't be converted to RGB such as linear-gradient
// to library polished's functions such as lighten or darken throws the error
// that crashes the entire storybook. It needs to be guarded when arguments
// of those functions are from user input.


var isValidColorForPolished = function isValidColorForPolished(color) {
  return !/(gradient|var|calc)/.test(color);
};

var applyPolished = function applyPolished(type, color) {
  if (type === 'darken') {
    return (0, _polished.rgba)("".concat((0, _polished.darken)(1, color)), 0.95);
  }

  if (type === 'lighten') {
    return (0, _polished.rgba)("".concat((0, _polished.lighten)(1, color)), 0.95);
  }

  return color;
};

var colorFactory = function colorFactory(type) {
  return function (color) {
    if (!isColorString(color)) {
      return color;
    }

    if (!isValidColorForPolished(color)) {
      return color;
    } // Guard anything that is not working with polished.


    try {
      return applyPolished(type, color);
    } catch (error) {
      return color;
    }
  };
};

var lightenColor = colorFactory('lighten');
exports.lightenColor = lightenColor;
var darkenColor = colorFactory('darken');
exports.darkenColor = darkenColor;