"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;
exports.deserialize = deserialize;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function serialize(input, transferables) {
  if (input === null || input === undefined || typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string' || input instanceof Boolean || input instanceof Number || input instanceof String || input instanceof Date || input instanceof RegExp) {
    return input;
  }

  if (input instanceof ArrayBuffer) {
    if (transferables) {
      transferables.push(input);
    }

    return input;
  }

  if (ArrayBuffer.isView(input)) {
    var view = input;

    if (transferables) {
      transferables.push(view.buffer);
    }

    return view;
  }

  if (input instanceof ImageData) {
    if (transferables) {
      transferables.push(input.data.buffer);
    }

    return input;
  }

  if (Array.isArray(input)) {
    var serialized = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        serialized.push(serialize(item, transferables));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return serialized;
  }

  if (_typeof(input) === 'object') {
    var properties = {};

    for (var key in input) {
      if (!input.hasOwnProperty(key)) {
        continue;
      }

      var property = input[key];
      properties[key] = serialize(property, transferables);
    }

    return properties;
  }
}

function deserialize() {}