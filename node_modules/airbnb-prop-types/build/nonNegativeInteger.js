"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _and = _interopRequireDefault(require("./and"));

var _integer = _interopRequireDefault(require("./integer"));

var _nonNegativeNumber = _interopRequireDefault(require("./nonNegativeNumber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = (0, _and["default"])([(0, _integer["default"])(), (0, _nonNegativeNumber["default"])()], 'nonNegativeInteger');

exports["default"] = _default;
//# sourceMappingURL=nonNegativeInteger.js.map