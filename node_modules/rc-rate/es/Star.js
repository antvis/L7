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
import PropTypes from 'prop-types';

var Star =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Star, _React$Component);

  function Star() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Star);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Star)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onHover", function (e) {
      var _this$props = _this.props,
          onHover = _this$props.onHover,
          index = _this$props.index;
      onHover(e, index);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClick", function (e) {
      var _this$props2 = _this.props,
          onClick = _this$props2.onClick,
          index = _this$props2.index;
      onClick(e, index);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onKeyDown", function (e) {
      var _this$props3 = _this.props,
          onClick = _this$props3.onClick,
          index = _this$props3.index;

      if (e.keyCode === 13) {
        onClick(e, index);
      }
    });

    return _this;
  }

  _createClass(Star, [{
    key: "getClassName",
    value: function getClassName() {
      var _this$props4 = this.props,
          prefixCls = _this$props4.prefixCls,
          index = _this$props4.index,
          value = _this$props4.value,
          allowHalf = _this$props4.allowHalf,
          focused = _this$props4.focused;
      var starValue = index + 1;
      var className = prefixCls;

      if (value === 0 && index === 0 && focused) {
        className += " ".concat(prefixCls, "-focused");
      } else if (allowHalf && value + 0.5 === starValue) {
        className += " ".concat(prefixCls, "-half ").concat(prefixCls, "-active");

        if (focused) {
          className += " ".concat(prefixCls, "-focused");
        }
      } else {
        className += starValue <= value ? " ".concat(prefixCls, "-full") : " ".concat(prefixCls, "-zero");

        if (starValue === value && focused) {
          className += " ".concat(prefixCls, "-focused");
        }
      }

      return className;
    }
  }, {
    key: "render",
    value: function render() {
      var onHover = this.onHover,
          onClick = this.onClick,
          onKeyDown = this.onKeyDown;
      var _this$props5 = this.props,
          disabled = _this$props5.disabled,
          prefixCls = _this$props5.prefixCls,
          character = _this$props5.character,
          characterRender = _this$props5.characterRender,
          index = _this$props5.index,
          count = _this$props5.count,
          value = _this$props5.value;
      var start = React.createElement("li", {
        className: this.getClassName()
      }, React.createElement("div", {
        onClick: disabled ? null : onClick,
        onKeyDown: disabled ? null : onKeyDown,
        onMouseMove: disabled ? null : onHover,
        role: "radio",
        "aria-checked": value > index ? 'true' : 'false',
        "aria-posinset": index + 1,
        "aria-setsize": count,
        tabIndex: 0
      }, React.createElement("div", {
        className: "".concat(prefixCls, "-first")
      }, character), React.createElement("div", {
        className: "".concat(prefixCls, "-second")
      }, character)));

      if (characterRender) {
        start = characterRender(start, this.props);
      }

      return start;
    }
  }]);

  return Star;
}(React.Component);

_defineProperty(Star, "propTypes", {
  value: PropTypes.number,
  index: PropTypes.number,
  prefixCls: PropTypes.string,
  allowHalf: PropTypes.bool,
  disabled: PropTypes.bool,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  character: PropTypes.node,
  characterRender: PropTypes.func,
  focused: PropTypes.bool,
  count: PropTypes.number
});

export { Star as default };