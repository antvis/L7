"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _padEnd = _interopRequireDefault(require("lodash/padEnd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var StatisticNumber = function StatisticNumber(props) {
  var value = props.value,
      formatter = props.formatter,
      precision = props.precision,
      decimalSeparator = props.decimalSeparator,
      _props$groupSeparator = props.groupSeparator,
      groupSeparator = _props$groupSeparator === void 0 ? '' : _props$groupSeparator,
      prefixCls = props.prefixCls;
  var valueNode;

  if (typeof formatter === 'function') {
    // Customize formatter
    valueNode = formatter(value);
  } else {
    // Internal formatter
    var val = String(value);
    var cells = val.match(/^(-?)(\d*)(\.(\d+))?$/); // Process if illegal number

    if (!cells) {
      valueNode = val;
    } else {
      var negative = cells[1];

      var _int = cells[2] || '0';

      var decimal = cells[4] || '';
      _int = _int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

      if (typeof precision === 'number') {
        decimal = (0, _padEnd["default"])(decimal, precision, '0').slice(0, precision);
      }

      if (decimal) {
        decimal = "".concat(decimalSeparator).concat(decimal);
      }

      valueNode = [React.createElement("span", {
        key: "int",
        className: "".concat(prefixCls, "-content-value-int")
      }, negative, _int), decimal && React.createElement("span", {
        key: "decimal",
        className: "".concat(prefixCls, "-content-value-decimal")
      }, decimal)];
    }
  }

  return React.createElement("span", {
    className: "".concat(prefixCls, "-content-value")
  }, valueNode);
};

var _default = StatisticNumber;
exports["default"] = _default;
//# sourceMappingURL=Number.js.map
