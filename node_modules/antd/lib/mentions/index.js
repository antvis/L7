"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _omit = _interopRequireDefault(require("omit.js"));

var React = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _rcMentions = _interopRequireDefault(require("rc-mentions"));

var _spin = _interopRequireDefault(require("../spin"));

var _configProvider = require("../config-provider");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var Option = _rcMentions["default"].Option;

function loadingFilterOption() {
  return true;
}

var Mentions =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Mentions, _React$Component);

  function Mentions() {
    var _this;

    _classCallCheck(this, Mentions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Mentions).apply(this, arguments));
    _this.state = {
      focused: false
    };

    _this.onFocus = function () {
      var onFocus = _this.props.onFocus;

      if (onFocus) {
        onFocus.apply(void 0, arguments);
      }

      _this.setState({
        focused: true
      });
    };

    _this.onBlur = function () {
      var onBlur = _this.props.onBlur;

      if (onBlur) {
        onBlur.apply(void 0, arguments);
      }

      _this.setState({
        focused: false
      });
    };

    _this.getOptions = function () {
      var _this$props = _this.props,
          children = _this$props.children,
          loading = _this$props.loading;

      if (loading) {
        return React.createElement(Option, {
          value: "ANTD_SEARCHING",
          disabled: true
        }, React.createElement(_spin["default"], {
          size: "small"
        }));
      }

      return children;
    };

    _this.getFilterOption = function () {
      var _this$props2 = _this.props,
          filterOption = _this$props2.filterOption,
          loading = _this$props2.loading;

      if (loading) {
        return loadingFilterOption;
      }

      return filterOption;
    };

    _this.saveMentions = function (node) {
      _this.rcMentions = node;
    };

    _this.renderMentions = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls,
          renderEmpty = _ref.renderEmpty;
      var focused = _this.state.focused;

      var _a = _this.props,
          customizePrefixCls = _a.prefixCls,
          className = _a.className,
          disabled = _a.disabled,
          restProps = __rest(_a, ["prefixCls", "className", "disabled"]);

      var prefixCls = getPrefixCls('mentions', customizePrefixCls);
      var mentionsProps = (0, _omit["default"])(restProps, ['loading']);
      var mergedClassName = (0, _classnames["default"])(className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames, "".concat(prefixCls, "-focused"), focused), _classNames));
      return React.createElement(_rcMentions["default"], _extends({
        prefixCls: prefixCls,
        notFoundContent: _this.getNotFoundContent(renderEmpty),
        className: mergedClassName,
        disabled: disabled
      }, mentionsProps, {
        filterOption: _this.getFilterOption(),
        onFocus: _this.onFocus,
        onBlur: _this.onBlur,
        ref: _this.saveMentions
      }), _this.getOptions());
    };

    return _this;
  }

  _createClass(Mentions, [{
    key: "getNotFoundContent",
    value: function getNotFoundContent(renderEmpty) {
      var notFoundContent = this.props.notFoundContent;

      if (notFoundContent !== undefined) {
        return notFoundContent;
      }

      return renderEmpty('Select');
    }
  }, {
    key: "focus",
    value: function focus() {
      this.rcMentions.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.rcMentions.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderMentions);
    }
  }]);

  return Mentions;
}(React.Component);

Mentions.Option = Option;

Mentions.getMentions = function () {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var config = arguments.length > 1 ? arguments[1] : undefined;

  var _ref2 = config || {},
      _ref2$prefix = _ref2.prefix,
      prefix = _ref2$prefix === void 0 ? '@' : _ref2$prefix,
      _ref2$split = _ref2.split,
      split = _ref2$split === void 0 ? ' ' : _ref2$split;

  var prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return value.split(split).map(function () {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var hitPrefix = null;
    prefixList.some(function (prefixStr) {
      var startStr = str.slice(0, prefixStr.length);

      if (startStr === prefixStr) {
        hitPrefix = prefixStr;
        return true;
      }

      return false;
    });

    if (hitPrefix !== null) {
      return {
        prefix: hitPrefix,
        value: str.slice(hitPrefix.length)
      };
    }

    return null;
  }).filter(function (entity) {
    return !!entity && !!entity.value;
  });
};

(0, _reactLifecyclesCompat.polyfill)(Mentions);
var _default = Mentions;
exports["default"] = _default;
//# sourceMappingURL=index.js.map
