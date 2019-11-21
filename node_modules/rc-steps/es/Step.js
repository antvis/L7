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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function isString(str) {
  return typeof str === 'string';
}

var Step =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Step, _React$Component);

  function Step() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Step);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Step)).call.apply(_getPrototypeOf2, [this].concat(_args)));

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onStepClick = _this$props.onStepClick,
          stepIndex = _this$props.stepIndex;

      if (onClick) {
        onClick.apply(void 0, arguments);
      }

      onStepClick(stepIndex);
    });

    return _this;
  }

  _createClass(Step, [{
    key: "renderIconNode",
    value: function renderIconNode() {
      var _classNames;

      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          progressDot = _this$props2.progressDot,
          stepNumber = _this$props2.stepNumber,
          status = _this$props2.status,
          title = _this$props2.title,
          description = _this$props2.description,
          icon = _this$props2.icon,
          iconPrefix = _this$props2.iconPrefix,
          icons = _this$props2.icons;
      var iconNode;
      var iconClassName = classNames("".concat(prefixCls, "-icon"), "".concat(iconPrefix, "icon"), (_classNames = {}, _defineProperty(_classNames, "".concat(iconPrefix, "icon-").concat(icon), icon && isString(icon)), _defineProperty(_classNames, "".concat(iconPrefix, "icon-check"), !icon && status === 'finish' && icons && !icons.finish), _defineProperty(_classNames, "".concat(iconPrefix, "icon-close"), !icon && status === 'error' && icons && !icons.error), _classNames));
      var iconDot = React.createElement("span", {
        className: "".concat(prefixCls, "-icon-dot")
      }); // `progressDot` enjoy the highest priority

      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = React.createElement("span", {
            className: "".concat(prefixCls, "-icon")
          }, progressDot(iconDot, {
            index: stepNumber - 1,
            status: status,
            title: title,
            description: description
          }));
        } else {
          iconNode = React.createElement("span", {
            className: "".concat(prefixCls, "-icon")
          }, iconDot);
        }
      } else if (icon && !isString(icon)) {
        iconNode = React.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, icon);
      } else if (icons && icons.finish && status === 'finish') {
        iconNode = React.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, icons.finish);
      } else if (icons && icons.error && status === 'error') {
        iconNode = React.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, icons.error);
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = React.createElement("span", {
          className: iconClassName
        });
      } else {
        iconNode = React.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, stepNumber);
      }

      return iconNode;
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames2;

      var _this$props3 = this.props,
          className = _this$props3.className,
          prefixCls = _this$props3.prefixCls,
          style = _this$props3.style,
          itemWidth = _this$props3.itemWidth,
          active = _this$props3.active,
          _this$props3$status = _this$props3.status,
          status = _this$props3$status === void 0 ? 'wait' : _this$props3$status,
          iconPrefix = _this$props3.iconPrefix,
          icon = _this$props3.icon,
          wrapperStyle = _this$props3.wrapperStyle,
          adjustMarginRight = _this$props3.adjustMarginRight,
          stepNumber = _this$props3.stepNumber,
          disabled = _this$props3.disabled,
          description = _this$props3.description,
          title = _this$props3.title,
          subTitle = _this$props3.subTitle,
          progressDot = _this$props3.progressDot,
          tailContent = _this$props3.tailContent,
          icons = _this$props3.icons,
          stepIndex = _this$props3.stepIndex,
          onStepClick = _this$props3.onStepClick,
          onClick = _this$props3.onClick,
          restProps = _objectWithoutProperties(_this$props3, ["className", "prefixCls", "style", "itemWidth", "active", "status", "iconPrefix", "icon", "wrapperStyle", "adjustMarginRight", "stepNumber", "disabled", "description", "title", "subTitle", "progressDot", "tailContent", "icons", "stepIndex", "onStepClick", "onClick"]);

      var classString = classNames("".concat(prefixCls, "-item"), "".concat(prefixCls, "-item-").concat(status), className, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-item-custom"), icon), _defineProperty(_classNames2, "".concat(prefixCls, "-item-active"), active), _defineProperty(_classNames2, "".concat(prefixCls, "-item-disabled"), disabled === true), _classNames2));

      var stepItemStyle = _objectSpread({}, style);

      if (itemWidth) {
        stepItemStyle.width = itemWidth;
      }

      if (adjustMarginRight) {
        stepItemStyle.marginRight = adjustMarginRight;
      }

      var accessibilityProps = {};

      if (onStepClick && !disabled) {
        accessibilityProps.role = 'button';
        accessibilityProps.tabIndex = 0;
        accessibilityProps.onClick = this.onClick;
      }

      return React.createElement("div", _extends({}, restProps, {
        className: classString,
        style: stepItemStyle
      }), React.createElement("div", _extends({
        onClick: onClick
      }, accessibilityProps, {
        className: "".concat(prefixCls, "-item-container")
      }), React.createElement("div", {
        className: "".concat(prefixCls, "-item-tail")
      }, tailContent), React.createElement("div", {
        className: "".concat(prefixCls, "-item-icon")
      }, this.renderIconNode()), React.createElement("div", {
        className: "".concat(prefixCls, "-item-content")
      }, React.createElement("div", {
        className: "".concat(prefixCls, "-item-title")
      }, title, subTitle && React.createElement("div", {
        title: subTitle,
        className: "".concat(prefixCls, "-item-subtitle")
      }, subTitle)), description && React.createElement("div", {
        className: "".concat(prefixCls, "-item-description")
      }, description))));
    }
  }]);

  return Step;
}(React.Component);

_defineProperty(Step, "propTypes", {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  style: PropTypes.object,
  wrapperStyle: PropTypes.object,
  itemWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  status: PropTypes.string,
  iconPrefix: PropTypes.string,
  icon: PropTypes.node,
  adjustMarginRight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  stepNumber: PropTypes.string,
  stepIndex: PropTypes.number,
  description: PropTypes.any,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  tailContent: PropTypes.any,
  icons: PropTypes.shape({
    finish: PropTypes.node,
    error: PropTypes.node
  }),
  onClick: PropTypes.func,
  onStepClick: PropTypes.func
});

export { Step as default };