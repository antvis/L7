"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _toArray = _interopRequireDefault(require("rc-util/lib/Children/toArray"));

var _KeyCode = _interopRequireDefault(require("rc-util/lib/KeyCode"));

var React = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _KeywordTrigger = _interopRequireDefault(require("./KeywordTrigger"));

var _MentionsContext = require("./MentionsContext");

var _Option = _interopRequireDefault(require("./Option"));

var _util = require("./util");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Mentions =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Mentions, _React$Component);

  function Mentions(props) {
    var _this;

    _classCallCheck(this, Mentions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Mentions).call(this, props));
    _this.focusId = undefined;

    _this.triggerChange = function (value) {
      var onChange = _this.props.onChange;

      if (!('value' in _this.props)) {
        _this.setState({
          value: value
        });
      }

      if (onChange) {
        onChange(value);
      }
    };

    _this.onChange = function (_ref) {
      var value = _ref.target.value;

      _this.triggerChange(value);
    }; // Check if hit the measure keyword


    _this.onKeyDown = function (event) {
      var which = event.which;
      var _this$state = _this.state,
          activeIndex = _this$state.activeIndex,
          measuring = _this$state.measuring; // Skip if not measuring

      if (!measuring) {
        return;
      }

      if (which === _KeyCode.default.UP || which === _KeyCode.default.DOWN) {
        // Control arrow function
        var optionLen = _this.getOptions().length;

        var offset = which === _KeyCode.default.UP ? -1 : 1;
        var newActiveIndex = (activeIndex + offset + optionLen) % optionLen;

        _this.setState({
          activeIndex: newActiveIndex
        });

        event.preventDefault();
      } else if (which === _KeyCode.default.ESC) {
        _this.stopMeasure();
      } else if (which === _KeyCode.default.ENTER) {
        // Measure hit
        var option = _this.getOptions()[activeIndex];

        _this.selectOption(option);

        event.preventDefault();
      }
    };
    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */


    _this.onKeyUp = function (event) {
      var key = event.key,
          which = event.which;
      var _this$state2 = _this.state,
          prevMeasureText = _this$state2.measureText,
          measuring = _this$state2.measuring;
      var _this$props = _this.props,
          _this$props$prefix = _this$props.prefix,
          prefix = _this$props$prefix === void 0 ? '' : _this$props$prefix,
          onSearch = _this$props.onSearch,
          validateSearch = _this$props.validateSearch;
      var target = event.target;
      var selectionStartText = (0, _util.getBeforeSelectionText)(target);

      var _getLastMeasureIndex = (0, _util.getLastMeasureIndex)(selectionStartText, prefix),
          measureIndex = _getLastMeasureIndex.location,
          measurePrefix = _getLastMeasureIndex.prefix; // Skip if match the white key list


      if ([_KeyCode.default.ESC, _KeyCode.default.UP, _KeyCode.default.DOWN, _KeyCode.default.ENTER].indexOf(which) !== -1) {
        return;
      }

      if (measureIndex !== -1) {
        var measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
        var validateMeasure = validateSearch(measureText, _this.props);
        var matchOption = !!_this.getOptions(measureText).length;

        if (validateMeasure) {
          if (key === measurePrefix || measuring || measureText !== prevMeasureText && matchOption) {
            _this.startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          _this.stopMeasure();
        }
        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */


        if (onSearch && validateMeasure) {
          onSearch(measureText, measurePrefix);
        }
      } else if (measuring) {
        _this.stopMeasure();
      }
    };

    _this.onInputFocus = function (event) {
      _this.onFocus(event);
    };

    _this.onInputBlur = function (event) {
      _this.onBlur(event);
    };

    _this.onDropdownFocus = function () {
      _this.onFocus();
    };

    _this.onDropdownBlur = function () {
      _this.onBlur();
    };

    _this.onFocus = function (event) {
      window.clearTimeout(_this.focusId);
      var isFocus = _this.state.isFocus;
      var onFocus = _this.props.onFocus;

      if (!isFocus && event && onFocus) {
        onFocus(event);
      }

      _this.setState({
        isFocus: true
      });
    };

    _this.onBlur = function (event) {
      _this.focusId = window.setTimeout(function () {
        var onBlur = _this.props.onBlur;

        _this.setState({
          isFocus: false
        });

        _this.stopMeasure();

        if (onBlur) {
          onBlur(event);
        }
      }, 0);
    };

    _this.selectOption = function (option) {
      var _this$state3 = _this.state,
          value = _this$state3.value,
          measureLocation = _this$state3.measureLocation,
          measurePrefix = _this$state3.measurePrefix;
      var _this$props2 = _this.props,
          split = _this$props2.split,
          onSelect = _this$props2.onSelect;
      var _option$value = option.value,
          mentionValue = _option$value === void 0 ? '' : _option$value;

      var _replaceWithMeasure = (0, _util.replaceWithMeasure)(value, {
        measureLocation: measureLocation,
        targetText: mentionValue,
        prefix: measurePrefix,
        selectionStart: _this.textarea.selectionStart,
        split: split
      }),
          text = _replaceWithMeasure.text,
          selectionLocation = _replaceWithMeasure.selectionLocation;

      _this.triggerChange(text);

      _this.stopMeasure(function () {
        // We need restore the selection position
        (0, _util.setInputSelection)(_this.textarea, selectionLocation);
      });

      if (onSelect) {
        onSelect(option, measurePrefix);
      }
    };

    _this.setActiveIndex = function (activeIndex) {
      _this.setState({
        activeIndex: activeIndex
      });
    };

    _this.setTextAreaRef = function (element) {
      _this.textarea = element;
    };

    _this.setMeasureRef = function (element) {
      _this.measure = element;
    };

    _this.getOptions = function (measureText) {
      var targetMeasureText = measureText || _this.state.measureText || '';
      var _this$props3 = _this.props,
          children = _this$props3.children,
          filterOption = _this$props3.filterOption;
      var list = (0, _toArray.default)(children).map(function (_ref2) {
        var props = _ref2.props;
        return props;
      }).filter(function (option) {
        /** Return all result if `filterOption` is false. */
        if (filterOption === false) {
          return true;
        }

        return filterOption(targetMeasureText, option);
      });
      return list;
    };

    _this.state = {
      value: props.defaultValue || props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false
    };
    return _this;
  }

  _createClass(Mentions, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var measuring = this.state.measuring; // Sync measure div top with textarea for rc-trigger usage

      if (measuring) {
        this.measure.scrollTop = this.textarea.scrollTop;
      }
    }
  }, {
    key: "startMeasure",
    value: function startMeasure(measureText, measurePrefix, measureLocation) {
      this.setState({
        measuring: true,
        measureText: measureText,
        measurePrefix: measurePrefix,
        measureLocation: measureLocation,
        activeIndex: 0
      });
    }
  }, {
    key: "stopMeasure",
    value: function stopMeasure(callback) {
      this.setState({
        measuring: false,
        measureLocation: 0,
        measureText: null
      }, callback);
    }
  }, {
    key: "focus",
    value: function focus() {
      this.textarea.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.textarea.blur();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state4 = this.state,
          value = _this$state4.value,
          measureLocation = _this$state4.measureLocation,
          measurePrefix = _this$state4.measurePrefix,
          measuring = _this$state4.measuring,
          activeIndex = _this$state4.activeIndex;

      var _this$props4 = this.props,
          prefixCls = _this$props4.prefixCls,
          placement = _this$props4.placement,
          transitionName = _this$props4.transitionName,
          className = _this$props4.className,
          style = _this$props4.style,
          autoFocus = _this$props4.autoFocus,
          notFoundContent = _this$props4.notFoundContent,
          getPopupContainer = _this$props4.getPopupContainer,
          restProps = _objectWithoutProperties(_this$props4, ["prefixCls", "placement", "transitionName", "className", "style", "autoFocus", "notFoundContent", "getPopupContainer"]);

      var inputProps = (0, _util.omit)(restProps, 'value', 'defaultValue', 'prefix', 'split', 'children', 'validateSearch', 'filterOption', 'onSelect', 'onSearch');
      var options = measuring ? this.getOptions() : [];
      return React.createElement("div", {
        className: (0, _classnames.default)(prefixCls, className),
        style: style
      }, React.createElement("textarea", Object.assign({
        autoFocus: autoFocus,
        ref: this.setTextAreaRef,
        value: value
      }, inputProps, {
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        onKeyUp: this.onKeyUp,
        onFocus: this.onInputFocus,
        onBlur: this.onInputBlur
      })), measuring && React.createElement("div", {
        ref: this.setMeasureRef,
        className: "".concat(prefixCls, "-measure")
      }, value.slice(0, measureLocation), React.createElement(_MentionsContext.MentionsContextProvider, {
        value: {
          notFoundContent: notFoundContent,
          activeIndex: activeIndex,
          setActiveIndex: this.setActiveIndex,
          selectOption: this.selectOption,
          onFocus: this.onDropdownFocus,
          onBlur: this.onDropdownBlur
        }
      }, React.createElement(_KeywordTrigger.default, {
        prefixCls: prefixCls,
        transitionName: transitionName,
        placement: placement,
        options: options,
        visible: true,
        getPopupContainer: getPopupContainer
      }, React.createElement("span", null, measurePrefix))), value.slice(measureLocation + measurePrefix.length)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var newState = {};

      if ('value' in props && props.value !== prevState.value) {
        newState.value = props.value;
      }

      return newState;
    }
  }]);

  return Mentions;
}(React.Component);

Mentions.Option = _Option.default;
Mentions.defaultProps = {
  prefixCls: 'rc-mentions',
  prefix: '@',
  split: ' ',
  validateSearch: _util.validateSearch,
  filterOption: _util.filterOption,
  notFoundContent: 'Not Found',
  rows: 1
};
(0, _reactLifecyclesCompat.polyfill)(Mentions);
var _default = Mentions;
exports.default = _default;