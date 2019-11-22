"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = nChildren;

var _react = _interopRequireDefault(require("react"));

var _propTypes = require("prop-types");

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function nChildren(n) {
  var propType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _propTypes.node;

  if (typeof n !== 'number' || isNaN(n) || n < 0) {
    throw new TypeError('a non-negative number is required');
  }

  var validator = function nChildrenValidator(props, propName, componentName) {
    if (propName !== 'children') {
      return new TypeError("".concat(componentName, " is using the nChildren validator on a non-children prop"));
    }

    var children = props.children;

    var childrenCount = _react["default"].Children.count(children);

    if (childrenCount !== n) {
      return new RangeError("".concat(componentName, " expects to receive ").concat(n, " children, but received ").concat(childrenCount, " children."));
    }

    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    return propType.apply(void 0, [props, propName, componentName].concat(rest));
  };

  validator.isRequired = validator;
  return (0, _wrapValidator["default"])(validator, "nChildren:".concat(n), n);
}
//# sourceMappingURL=nChildren.js.map