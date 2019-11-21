function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toTitle, UNSELECTABLE_ATTRIBUTE, UNSELECTABLE_STYLE } from '../../util';

var Selection =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Selection, _React$Component);

  function Selection() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Selection);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Selection)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "onRemove", function (event) {
      var _this$props = _this.props,
          onRemove = _this$props.onRemove,
          value = _this$props.value;
      onRemove(event, value);
      event.stopPropagation();
    });

    return _this;
  }

  _createClass(Selection, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          maxTagTextLength = _this$props2.maxTagTextLength,
          className = _this$props2.className,
          style = _this$props2.style,
          label = _this$props2.label,
          value = _this$props2.value,
          onRemove = _this$props2.onRemove,
          removeIcon = _this$props2.removeIcon;
      var content = label || value;

      if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
        content = "".concat(content.slice(0, maxTagTextLength), "...");
      }

      return React.createElement("li", _extends({
        style: _objectSpread({}, UNSELECTABLE_STYLE, style)
      }, UNSELECTABLE_ATTRIBUTE, {
        role: "menuitem",
        className: classNames("".concat(prefixCls, "-selection__choice"), className),
        title: toTitle(label)
      }), onRemove && React.createElement("span", {
        className: "".concat(prefixCls, "-selection__choice__remove"),
        onClick: this.onRemove
      }, typeof removeIcon === 'function' ? React.createElement(removeIcon, _objectSpread({}, this.props)) : removeIcon), React.createElement("span", {
        className: "".concat(prefixCls, "-selection__choice__content")
      }, content));
    }
  }]);

  return Selection;
}(React.Component);

_defineProperty(Selection, "propTypes", {
  prefixCls: PropTypes.string,
  maxTagTextLength: PropTypes.number,
  onRemove: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  removeIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
});

export default Selection;