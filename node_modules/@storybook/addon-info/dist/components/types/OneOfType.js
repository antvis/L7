"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _PrettyPropType = _interopRequireDefault(require("./PrettyPropType"));

var _proptypes = require("./proptypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable import/no-cycle */
var OneOfType = function OneOfType(_ref) {
  var propType = _ref.propType;
  var propTypes = (0, _proptypes.getPropTypes)(propType);
  return _react["default"].createElement("span", null, propTypes.map(function (value, i) {
    var key = "".concat(value.name).concat(value.value ? "-".concat(value.value) : '');
    return [_react["default"].createElement(_PrettyPropType["default"], {
      key: key,
      propType: value
    }), i < propTypes.length - 1 ? _react["default"].createElement("span", {
      key: "".concat(key, "-separator")
    }, " | ") : null];
  }).reduce(function (acc, tuple) {
    return acc.concat(tuple);
  }, []));
};

OneOfType.propTypes = {
  propType: _proptypes.TypeInfo.isRequired
};
var _default = OneOfType;
exports["default"] = _default;