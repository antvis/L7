function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import KeyCode from "rc-util/es/KeyCode";
import { getOffsetLeft } from './util';
import Star from './Star';

function noop() {}

var Rate =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Rate, _React$Component);

  function Rate(props) {
    var _this;

    _classCallCheck(this, Rate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Rate).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onHover", function (event, index) {
      var onHoverChange = _this.props.onHoverChange;

      var hoverValue = _this.getStarValue(index, event.pageX);

      var cleanedValue = _this.state.cleanedValue;

      if (hoverValue !== cleanedValue) {
        _this.setState({
          hoverValue: hoverValue,
          cleanedValue: null
        });
      }

      onHoverChange(hoverValue);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMouseLeave", function () {
      var onHoverChange = _this.props.onHoverChange;

      _this.setState({
        hoverValue: undefined,
        cleanedValue: null
      });

      onHoverChange(undefined);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClick", function (event, index) {
      var allowClear = _this.props.allowClear;
      var value = _this.state.value;

      var newValue = _this.getStarValue(index, event.pageX);

      var isReset = false;

      if (allowClear) {
        isReset = newValue === value;
      }

      _this.onMouseLeave(true);

      _this.changeValue(isReset ? 0 : newValue);

      _this.setState({
        cleanedValue: isReset ? newValue : null
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onFocus", function () {
      var onFocus = _this.props.onFocus;

      _this.setState({
        focused: true
      });

      if (onFocus) {
        onFocus();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onBlur", function () {
      var onBlur = _this.props.onBlur;

      _this.setState({
        focused: false
      });

      if (onBlur) {
        onBlur();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyDown", function (event) {
      var keyCode = event.keyCode;
      var _this$props = _this.props,
          count = _this$props.count,
          allowHalf = _this$props.allowHalf,
          onKeyDown = _this$props.onKeyDown;
      var value = _this.state.value;

      if (keyCode === KeyCode.RIGHT && value < count) {
        if (allowHalf) {
          value += 0.5;
        } else {
          value += 1;
        }

        _this.changeValue(value);

        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && value > 0) {
        if (allowHalf) {
          value -= 0.5;
        } else {
          value -= 1;
        }

        _this.changeValue(value);

        event.preventDefault();
      }

      if (onKeyDown) {
        onKeyDown(event);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "saveRef", function (index) {
      return function (node) {
        _this.stars[index] = node;
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "saveRate", function (node) {
      _this.rate = node;
    });

    var _value = props.value;

    if (_value === undefined) {
      _value = props.defaultValue;
    }

    _this.stars = {};
    _this.state = {
      value: _value,
      focused: false,
      cleanedValue: null
    };
    return _this;
  }

  _createClass(Rate, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          autoFocus = _this$props2.autoFocus,
          disabled = _this$props2.disabled;

      if (autoFocus && !disabled) {
        this.focus();
      }
    }
  }, {
    key: "getStarDOM",
    value: function getStarDOM(index) {
      return ReactDOM.findDOMNode(this.stars[index]);
    }
  }, {
    key: "getStarValue",
    value: function getStarValue(index, x) {
      var allowHalf = this.props.allowHalf;
      var value = index + 1;

      if (allowHalf) {
        var starEle = this.getStarDOM(index);
        var leftDis = getOffsetLeft(starEle);
        var width = starEle.clientWidth;

        if (x - leftDis < width / 2) {
          value -= 0.5;
        }
      }

      return value;
    }
  }, {
    key: "focus",
    value: function focus() {
      var disabled = this.props.disabled;

      if (!disabled) {
        this.rate.focus();
      }
    }
  }, {
    key: "blur",
    value: function blur() {
      var disabled = this.props.disabled;

      if (!disabled) {
        this.rate.focus();
      }
    }
  }, {
    key: "changeValue",
    value: function changeValue(value) {
      var onChange = this.props.onChange;

      if (!('value' in this.props)) {
        this.setState({
          value: value
        });
      }

      onChange(value);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          count = _this$props3.count,
          allowHalf = _this$props3.allowHalf,
          style = _this$props3.style,
          prefixCls = _this$props3.prefixCls,
          disabled = _this$props3.disabled,
          className = _this$props3.className,
          character = _this$props3.character,
          characterRender = _this$props3.characterRender,
          tabIndex = _this$props3.tabIndex;
      var _this$state = this.state,
          value = _this$state.value,
          hoverValue = _this$state.hoverValue,
          focused = _this$state.focused;
      var stars = [];
      var disabledClass = disabled ? "".concat(prefixCls, "-disabled") : '';

      for (var index = 0; index < count; index++) {
        stars.push(React.createElement(Star, {
          ref: this.saveRef(index),
          index: index,
          count: count,
          disabled: disabled,
          prefixCls: "".concat(prefixCls, "-star"),
          allowHalf: allowHalf,
          value: hoverValue === undefined ? value : hoverValue,
          onClick: this.onClick,
          onHover: this.onHover,
          key: index,
          character: character,
          characterRender: characterRender,
          focused: focused
        }));
      }

      return React.createElement("ul", {
        className: classNames(prefixCls, disabledClass, className),
        style: style,
        onMouseLeave: disabled ? null : this.onMouseLeave,
        tabIndex: disabled ? -1 : tabIndex,
        onFocus: disabled ? null : this.onFocus,
        onBlur: disabled ? null : this.onBlur,
        onKeyDown: disabled ? null : this.onKeyDown,
        ref: this.saveRate,
        role: "radiogroup"
      }, stars);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, state) {
      if ('value' in nextProps && nextProps.value !== undefined) {
        return _objectSpread({}, state, {
          value: nextProps.value
        });
      }

      return state;
    }
  }]);

  return Rate;
}(React.Component);

_defineProperty(Rate, "propTypes", {
  disabled: PropTypes.bool,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  count: PropTypes.number,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  style: PropTypes.object,
  prefixCls: PropTypes.string,
  onChange: PropTypes.func,
  onHoverChange: PropTypes.func,
  className: PropTypes.string,
  character: PropTypes.node,
  characterRender: PropTypes.func,
  tabIndex: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  autoFocus: PropTypes.bool
});

_defineProperty(Rate, "defaultProps", {
  defaultValue: 0,
  count: 5,
  allowHalf: false,
  allowClear: true,
  style: {},
  prefixCls: 'rc-rate',
  onChange: noop,
  character: '★',
  onHoverChange: noop,
  tabIndex: 0
});

polyfill(Rate);
export default Rate;