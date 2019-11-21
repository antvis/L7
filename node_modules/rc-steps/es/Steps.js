function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint react/no-did-mount-set-state: 0 */
import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { isFlexSupported } from './utils';

var Steps =
/*#__PURE__*/
function (_Component) {
  _inherits(Steps, _Component);

  function Steps(props) {
    var _this;

    _classCallCheck(this, Steps);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Steps).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onStepClick", function (next) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          current = _this$props.current;

      if (onChange && current !== next) {
        onChange(next);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "calcStepOffsetWidth", function () {
      if (isFlexSupported()) {
        return;
      }

      var lastStepOffsetWidth = _this.state.lastStepOffsetWidth; // Just for IE9

      var domNode = findDOMNode(_assertThisInitialized(_this));

      if (domNode.children.length > 0) {
        if (_this.calcTimeout) {
          clearTimeout(_this.calcTimeout);
        }

        _this.calcTimeout = setTimeout(function () {
          // +1 for fit edge bug of digit width, like 35.4px
          var offsetWidth = (domNode.lastChild.offsetWidth || 0) + 1; // Reduce shake bug

          if (lastStepOffsetWidth === offsetWidth || Math.abs(lastStepOffsetWidth - offsetWidth) <= 3) {
            return;
          }

          _this.setState({
            lastStepOffsetWidth: offsetWidth
          });
        });
      }
    });

    _this.state = {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
    _this.calcStepOffsetWidth = debounce(_this.calcStepOffsetWidth, 150);
    return _this;
  }

  _createClass(Steps, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.calcStepOffsetWidth();

      if (!isFlexSupported()) {
        this.setState({
          flexSupported: false
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.calcStepOffsetWidth();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.calcTimeout) {
        clearTimeout(this.calcTimeout);
      }

      if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
        this.calcStepOffsetWidth.cancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this2 = this;

      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          _this$props2$style = _this$props2.style,
          style = _this$props2$style === void 0 ? {} : _this$props2$style,
          className = _this$props2.className,
          children = _this$props2.children,
          direction = _this$props2.direction,
          type = _this$props2.type,
          labelPlacement = _this$props2.labelPlacement,
          iconPrefix = _this$props2.iconPrefix,
          status = _this$props2.status,
          size = _this$props2.size,
          current = _this$props2.current,
          progressDot = _this$props2.progressDot,
          initial = _this$props2.initial,
          icons = _this$props2.icons,
          onChange = _this$props2.onChange,
          restProps = _objectWithoutProperties(_this$props2, ["prefixCls", "style", "className", "children", "direction", "type", "labelPlacement", "iconPrefix", "status", "size", "current", "progressDot", "initial", "icons", "onChange"]);

      var isNav = type === 'navigation';
      var _this$state = this.state,
          lastStepOffsetWidth = _this$state.lastStepOffsetWidth,
          flexSupported = _this$state.flexSupported;
      var filteredChildren = React.Children.toArray(children).filter(function (c) {
        return !!c;
      });
      var lastIndex = filteredChildren.length - 1;
      var adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
      var classString = classNames(prefixCls, "".concat(prefixCls, "-").concat(direction), className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), size), _defineProperty(_classNames, "".concat(prefixCls, "-label-").concat(adjustedlabelPlacement), direction === 'horizontal'), _defineProperty(_classNames, "".concat(prefixCls, "-dot"), !!progressDot), _defineProperty(_classNames, "".concat(prefixCls, "-navigation"), isNav), _defineProperty(_classNames, "".concat(prefixCls, "-flex-not-supported"), !flexSupported), _classNames));
      return React.createElement("div", _extends({
        className: classString,
        style: style
      }, restProps), Children.map(filteredChildren, function (child, index) {
        if (!child) {
          return null;
        }

        var stepNumber = initial + index;

        var childProps = _objectSpread({
          stepNumber: "".concat(stepNumber + 1),
          stepIndex: stepNumber,
          prefixCls: prefixCls,
          iconPrefix: iconPrefix,
          wrapperStyle: style,
          progressDot: progressDot,
          icons: icons,
          onStepClick: onChange && _this2.onStepClick
        }, child.props);

        if (!flexSupported && direction !== 'vertical') {
          if (isNav) {
            childProps.itemWidth = "".concat(100 / (lastIndex + 1), "%");
            childProps.adjustMarginRight = 0;
          } else if (index !== lastIndex) {
            childProps.itemWidth = "".concat(100 / lastIndex, "%");
            childProps.adjustMarginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1);
          }
        } // fix tail color


        if (status === 'error' && index === current - 1) {
          childProps.className = "".concat(prefixCls, "-next-error");
        }

        if (!child.props.status) {
          if (stepNumber === current) {
            childProps.status = status;
          } else if (stepNumber < current) {
            childProps.status = 'finish';
          } else {
            childProps.status = 'wait';
          }
        }

        childProps.active = stepNumber === current;
        return cloneElement(child, childProps);
      }));
    }
  }]);

  return Steps;
}(Component);

_defineProperty(Steps, "propTypes", {
  type: PropTypes.string,
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  iconPrefix: PropTypes.string,
  direction: PropTypes.string,
  labelPlacement: PropTypes.string,
  children: PropTypes.any,
  status: PropTypes.string,
  size: PropTypes.string,
  progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  style: PropTypes.object,
  initial: PropTypes.number,
  current: PropTypes.number,
  icons: PropTypes.shape({
    finish: PropTypes.node,
    error: PropTypes.node
  }),
  onChange: PropTypes.func
});

_defineProperty(Steps, "defaultProps", {
  type: 'default',
  prefixCls: 'rc-steps',
  iconPrefix: 'rc',
  direction: 'horizontal',
  labelPlacement: 'horizontal',
  initial: 0,
  current: 0,
  status: 'process',
  size: '',
  progressDot: false
});

export { Steps as default };