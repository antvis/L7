"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Interaction", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "getInteraction", {
  enumerable: true,
  get: function get() {
    return _factory.getInteraction;
  }
});
Object.defineProperty(exports, "registerInteraction", {
  enumerable: true,
  get: function get() {
    return _factory.registerInteraction;
  }
});

var _base = _interopRequireDefault(require("./base"));

var _active = _interopRequireDefault(require("./active"));

var _select = _interopRequireDefault(require("./select"));

var _hash = _interopRequireDefault(require("./hash"));

var _factory = require("./factory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _factory.registerInteraction)('active', _active["default"]);
(0, _factory.registerInteraction)('select', _select["default"]);
(0, _factory.registerInteraction)('hash', _hash["default"]);