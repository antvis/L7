"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genArrProps = genArrProps;
exports.valueProp = valueProp;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var internalValProp = _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]);

function genArrProps(propType) {
  return _propTypes["default"].oneOfType([propType, _propTypes["default"].arrayOf(propType)]);
}
/**
 * Origin code check `multiple` is true when `treeCheckStrictly` & `labelInValue`.
 * But in process logic is already cover to array.
 * Check array is not necessary. Let's simplify this check logic.
 */


function valueProp() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var props = args[0],
      propName = args[1],
      Component = args[2];

  if ((0, _util.isLabelInValue)(props)) {
    var _err = genArrProps(_propTypes["default"].shape({
      label: _propTypes["default"].node,
      value: internalValProp
    })).apply(void 0, args);

    if (_err) {
      return new Error("Invalid prop `".concat(propName, "` supplied to `").concat(Component, "`. ") + "You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.");
    }

    return null;
  }

  var err = genArrProps(internalValProp).apply(void 0, args);

  if (err) {
    return new Error("Invalid prop `".concat(propName, "` supplied to `").concat(Component, "`. ") + "You should use string or [string] instead.");
  }

  return null;
}