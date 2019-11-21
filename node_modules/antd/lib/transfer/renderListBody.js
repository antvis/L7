"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.OmitProps = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _rcAnimate = _interopRequireDefault(require("rc-animate"));

var _raf = _interopRequireDefault(require("../_util/raf"));

var _type = require("../_util/type");

var _ListItem = _interopRequireDefault(require("./ListItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OmitProps = (0, _type.tuple)('handleFilter', 'handleSelect', 'handleSelectAll', 'handleClear', 'body', 'checkedKeys');
exports.OmitProps = OmitProps;

var ListBody =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ListBody, _React$Component);

  function ListBody() {
    var _this;

    _classCallCheck(this, ListBody);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ListBody).apply(this, arguments));
    _this.state = {
      mounted: false
    };

    _this.onItemSelect = function (item) {
      var _this$props = _this.props,
          onItemSelect = _this$props.onItemSelect,
          selectedKeys = _this$props.selectedKeys;
      var checked = selectedKeys.indexOf(item.key) >= 0;
      onItemSelect(item.key, !checked);
    };

    return _this;
  }

  _createClass(ListBody, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.mountId = (0, _raf["default"])(function () {
        _this2.setState({
          mounted: true
        });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props2 = this.props,
          filteredRenderItems = _this$props2.filteredRenderItems,
          lazy = _this$props2.lazy;

      if (prevProps.filteredRenderItems.length !== filteredRenderItems.length && lazy !== false) {
        // TODO: Replace this with ref when react 15 support removed.
        var container = (0, _reactDom.findDOMNode)(this);

        _raf["default"].cancel(this.lazyId);

        this.lazyId = (0, _raf["default"])(function () {
          if (container) {
            var scrollEvent = new Event('scroll', {
              bubbles: true
            });
            container.dispatchEvent(scrollEvent);
          }
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _raf["default"].cancel(this.mountId);

      _raf["default"].cancel(this.lazyId);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var mounted = this.state.mounted;
      var _this$props3 = this.props,
          prefixCls = _this$props3.prefixCls,
          onScroll = _this$props3.onScroll,
          filteredRenderItems = _this$props3.filteredRenderItems,
          lazy = _this$props3.lazy,
          selectedKeys = _this$props3.selectedKeys,
          globalDisabled = _this$props3.disabled;
      return React.createElement(_rcAnimate["default"], {
        component: "ul",
        componentProps: {
          onScroll: onScroll
        },
        className: "".concat(prefixCls, "-content"),
        transitionName: mounted ? "".concat(prefixCls, "-content-item-highlight") : '',
        transitionLeave: false
      }, filteredRenderItems.map(function (_ref) {
        var renderedEl = _ref.renderedEl,
            renderedText = _ref.renderedText,
            item = _ref.item;
        var disabled = item.disabled;
        var checked = selectedKeys.indexOf(item.key) >= 0;
        return React.createElement(_ListItem["default"], {
          disabled: globalDisabled || disabled,
          key: item.key,
          item: item,
          lazy: lazy,
          renderedText: renderedText,
          renderedEl: renderedEl,
          checked: checked,
          prefixCls: prefixCls,
          onClick: _this3.onItemSelect
        });
      }));
    }
  }]);

  return ListBody;
}(React.Component);

var ListBodyWrapper = function ListBodyWrapper(props) {
  return React.createElement(ListBody, props);
};

var _default = ListBodyWrapper;
exports["default"] = _default;
//# sourceMappingURL=renderListBody.js.map
