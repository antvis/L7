"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _linear = _interopRequireDefault(require("./linear"));

var _util = _interopRequireDefault(require("../util"));

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

// 计算log
function log(a, b) {
  if (a === 1) {
    return 1;
  }

  return Math.log(b) / Math.log(a);
}
/**
 * 度量的log计算
 * @class Scale.Log
 */


var Log =
/*#__PURE__*/
function (_Linear) {
  _inherits(Log, _Linear);

  function Log() {
    _classCallCheck(this, Log);

    return _possibleConstructorReturn(this, _getPrototypeOf(Log).apply(this, arguments));
  }

  _createClass(Log, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Log.prototype), "getDefaultCfg", this).call(this);

      return _util["default"].mix({}, cfg, {
        /**
         * @override
         */
        type: 'log',

        /**
         * 进行log计算的基数
         * @type {Number}
         */
        base: 2,

        /**
         * @override
         * log 的坐标点的个数控制在10个以下
         * @type {Number}
         */
        tickCount: 10,
        // 最小的tick，仅内部使用
        _minTick: null
      });
    }
    /**
     * @override
     */

  }, {
    key: "calculateTicks",
    value: function calculateTicks() {
      var self = this;
      var base = self.base;
      var minTick;

      if (self.min < 0) {
        throw new Error('The minimum value must be greater than zero!');
      }

      var maxTick = log(base, self.max);

      if (self.min > 0) {
        minTick = Math.floor(log(base, self.min));
      } else {
        var values = self.values;
        var positiveMin = self.max; // 查找大于0的第一个值, 如果都小于0，默认为1

        _util["default"].each(values, function (value) {
          if (value > 0 && value < positiveMin) {
            positiveMin = value;
          }
        });

        if (positiveMin === self.max) {
          positiveMin = self.max / base;
        }

        if (positiveMin > 1) {
          positiveMin = 1;
        }

        minTick = Math.floor(log(base, positiveMin));
        self._minTick = minTick;
        self.positiveMin = positiveMin;
      }

      var count = maxTick - minTick;
      var tickCount = self.tickCount;
      var avg = Math.ceil(count / tickCount);
      var ticks = [];

      for (var i = minTick; i < maxTick + avg; i = i + avg) {
        ticks.push(Math.pow(base, i));
      }
      /**/


      if (self.min === 0) {
        ticks.unshift(0);
      }

      return ticks;
    } // 获取度量计算时，value占的定义域百分比

  }, {
    key: "_getScalePercent",
    value: function _getScalePercent(value) {
      var max = this.max;
      var min = this.min;

      if (max === min) {
        return 0;
      } // 如果值小于等于0，则按照0处理


      if (value <= 0) {
        return 0;
      }

      var base = this.base;
      var positiveMin = this.positiveMin; // 如果min == 0, 则根据比0大的最小值，计算比例关系。这个最小值作为坐标轴上的第二个tick，第一个是0但是不显示

      if (positiveMin) {
        min = positiveMin * 1 / base;
      }

      var percent; // 如果数值小于次小值，那么就计算 value / 次小值 占整体的比例

      if (value < positiveMin) {
        percent = value / positiveMin / (log(base, max) - log(base, min));
      } else {
        percent = (log(base, value) - log(base, min)) / (log(base, max) - log(base, min));
      }

      return percent;
    }
    /**
     * @override
     */

  }, {
    key: "scale",
    value: function scale(value) {
      var percent = this._getScalePercent(value);

      var rangeMin = this.rangeMin();
      var rangeMax = this.rangeMax();
      return rangeMin + percent * (rangeMax - rangeMin);
    }
    /**
     * @override
     */

  }, {
    key: "invert",
    value: function invert(value) {
      var base = this.base;
      var max = log(base, this.max);
      var rangeMin = this.rangeMin();
      var range = this.rangeMax() - rangeMin;
      var min;
      var positiveMin = this.positiveMin;

      if (positiveMin) {
        if (value === 0) {
          return 0;
        }

        min = log(base, positiveMin / base);
        var appendPercent = 1 / (max - min) * range; // 0 到 positiveMin的占比

        if (value < appendPercent) {
          // 落到 0 - positiveMin 之间
          return value / appendPercent * positiveMin;
        }
      } else {
        min = log(base, this.min);
      }

      var percent = (value - rangeMin) / range;
      var tmp = percent * (max - min) + min;
      return Math.pow(base, tmp);
    }
  }]);

  return Log;
}(_linear["default"]);

var _default = Log;
exports["default"] = _default;