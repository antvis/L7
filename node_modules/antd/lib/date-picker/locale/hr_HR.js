"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hr_HR = _interopRequireDefault(require("rc-calendar/lib/locale/hr_HR"));

var _hr_HR2 = _interopRequireDefault(require("../../time-picker/locale/hr_HR"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Odaberite datum',
    rangePlaceholder: ['Početni datum', 'Završni datum']
  }, _hr_HR["default"]),
  timePickerLocale: _extends({}, _hr_HR2["default"])
}; // All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

var _default = locale;
exports["default"] = _default;
//# sourceMappingURL=hr_HR.js.map
