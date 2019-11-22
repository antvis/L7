"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _select = _interopRequireDefault(require("../select"));

var _radio = require("../radio");

var _configProvider = require("../config-provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Option = _select["default"].Option;

function getMonthsLocale(value) {
  var current = value.clone();
  var localeData = value.localeData();
  var months = [];

  for (var i = 0; i < 12; i++) {
    current.month(i);
    months.push(localeData.monthsShort(current));
  }

  return months;
}

var Header =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Header, _React$Component);

  function Header() {
    var _this;

    _classCallCheck(this, Header);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Header).apply(this, arguments));

    _this.onYearChange = function (year) {
      var _this$props = _this.props,
          value = _this$props.value,
          validRange = _this$props.validRange;
      var newValue = value.clone();
      newValue.year(parseInt(year, 10)); // switch the month so that it remains within range when year changes

      if (validRange) {
        var _validRange = _slicedToArray(validRange, 2),
            start = _validRange[0],
            end = _validRange[1];

        var newYear = newValue.get('year');
        var newMonth = newValue.get('month');

        if (newYear === end.get('year') && newMonth > end.get('month')) {
          newValue.month(end.get('month'));
        }

        if (newYear === start.get('year') && newMonth < start.get('month')) {
          newValue.month(start.get('month'));
        }
      }

      var onValueChange = _this.props.onValueChange;

      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    _this.onMonthChange = function (month) {
      var newValue = _this.props.value.clone();

      newValue.month(parseInt(month, 10));
      var onValueChange = _this.props.onValueChange;

      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    _this.onInternalTypeChange = function (e) {
      _this.onTypeChange(e.target.value);
    };

    _this.onTypeChange = function (type) {
      var onTypeChange = _this.props.onTypeChange;

      if (onTypeChange) {
        onTypeChange(type);
      }
    };

    _this.getCalenderHeaderNode = function (node) {
      _this.calenderHeaderNode = node;
    };

    _this.getMonthYearSelections = function (getPrefixCls) {
      var _this$props2 = _this.props,
          customizePrefixCls = _this$props2.prefixCls,
          type = _this$props2.type,
          value = _this$props2.value;
      var prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);

      var yearReactNode = _this.getYearSelectElement(prefixCls, value.year());

      var monthReactNode = type === 'month' ? _this.getMonthSelectElement(prefixCls, value.month(), getMonthsLocale(value)) : null;
      return {
        yearReactNode: yearReactNode,
        monthReactNode: monthReactNode
      };
    };

    _this.getTypeSwitch = function () {
      var _this$props3 = _this.props,
          _this$props3$locale = _this$props3.locale,
          locale = _this$props3$locale === void 0 ? {} : _this$props3$locale,
          type = _this$props3.type,
          fullscreen = _this$props3.fullscreen;
      var size = fullscreen ? 'default' : 'small';
      return React.createElement(_radio.Group, {
        onChange: _this.onInternalTypeChange,
        value: type,
        size: size
      }, React.createElement(_radio.Button, {
        value: "month"
      }, locale.month), React.createElement(_radio.Button, {
        value: "year"
      }, locale.year));
    };

    _this.headerRenderCustom = function (headerRender) {
      var _this$props4 = _this.props,
          type = _this$props4.type,
          onValueChange = _this$props4.onValueChange,
          value = _this$props4.value;
      return headerRender({
        value: value,
        type: type || 'month',
        onChange: onValueChange,
        onTypeChange: _this.onTypeChange
      });
    };

    _this.renderHeader = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var _this$props5 = _this.props,
          prefixCls = _this$props5.prefixCls,
          headerRender = _this$props5.headerRender;

      var typeSwitch = _this.getTypeSwitch();

      var _this$getMonthYearSel = _this.getMonthYearSelections(getPrefixCls),
          yearReactNode = _this$getMonthYearSel.yearReactNode,
          monthReactNode = _this$getMonthYearSel.monthReactNode;

      return headerRender ? _this.headerRenderCustom(headerRender) : React.createElement("div", {
        className: "".concat(prefixCls, "-header"),
        ref: _this.getCalenderHeaderNode
      }, yearReactNode, monthReactNode, typeSwitch);
    };

    return _this;
  }

  _createClass(Header, [{
    key: "getYearSelectElement",
    value: function getYearSelectElement(prefixCls, year) {
      var _this2 = this;

      var _this$props6 = this.props,
          yearSelectOffset = _this$props6.yearSelectOffset,
          yearSelectTotal = _this$props6.yearSelectTotal,
          _this$props6$locale = _this$props6.locale,
          locale = _this$props6$locale === void 0 ? {} : _this$props6$locale,
          fullscreen = _this$props6.fullscreen,
          validRange = _this$props6.validRange;
      var start = year - yearSelectOffset;
      var end = start + yearSelectTotal;

      if (validRange) {
        start = validRange[0].get('year');
        end = validRange[1].get('year') + 1;
      }

      var suffix = locale.year === '年' ? '年' : '';
      var options = [];

      for (var index = start; index < end; index++) {
        options.push(React.createElement(Option, {
          key: "".concat(index)
        }, index + suffix));
      }

      return React.createElement(_select["default"], {
        size: fullscreen ? 'default' : 'small',
        dropdownMatchSelectWidth: false,
        className: "".concat(prefixCls, "-year-select"),
        onChange: this.onYearChange,
        value: String(year),
        getPopupContainer: function getPopupContainer() {
          return _this2.calenderHeaderNode;
        }
      }, options);
    }
  }, {
    key: "getMonthSelectElement",
    value: function getMonthSelectElement(prefixCls, month, months) {
      var _this3 = this;

      var _this$props7 = this.props,
          fullscreen = _this$props7.fullscreen,
          validRange = _this$props7.validRange,
          value = _this$props7.value;
      var options = [];
      var start = 0;
      var end = 12;

      if (validRange) {
        var _validRange2 = _slicedToArray(validRange, 2),
            rangeStart = _validRange2[0],
            rangeEnd = _validRange2[1];

        var currentYear = value.get('year');

        if (rangeEnd.get('year') === currentYear) {
          end = rangeEnd.get('month') + 1;
        }

        if (rangeStart.get('year') === currentYear) {
          start = rangeStart.get('month');
        }
      }

      for (var index = start; index < end; index++) {
        options.push(React.createElement(Option, {
          key: "".concat(index)
        }, months[index]));
      }

      return React.createElement(_select["default"], {
        size: fullscreen ? 'default' : 'small',
        dropdownMatchSelectWidth: false,
        className: "".concat(prefixCls, "-month-select"),
        value: String(month),
        onChange: this.onMonthChange,
        getPopupContainer: function getPopupContainer() {
          return _this3.calenderHeaderNode;
        }
      }, options);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderHeader);
    }
  }]);

  return Header;
}(React.Component);

exports["default"] = Header;
Header.defaultProps = {
  yearSelectOffset: 10,
  yearSelectTotal: 20
};
//# sourceMappingURL=Header.js.map
