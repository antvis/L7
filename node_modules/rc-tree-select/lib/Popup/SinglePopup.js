"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BasePopup = _interopRequireDefault(require("../Base/BasePopup"));

var _SearchInput = _interopRequireDefault(require("../SearchInput"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SinglePopup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SinglePopup, _React$Component);

  function SinglePopup() {
    var _this;

    _classCallCheck(this, SinglePopup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SinglePopup).call(this));

    _defineProperty(_assertThisInitialized(_this), "onPlaceholderClick", function () {
      _this.inputRef.current.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "getTree", function () {
      return _this.popupRef.current && _this.popupRef.current.getTree();
    });

    _defineProperty(_assertThisInitialized(_this), "renderPlaceholder", function () {
      var _this$props = _this.props,
          searchPlaceholder = _this$props.searchPlaceholder,
          searchValue = _this$props.searchValue,
          prefixCls = _this$props.prefixCls;

      if (!searchPlaceholder) {
        return null;
      }

      return _react["default"].createElement("span", {
        style: {
          display: searchValue ? 'none' : 'block'
        },
        onClick: _this.onPlaceholderClick,
        className: "".concat(prefixCls, "-search__field__placeholder")
      }, searchPlaceholder);
    });

    _defineProperty(_assertThisInitialized(_this), "renderSearch", function () {
      var _this$props2 = _this.props,
          showSearch = _this$props2.showSearch,
          dropdownPrefixCls = _this$props2.dropdownPrefixCls;

      if (!showSearch) {
        return null;
      }

      return _react["default"].createElement("span", {
        ref: _this.searchRef,
        className: "".concat(dropdownPrefixCls, "-search")
      }, _react["default"].createElement(_SearchInput["default"], _extends({}, _this.props, {
        ref: _this.inputRef,
        renderPlaceholder: _this.renderPlaceholder
      })));
    });

    _this.inputRef = (0, _util.createRef)();
    _this.searchRef = (0, _util.createRef)();
    _this.popupRef = (0, _util.createRef)();
    return _this;
  }

  _createClass(SinglePopup, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_BasePopup["default"], _extends({
        ref: this.popupRef
      }, this.props, {
        renderSearch: this.renderSearch
      }));
    }
  }]);

  return SinglePopup;
}(_react["default"].Component);

_defineProperty(SinglePopup, "propTypes", _objectSpread({}, _BasePopup["default"].propTypes, {
  searchValue: _propTypes["default"].string,
  showSearch: _propTypes["default"].bool,
  dropdownPrefixCls: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  searchPlaceholder: _propTypes["default"].string
}));

var _default = SinglePopup;
exports["default"] = _default;