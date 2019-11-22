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

import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import TimePickerPanel from "rc-time-picker/es/Panel";
import classNames from 'classnames';
import * as moment from 'moment';
import enUS from './locale/en_US';
import interopDefault from '../_util/interopDefault';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { generateShowHourMinuteSecond } from '../time-picker';
import { ConfigConsumer } from '../config-provider';
import warning from '../_util/warning';
var DEFAULT_FORMAT = {
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  week: 'gggg-wo',
  month: 'YYYY-MM'
};
var LOCALE_FORMAT_MAPPING = {
  date: 'dateFormat',
  dateTime: 'dateTimeFormat',
  week: 'weekFormat',
  month: 'monthFormat'
};

function getColumns(_ref) {
  var showHour = _ref.showHour,
      showMinute = _ref.showMinute,
      showSecond = _ref.showSecond,
      use12Hours = _ref.use12Hours;
  var column = 0;

  if (showHour) {
    column += 1;
  }

  if (showMinute) {
    column += 1;
  }

  if (showSecond) {
    column += 1;
  }

  if (use12Hours) {
    column += 1;
  }

  return column;
}

function checkValidate(value, propName) {
  var values = Array.isArray(value) ? value : [value];
  values.forEach(function (val) {
    if (!val) return;
    warning(!interopDefault(moment).isMoment(val) || val.isValid(), 'DatePicker', "`".concat(propName, "` provides invalidate moment time. If you want to set empty value, use `null` instead."));
  });
}

export default function wrapPicker(Picker, pickerType) {
  var PickerWrapper =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(PickerWrapper, _React$Component);

    function PickerWrapper() {
      var _this;

      _classCallCheck(this, PickerWrapper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PickerWrapper).apply(this, arguments)); // Since we need call `getDerivedStateFromProps` for check. Need leave an empty `state` here.

      _this.state = {};

      _this.savePicker = function (node) {
        _this.picker = node;
      };

      _this.getDefaultLocale = function () {
        var result = _extends(_extends({}, enUS), _this.props.locale);

        result.lang = _extends(_extends({}, result.lang), (_this.props.locale || {}).lang);
        return result;
      };

      _this.handleOpenChange = function (open) {
        var onOpenChange = _this.props.onOpenChange;
        onOpenChange(open);
      };

      _this.handleFocus = function (e) {
        var onFocus = _this.props.onFocus;

        if (onFocus) {
          onFocus(e);
        }
      };

      _this.handleBlur = function (e) {
        var onBlur = _this.props.onBlur;

        if (onBlur) {
          onBlur(e);
        }
      };

      _this.handleMouseEnter = function (e) {
        var onMouseEnter = _this.props.onMouseEnter;

        if (onMouseEnter) {
          onMouseEnter(e);
        }
      };

      _this.handleMouseLeave = function (e) {
        var onMouseLeave = _this.props.onMouseLeave;

        if (onMouseLeave) {
          onMouseLeave(e);
        }
      };

      _this.renderPicker = function (locale, localeCode) {
        var _this$props = _this.props,
            format = _this$props.format,
            showTime = _this$props.showTime;
        var mergedPickerType = showTime ? "".concat(pickerType, "Time") : pickerType;
        var mergedFormat = format || locale[LOCALE_FORMAT_MAPPING[mergedPickerType]] || DEFAULT_FORMAT[mergedPickerType];
        return React.createElement(ConfigConsumer, null, function (_ref2) {
          var _classNames2;

          var getPrefixCls = _ref2.getPrefixCls,
              getContextPopupContainer = _ref2.getPopupContainer;
          var _this$props2 = _this.props,
              customizePrefixCls = _this$props2.prefixCls,
              customizeInputPrefixCls = _this$props2.inputPrefixCls,
              getCalendarContainer = _this$props2.getCalendarContainer,
              size = _this$props2.size,
              disabled = _this$props2.disabled;
          var getPopupContainer = getCalendarContainer || getContextPopupContainer;
          var prefixCls = getPrefixCls('calendar', customizePrefixCls);
          var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);
          var pickerClass = classNames("".concat(prefixCls, "-picker"), _defineProperty({}, "".concat(prefixCls, "-picker-").concat(size), !!size));
          var pickerInputClass = classNames("".concat(prefixCls, "-picker-input"), inputPrefixCls, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(inputPrefixCls, "-lg"), size === 'large'), _defineProperty(_classNames2, "".concat(inputPrefixCls, "-sm"), size === 'small'), _defineProperty(_classNames2, "".concat(inputPrefixCls, "-disabled"), disabled), _classNames2));
          var timeFormat = showTime && showTime.format || 'HH:mm:ss';

          var rcTimePickerProps = _extends(_extends({}, generateShowHourMinuteSecond(timeFormat)), {
            format: timeFormat,
            use12Hours: showTime && showTime.use12Hours
          });

          var columns = getColumns(rcTimePickerProps);
          var timePickerCls = "".concat(prefixCls, "-time-picker-column-").concat(columns);
          var timePicker = showTime ? React.createElement(TimePickerPanel, _extends({}, rcTimePickerProps, showTime, {
            prefixCls: "".concat(prefixCls, "-time-picker"),
            className: timePickerCls,
            placeholder: locale.timePickerLocale.placeholder,
            transitionName: "slide-up",
            onEsc: function onEsc() {}
          })) : null;
          return React.createElement(Picker, _extends({}, _this.props, {
            getCalendarContainer: getPopupContainer,
            format: mergedFormat,
            ref: _this.savePicker,
            pickerClass: pickerClass,
            pickerInputClass: pickerInputClass,
            locale: locale,
            localeCode: localeCode,
            timePicker: timePicker,
            onOpenChange: _this.handleOpenChange,
            onFocus: _this.handleFocus,
            onBlur: _this.handleBlur,
            onMouseEnter: _this.handleMouseEnter,
            onMouseLeave: _this.handleMouseLeave
          }));
        });
      };

      return _this;
    }

    _createClass(PickerWrapper, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this$props3 = this.props,
            autoFocus = _this$props3.autoFocus,
            disabled = _this$props3.disabled;

        if (autoFocus && !disabled) {
          this.focus();
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        this.picker.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        this.picker.blur();
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(LocaleReceiver, {
          componentName: "DatePicker",
          defaultLocale: this.getDefaultLocale
        }, this.renderPicker);
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(_ref3) {
        var value = _ref3.value,
            defaultValue = _ref3.defaultValue;
        checkValidate(defaultValue, 'defaultValue');
        checkValidate(value, 'value');
        return {};
      }
    }]);

    return PickerWrapper;
  }(React.Component);

  PickerWrapper.defaultProps = {
    transitionName: 'slide-up',
    popupStyle: {},
    onChange: function onChange() {},
    onOk: function onOk() {},
    onOpenChange: function onOpenChange() {},
    locale: {}
  };
  polyfill(PickerWrapper);
  return PickerWrapper;
}
//# sourceMappingURL=wrapPicker.js.map
