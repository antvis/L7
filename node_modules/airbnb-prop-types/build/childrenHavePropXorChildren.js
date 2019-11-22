"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = childrenHavePropXorChildren;

var _react = _interopRequireDefault(require("react"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function childrenHavePropXorChildren(prop) {
  if (typeof prop !== 'string' && _typeof(prop) !== 'symbol') {
    throw new TypeError('invalid prop: must be string or symbol');
  }

  var validator = function childrenHavePropXorChildrenWithProp(_ref, _, componentName) {
    var children = _ref.children;
    var truthyChildrenCount = 0;
    var propCount = 0;
    var grandchildrenCount = 0;

    _react["default"].Children.forEach(children, function (child) {
      if (!child) {
        return;
      }

      truthyChildrenCount += 1;

      if (child.props[prop]) {
        propCount += 1;
      }

      if (_react["default"].Children.count(child.props.children)) {
        grandchildrenCount += 1;
      }
    });

    if (propCount === truthyChildrenCount && grandchildrenCount === 0 || propCount === 0 && grandchildrenCount === truthyChildrenCount || propCount === 0 && grandchildrenCount === 0) {
      return null;
    }

    return new TypeError("`".concat(componentName, "` requires children to all have prop \u201C").concat(prop, "\u201D, all have children, or all have neither."));
  };

  validator.isRequired = validator;
  return (0, _wrapValidator["default"])(validator, "childrenHavePropXorChildrenWithProp:".concat(prop), prop);
}
//# sourceMappingURL=childrenHavePropXorChildren.js.map