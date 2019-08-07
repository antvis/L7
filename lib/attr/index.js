"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _color = _interopRequireDefault(require("./color"));

var _size = _interopRequireDefault(require("./size"));

var _opacity = _interopRequireDefault(require("./opacity"));

var _shape = _interopRequireDefault(require("./shape"));

var _position = _interopRequireDefault(require("./position"));

var _symbol = _interopRequireDefault(require("./symbol"));

var _filter = _interopRequireDefault(require("./filter"));

var _pattern = _interopRequireDefault(require("./pattern"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_base["default"].Color = _color["default"];
_base["default"].Size = _size["default"];
_base["default"].Opacity = _opacity["default"];
_base["default"].Shape = _shape["default"];
_base["default"].Position = _position["default"];
_base["default"].Symbol = _symbol["default"];
_base["default"].Filter = _filter["default"];
_base["default"].Pattern = _pattern["default"];
var _default = _base["default"];
exports["default"] = _default;