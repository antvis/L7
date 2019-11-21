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

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _MenuButton = _interopRequireDefault(require("../menu/MenuButton"));

var propTypes = {
  player: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  rates: _propTypes["default"].array,
  className: _propTypes["default"].string
};
var defaultProps = {
  rates: [2, 1.5, 1.25, 1, 0.5, 0.25]
};

var PlaybackRateMenuButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(PlaybackRateMenuButton, _Component);

  function PlaybackRateMenuButton(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, PlaybackRateMenuButton);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PlaybackRateMenuButton).call(this, props, context));
    _this.handleSelectItem = _this.handleSelectItem.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(PlaybackRateMenuButton, [{
    key: "handleSelectItem",
    value: function handleSelectItem(index) {
      var _this$props = this.props,
          rates = _this$props.rates,
          actions = _this$props.actions;

      if (index >= 0 && index < rates.length) {
        actions.changeRate(rates[index]);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          rates = _this$props2.rates,
          player = _this$props2.player;
      var items = rates.map(function (rate) {
        return {
          label: "".concat(rate, "x"),
          value: rate
        };
      });
      var selectedIndex = rates.indexOf(player.playbackRate) || 0;
      return _react["default"].createElement(_MenuButton["default"], {
        className: (0, _classnames["default"])('video-react-playback-rate', this.props.className),
        onSelectItem: this.handleSelectItem,
        items: items,
        selectedIndex: selectedIndex
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, "Playback Rate"), _react["default"].createElement("div", {
        className: "video-react-playback-rate-value"
      }, "".concat(player.playbackRate.toFixed(2), "x")));
    }
  }]);
  return PlaybackRateMenuButton;
}(_react.Component);

PlaybackRateMenuButton.propTypes = propTypes;
PlaybackRateMenuButton.defaultProps = defaultProps;
PlaybackRateMenuButton.displayName = 'PlaybackRateMenuButton';
var _default = PlaybackRateMenuButton;
exports["default"] = _default;