"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMotion = getMotion;

var _warning = _interopRequireDefault(require("rc-util/lib/warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getMotion(_ref) {
  var prefixCls = _ref.prefixCls,
      motion = _ref.motion,
      openAnimation = _ref.openAnimation,
      openTransitionName = _ref.openTransitionName;

  if (motion) {
    return motion;
  }

  if (_typeof(openAnimation) === 'object' && openAnimation) {
    (0, _warning.default)(false, 'Object type of `openAnimation` is removed. Please use `motion` instead.');
  } else if (typeof openAnimation === 'string') {
    return {
      motionName: "".concat(prefixCls, "-open-").concat(openAnimation)
    };
  }

  if (openTransitionName) {
    return {
      motionName: openTransitionName
    };
  }

  return null;
}