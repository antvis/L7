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

var propTypes = {
  item: _propTypes["default"].object,
  index: _propTypes["default"].number,
  activateIndex: _propTypes["default"].number,
  onSelectItem: _propTypes["default"].func
};

var MenuItem =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(MenuItem, _Component);

  function MenuItem(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, MenuItem);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MenuItem).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(MenuItem, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          index = _this$props.index,
          onSelectItem = _this$props.onSelectItem;
      onSelectItem(index);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          item = _this$props2.item,
          index = _this$props2.index,
          activateIndex = _this$props2.activateIndex;
      return _react["default"].createElement("li", {
        className: (0, _classnames["default"])({
          'video-react-menu-item': true,
          'video-react-selected': index === activateIndex
        }),
        role: "menuitem",
        onClick: this.handleClick
      }, item.label, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }));
    }
  }]);
  return MenuItem;
}(_react.Component);

exports["default"] = MenuItem;
MenuItem.propTypes = propTypes;
MenuItem.displayName = 'MenuItem';