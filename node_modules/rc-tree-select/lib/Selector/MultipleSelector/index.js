"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.multipleSelectorContextTypes = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BaseSelector = _interopRequireWildcard(require("../../Base/BaseSelector"));

var _util = require("../../util");

var _SelectorList = _interopRequireDefault(require("./SelectorList"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var Selector = (0, _BaseSelector["default"])('multiple');
var multipleSelectorContextTypes = {
  onMultipleSelectorRemove: _propTypes["default"].func.isRequired
};
exports.multipleSelectorContextTypes = multipleSelectorContextTypes;

var MultipleSelector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MultipleSelector, _React$Component);

  function MultipleSelector() {
    var _this;

    _classCallCheck(this, MultipleSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MultipleSelector).call(this));

    _defineProperty(_assertThisInitialized(_this), "onPlaceholderClick", function () {
      _this.inputRef.current.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "focus", function () {
      _this.inputRef.current.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "blur", function () {
      _this.inputRef.current.blur();
    });

    _defineProperty(_assertThisInitialized(_this), "renderPlaceholder", function () {
      var _this$props = _this.props,
          prefixCls = _this$props.prefixCls,
          placeholder = _this$props.placeholder,
          searchPlaceholder = _this$props.searchPlaceholder,
          searchValue = _this$props.searchValue,
          selectorValueList = _this$props.selectorValueList;
      var currentPlaceholder = placeholder || searchPlaceholder;
      if (!currentPlaceholder) return null;
      var hidden = searchValue || selectorValueList.length; // [Legacy] Not remove the placeholder

      return _react["default"].createElement("span", {
        style: {
          display: hidden ? 'none' : 'block'
        },
        onClick: _this.onPlaceholderClick,
        className: "".concat(prefixCls, "-search__field__placeholder")
      }, currentPlaceholder);
    });

    _defineProperty(_assertThisInitialized(_this), "renderSelection", function () {
      var onMultipleSelectorRemove = _this.context.rcTreeSelect.onMultipleSelectorRemove;
      return _react["default"].createElement(_SelectorList["default"], _extends({}, _this.props, {
        onMultipleSelectorRemove: onMultipleSelectorRemove,
        inputRef: _this.inputRef
      }));
    });

    _this.inputRef = (0, _util.createRef)();
    return _this;
  }

  _createClass(MultipleSelector, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(Selector, _extends({}, this.props, {
        tabIndex: -1,
        showArrow: false,
        renderSelection: this.renderSelection,
        renderPlaceholder: this.renderPlaceholder
      }));
    }
  }]);

  return MultipleSelector;
}(_react["default"].Component);

_defineProperty(MultipleSelector, "propTypes", _objectSpread({}, _BaseSelector.selectorPropTypes, {
  selectorValueList: _propTypes["default"].array,
  disabled: _propTypes["default"].bool,
  searchValue: _propTypes["default"].string,
  labelInValue: _propTypes["default"].bool,
  maxTagCount: _propTypes["default"].number,
  maxTagPlaceholder: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func]),
  onChoiceAnimationLeave: _propTypes["default"].func
}));

_defineProperty(MultipleSelector, "contextTypes", {
  rcTreeSelect: _propTypes["default"].shape(_objectSpread({}, multipleSelectorContextTypes, {
    onSearchInputChange: _propTypes["default"].func
  }))
});

var _default = MultipleSelector;
exports["default"] = _default;