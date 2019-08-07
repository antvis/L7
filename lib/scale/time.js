"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _linear = _interopRequireDefault(require("./linear"));

var _util = _interopRequireDefault(require("../util"));

var _time = _interopRequireDefault(require("./auto/time"));

var _fecha = _interopRequireDefault(require("fecha"));

var _timeUtil = _interopRequireDefault(require("./time-util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 时间度量的构造函数
 * @class Scale.Time
 */
var Time =
/*#__PURE__*/
function (_Linear) {
  _inherits(Time, _Linear);

  function Time() {
    _classCallCheck(this, Time);

    return _possibleConstructorReturn(this, _getPrototypeOf(Time).apply(this, arguments));
  }

  _createClass(Time, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Time.prototype), "getDefaultCfg", this).call(this);

      return _util["default"].mix({}, cfg, {
        /**
         * @override
         */
        type: 'time',

        /**
         * 格式化符
         * @type {String}
         */
        mask: 'YYYY-MM-DD'
      });
    }
    /**
     * @override
     */

  }, {
    key: "init",
    value: function init() {
      var self = this;
      var values = self.values;

      if (values && values.length) {
        // 重新计算最大最小值
        var timeStamps = [];
        var min = Infinity; // 最小值

        var secondMin = min; // 次小值

        var max = 0; // 使用一个循环，计算min,max,secondMin

        _util["default"].each(values, function (v) {
          var timeStamp = self._toTimeStamp(v);

          if (isNaN(timeStamp)) {
            throw new TypeError("Invalid Time: ".concat(v));
          }

          if (min > timeStamp) {
            secondMin = min;
            min = timeStamp;
          } else if (secondMin > timeStamp) {
            secondMin = timeStamp;
          }

          if (max < timeStamp) {
            max = timeStamp;
          }

          timeStamps.push(timeStamp);
        }); // 存在多个值时，设置最小间距


        if (values.length > 1) {
          self.minTickInterval = secondMin - min;
        }

        if (_util["default"].isNil(self.min) || self._toTimeStamp(self.min) > min) {
          self.min = min;
        }

        if (_util["default"].isNil(self.max) || self._toTimeStamp(self.max) < max) {
          self.max = max;
        }
      }

      _get(_getPrototypeOf(Time.prototype), "init", this).call(this);
    }
  }, {
    key: "calculateTicks",
    value: function calculateTicks() {
      var self = this;
      var min = self.min;
      var max = self.max;
      var count = self.tickCount;
      var interval = self.tickInterval;
      var tmp = (0, _time["default"])({
        min: min,
        max: max,
        minCount: count,
        maxCount: count,
        interval: interval,
        minInterval: self.minTickInterval
      });
      return tmp.ticks;
    }
    /**
     * @override
     */

  }, {
    key: "getText",
    value: function getText(value) {
      var formatter = this.formatter;
      value = this.translate(value);
      value = formatter ? formatter(value) : _fecha["default"].format(value, this.mask);
      return value;
    }
    /**
     * @override
     */

  }, {
    key: "scale",
    value: function scale(value) {
      if (_util["default"].isString(value)) {
        value = this.translate(value);
      }

      return _get(_getPrototypeOf(Time.prototype), "scale", this).call(this, value);
    }
    /**
     * @override
     */

  }, {
    key: "translate",
    value: function translate(value) {
      return this._toTimeStamp(value);
    } // 将时间转换为时间戳

  }, {
    key: "_toTimeStamp",
    value: function _toTimeStamp(value) {
      return _timeUtil["default"].toTimeStamp(value);
    }
  }]);

  return Time;
}(_linear["default"]);

var _default = Time;
exports["default"] = _default;