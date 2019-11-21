"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.searchContextTypes = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var searchContextTypes = {
  onSearchInputChange: _propTypes["default"].func.isRequired
};
exports.searchContextTypes = searchContextTypes;

var SearchInput =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SearchInput, _React$Component);

  function SearchInput() {
    var _this;

    _classCallCheck(this, SearchInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchInput).call(this));

    _defineProperty(_assertThisInitialized(_this), "alignInputWidth", function () {
      _this.inputRef.current.style.width = "".concat(_this.mirrorInputRef.current.clientWidth, "px");
    });

    _defineProperty(_assertThisInitialized(_this), "focus", function (isDidMount) {
      if (_this.inputRef.current) {
        _this.inputRef.current.focus();

        if (isDidMount) {
          setTimeout(function () {
            _this.inputRef.current.focus();
          }, 0);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "blur", function () {
      if (_this.inputRef.current) {
        _this.inputRef.current.blur();
      }
    });

    _this.inputRef = (0, _util.createRef)();
    _this.mirrorInputRef = (0, _util.createRef)();
    return _this;
  }

  _createClass(SearchInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          open = _this$props.open,
          needAlign = _this$props.needAlign;

      if (needAlign) {
        this.alignInputWidth();
      }

      if (open) {
        this.focus(true);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          open = _this$props2.open,
          searchValue = _this$props2.searchValue,
          needAlign = _this$props2.needAlign;

      if (open && prevProps.open !== open) {
        this.focus();
      }

      if (needAlign && searchValue !== prevProps.searchValue) {
        this.alignInputWidth();
      }
    }
    /**
     * `scrollWidth` is not correct in IE, do the workaround.
     * ref: https://github.com/react-component/tree-select/issues/65
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          searchValue = _this$props3.searchValue,
          prefixCls = _this$props3.prefixCls,
          disabled = _this$props3.disabled,
          renderPlaceholder = _this$props3.renderPlaceholder,
          open = _this$props3.open,
          ariaId = _this$props3.ariaId;
      var _this$context$rcTreeS = this.context.rcTreeSelect,
          onSearchInputChange = _this$context$rcTreeS.onSearchInputChange,
          onSearchInputKeyDown = _this$context$rcTreeS.onSearchInputKeyDown;
      return _react["default"].createElement("span", {
        className: "".concat(prefixCls, "-search__field__wrap")
      }, _react["default"].createElement("input", {
        type: "text",
        ref: this.inputRef,
        onChange: onSearchInputChange,
        onKeyDown: onSearchInputKeyDown,
        value: searchValue,
        disabled: disabled,
        className: "".concat(prefixCls, "-search__field"),
        "aria-label": "filter select",
        "aria-autocomplete": "list",
        "aria-controls": open ? ariaId : undefined,
        "aria-multiline": "false"
      }), _react["default"].createElement("span", {
        ref: this.mirrorInputRef,
        className: "".concat(prefixCls, "-search__field__mirror")
      }, searchValue, "\xA0"), renderPlaceholder ? renderPlaceholder() : null);
    }
  }]);

  return SearchInput;
}(_react["default"].Component);

_defineProperty(SearchInput, "propTypes", {
  open: _propTypes["default"].bool,
  searchValue: _propTypes["default"].string,
  prefixCls: _propTypes["default"].string,
  disabled: _propTypes["default"].bool,
  renderPlaceholder: _propTypes["default"].func,
  needAlign: _propTypes["default"].bool,
  ariaId: _propTypes["default"].string
});

_defineProperty(SearchInput, "contextTypes", {
  rcTreeSelect: _propTypes["default"].shape(_objectSpread({}, searchContextTypes))
});

(0, _reactLifecyclesCompat.polyfill)(SearchInput);
var _default = SearchInput;
exports["default"] = _default;