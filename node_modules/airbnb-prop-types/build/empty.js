"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = require("prop-types");

var _or = _interopRequireDefault(require("./or"));

var _explicitNull = _interopRequireDefault(require("./explicitNull"));

var _withShape = _interopRequireDefault(require("./withShape"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var arrayOfValidator;
var validator = (0, _or["default"])([_explicitNull["default"], // null/undefined
(0, _propTypes.oneOf)([false, '', NaN]), (0, _withShape["default"])(_propTypes.array, {
  length: (0, _propTypes.oneOf)([0]).isRequired
}).isRequired, function () {
  return arrayOfValidator.apply(void 0, arguments);
}]);
arrayOfValidator = (0, _propTypes.arrayOf)(validator).isRequired;

var _default = function _default() {
  return (0, _wrapValidator["default"])(validator, 'empty');
};

exports["default"] = _default;
//# sourceMappingURL=empty.js.map