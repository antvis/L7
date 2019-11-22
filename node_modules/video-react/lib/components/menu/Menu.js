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

var propTypes = {
  children: _propTypes["default"].any
};

var Menu =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Menu, _Component);

  function Menu(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Menu);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Menu).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(Menu, [{
    key: "handleClick",
    value: function handleClick(event) {
      event.preventDefault(); // event.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", {
        className: "video-react-menu video-react-lock-showing",
        role: "presentation",
        onClick: this.handleClick
      }, _react["default"].createElement("ul", {
        className: "video-react-menu-content"
      }, this.props.children));
    }
  }]);
  return Menu;
}(_react.Component);

exports["default"] = Menu;
Menu.propTypes = propTypes;
Menu.displayName = 'Menu';