"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _PlaybackRateMenuButton = _interopRequireDefault(require("./PlaybackRateMenuButton"));

var _utils = require("../../utils");

var PlaybackRate =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PlaybackRate, _Component);

  function PlaybackRate(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, PlaybackRate);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PlaybackRate).call(this, props, context));
    (0, _utils.deprecatedWarning)('PlaybackRate', 'PlaybackRateMenuButton');
    return _this;
  }

  (0, _createClass2["default"])(PlaybackRate, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_PlaybackRateMenuButton["default"], this.props);
    }
  }]);
  return PlaybackRate;
}(_react.Component);

exports["default"] = PlaybackRate;
PlaybackRate.displayName = 'PlaybackRate';