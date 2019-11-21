function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../icon';
import CheckableTag from './CheckableTag';
import { ConfigConsumer } from '../config-provider';
import { PresetColorTypes } from '../_util/colors';
import warning from '../_util/warning';
import Wave from '../_util/wave';
var PresetColorRegex = new RegExp("^(".concat(PresetColorTypes.join('|'), ")(-inverse)?$"));

var Tag =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tag, _React$Component);

  function Tag(props) {
    var _this;

    _classCallCheck(this, Tag);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tag).call(this, props));
    _this.state = {
      visible: true
    };

    _this.handleIconClick = function (e) {
      _this.setVisible(false, e);
    };

    _this.renderTag = function (configProps) {
      var _a = _this.props,
          children = _a.children,
          otherProps = __rest(_a, ["children"]);

      var isNeedWave = 'onClick' in otherProps || children && children.type === 'a';
      var tagProps = omit(otherProps, ['onClose', 'afterClose', 'color', 'visible', 'closable', 'prefixCls']);
      return isNeedWave ? React.createElement(Wave, null, React.createElement("span", _extends({}, tagProps, {
        className: _this.getTagClassName(configProps),
        style: _this.getTagStyle()
      }), children, _this.renderCloseIcon())) : React.createElement("span", _extends({}, tagProps, {
        className: _this.getTagClassName(configProps),
        style: _this.getTagStyle()
      }), children, _this.renderCloseIcon());
    };

    warning(!('afterClose' in props), 'Tag', "'afterClose' will be deprecated, please use 'onClose', we will remove this in the next version.");
    return _this;
  }

  _createClass(Tag, [{
    key: "getTagStyle",
    value: function getTagStyle() {
      var _this$props = this.props,
          color = _this$props.color,
          style = _this$props.style;
      var isPresetColor = this.isPresetColor();
      return _extends({
        backgroundColor: color && !isPresetColor ? color : undefined
      }, style);
    }
  }, {
    key: "getTagClassName",
    value: function getTagClassName(_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls;
      var _this$props2 = this.props,
          customizePrefixCls = _this$props2.prefixCls,
          className = _this$props2.className,
          color = _this$props2.color;
      var visible = this.state.visible;
      var isPresetColor = this.isPresetColor();
      var prefixCls = getPrefixCls('tag', customizePrefixCls);
      return classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(color), isPresetColor), _defineProperty(_classNames, "".concat(prefixCls, "-has-color"), color && !isPresetColor), _defineProperty(_classNames, "".concat(prefixCls, "-hidden"), !visible), _classNames), className);
    }
  }, {
    key: "setVisible",
    value: function setVisible(visible, e) {
      var _this$props3 = this.props,
          onClose = _this$props3.onClose,
          afterClose = _this$props3.afterClose;

      if (onClose) {
        onClose(e);
      }

      if (afterClose && !onClose) {
        // next version remove.
        afterClose();
      }

      if (e.defaultPrevented) {
        return;
      }

      if (!('visible' in this.props)) {
        this.setState({
          visible: visible
        });
      }
    }
  }, {
    key: "isPresetColor",
    value: function isPresetColor() {
      var color = this.props.color;

      if (!color) {
        return false;
      }

      return PresetColorRegex.test(color);
    }
  }, {
    key: "renderCloseIcon",
    value: function renderCloseIcon() {
      var closable = this.props.closable;
      return closable ? React.createElement(Icon, {
        type: "close",
        onClick: this.handleIconClick
      }) : null;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ConfigConsumer, null, this.renderTag);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      if ('visible' in nextProps) {
        return {
          visible: nextProps.visible
        };
      }

      return null;
    }
  }]);

  return Tag;
}(React.Component);

Tag.CheckableTag = CheckableTag;
Tag.defaultProps = {
  closable: false
};
polyfill(Tag);
export default Tag;
//# sourceMappingURL=index.js.map
