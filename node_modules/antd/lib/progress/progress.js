"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var PropTypes = _interopRequireWildcard(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _omit = _interopRequireDefault(require("omit.js"));

var _icon = _interopRequireDefault(require("../icon"));

var _configProvider = require("../config-provider");

var _type = require("../_util/type");

var _Line = _interopRequireDefault(require("./Line"));

var _Circle = _interopRequireDefault(require("./Circle"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var ProgressTypes = (0, _type.tuple)('line', 'circle', 'dashboard');
var ProgressStatuses = (0, _type.tuple)('normal', 'exception', 'active', 'success');

var Progress =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Progress, _React$Component);

  function Progress() {
    var _this;

    _classCallCheck(this, Progress);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Progress).apply(this, arguments));

    _this.renderProgress = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls;

      var _assertThisInitialize = _assertThisInitialized(_this),
          props = _assertThisInitialize.props;

      var customizePrefixCls = props.prefixCls,
          className = props.className,
          size = props.size,
          type = props.type,
          showInfo = props.showInfo,
          restProps = __rest(props, ["prefixCls", "className", "size", "type", "showInfo"]);

      var prefixCls = getPrefixCls('progress', customizePrefixCls);

      var progressStatus = _this.getProgressStatus();

      var progressInfo = _this.renderProcessInfo(prefixCls, progressStatus);

      var progress; // Render progress shape

      if (type === 'line') {
        progress = React.createElement(_Line["default"], _extends({}, _this.props, {
          prefixCls: prefixCls
        }), progressInfo);
      } else if (type === 'circle' || type === 'dashboard') {
        progress = React.createElement(_Circle["default"], _extends({}, _this.props, {
          prefixCls: prefixCls,
          progressStatus: progressStatus
        }), progressInfo);
      }

      var classString = (0, _classnames["default"])(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(type === 'dashboard' && 'circle' || type), true), _defineProperty(_classNames, "".concat(prefixCls, "-status-").concat(progressStatus), true), _defineProperty(_classNames, "".concat(prefixCls, "-show-info"), showInfo), _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), size), _classNames), className);
      return React.createElement("div", _extends({}, (0, _omit["default"])(restProps, ['status', 'format', 'trailColor', 'successPercent', 'strokeWidth', 'width', 'gapDegree', 'gapPosition', 'strokeColor', 'strokeLinecap', 'percent']), {
        className: classString
      }), progress);
    };

    return _this;
  }

  _createClass(Progress, [{
    key: "getPercentNumber",
    value: function getPercentNumber() {
      var _this$props = this.props,
          successPercent = _this$props.successPercent,
          _this$props$percent = _this$props.percent,
          percent = _this$props$percent === void 0 ? 0 : _this$props$percent;
      return parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10);
    }
  }, {
    key: "getProgressStatus",
    value: function getProgressStatus() {
      var status = this.props.status;

      if (ProgressStatuses.indexOf(status) < 0 && this.getPercentNumber() >= 100) {
        return 'success';
      }

      return status || 'normal';
    }
  }, {
    key: "renderProcessInfo",
    value: function renderProcessInfo(prefixCls, progressStatus) {
      var _this$props2 = this.props,
          showInfo = _this$props2.showInfo,
          format = _this$props2.format,
          type = _this$props2.type,
          percent = _this$props2.percent,
          successPercent = _this$props2.successPercent;
      if (!showInfo) return null;
      var text;

      var textFormatter = format || function (percentNumber) {
        return "".concat(percentNumber, "%");
      };

      var iconType = type === 'circle' || type === 'dashboard' ? '' : '-circle';

      if (format || progressStatus !== 'exception' && progressStatus !== 'success') {
        text = textFormatter((0, _utils.validProgress)(percent), (0, _utils.validProgress)(successPercent));
      } else if (progressStatus === 'exception') {
        text = React.createElement(_icon["default"], {
          type: "close".concat(iconType),
          theme: type === 'line' ? 'filled' : 'outlined'
        });
      } else if (progressStatus === 'success') {
        text = React.createElement(_icon["default"], {
          type: "check".concat(iconType),
          theme: type === 'line' ? 'filled' : 'outlined'
        });
      }

      return React.createElement("span", {
        className: "".concat(prefixCls, "-text"),
        title: typeof text === 'string' ? text : undefined
      }, text);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderProgress);
    }
  }]);

  return Progress;
}(React.Component);

exports["default"] = Progress;
Progress.defaultProps = {
  type: 'line',
  percent: 0,
  showInfo: true,
  trailColor: '#f3f3f3',
  size: 'default',
  gapDegree: 0,
  strokeLinecap: 'round'
};
Progress.propTypes = {
  status: PropTypes.oneOf(ProgressStatuses),
  type: PropTypes.oneOf(ProgressTypes),
  showInfo: PropTypes.bool,
  percent: PropTypes.number,
  width: PropTypes.number,
  strokeWidth: PropTypes.number,
  strokeLinecap: PropTypes.oneOf(['round', 'square']),
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  trailColor: PropTypes.string,
  format: PropTypes.func,
  gapDegree: PropTypes.number
};
//# sourceMappingURL=progress.js.map
