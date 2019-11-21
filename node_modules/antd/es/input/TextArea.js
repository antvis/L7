function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import { ConfigConsumer } from '../config-provider';
import { fixControlledValue, resolveOnChange } from './Input';

var TextArea =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TextArea, _React$Component);

  function TextArea(props) {
    var _this;

    _classCallCheck(this, TextArea);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextArea).call(this, props));

    _this.saveTextArea = function (resizableTextArea) {
      _this.resizableTextArea = resizableTextArea;
    };

    _this.saveClearableInput = function (clearableInput) {
      _this.clearableInput = clearableInput;
    };

    _this.handleChange = function (e) {
      _this.setValue(e.target.value, function () {
        _this.resizableTextArea.resizeTextarea();
      });

      resolveOnChange(_this.resizableTextArea.textArea, e, _this.props.onChange);
    };

    _this.handleKeyDown = function (e) {
      var _this$props = _this.props,
          onPressEnter = _this$props.onPressEnter,
          onKeyDown = _this$props.onKeyDown;

      if (e.keyCode === 13 && onPressEnter) {
        onPressEnter(e);
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    _this.handleReset = function (e) {
      _this.setValue('', function () {
        _this.resizableTextArea.renderTextArea();

        _this.focus();
      });

      resolveOnChange(_this.resizableTextArea.textArea, e, _this.props.onChange);
    };

    _this.renderTextArea = function (prefixCls) {
      return React.createElement(ResizableTextArea, _extends({}, _this.props, {
        prefixCls: prefixCls,
        onKeyDown: _this.handleKeyDown,
        onChange: _this.handleChange,
        ref: _this.saveTextArea
      }));
    };

    _this.renderComponent = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var value = _this.state.value;
      var customizePrefixCls = _this.props.prefixCls;
      var prefixCls = getPrefixCls('input', customizePrefixCls);
      return React.createElement(ClearableLabeledInput, _extends({}, _this.props, {
        prefixCls: prefixCls,
        inputType: "text",
        value: fixControlledValue(value),
        element: _this.renderTextArea(prefixCls),
        handleReset: _this.handleReset,
        ref: _this.saveClearableInput
      }));
    };

    var value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    _this.state = {
      value: value
    };
    return _this;
  }

  _createClass(TextArea, [{
    key: "setValue",
    value: function setValue(value, callback) {
      if (!('value' in this.props)) {
        this.setState({
          value: value
        }, callback);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      this.resizableTextArea.textArea.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.resizableTextArea.textArea.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(ConfigConsumer, null, this.renderComponent);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      if ('value' in nextProps) {
        return {
          value: nextProps.value
        };
      }

      return null;
    }
  }]);

  return TextArea;
}(React.Component);

polyfill(TextArea);
export default TextArea;
//# sourceMappingURL=TextArea.js.map
