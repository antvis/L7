"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _util = _interopRequireDefault(require("../util"));

var _number = _interopRequireDefault(require("./auto/number"));

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
 * 线性度量
 * @class Scale.Linear
 */
var Linear =
/*#__PURE__*/
function (_Base) {
  _inherits(Linear, _Base);

  function Linear() {
    _classCallCheck(this, Linear);

    return _possibleConstructorReturn(this, _getPrototypeOf(Linear).apply(this, arguments));
  }

  _createClass(Linear, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Linear.prototype), "getDefaultCfg", this).call(this);

      return _util["default"].mix({}, cfg, {
        /**
         * type of the scale
         * @type {String}
         */
        type: 'linear',

        /**
         * 是否线性
         * @type {Boolean}
         * @readOnly
         * @default true
         */
        isLinear: true,

        /**
         * min value of the scale
         * @type {Number}
         * @default null
         */
        min: null,

        /**
         * min value limitted of the scale
         * @type {Number}
         * @default null
         */
        minLimit: null,

        /**
         * max value of the scale
         * @type {Number}
         * @default null
         */
        max: null,

        /**
         * max value limitted of the scale
         * @type {Number}
         * @default null
         */
        maxLimit: null,

        /**
         * 是否为了用户习惯，优化min,max和ticks，如果进行优化，则会根据生成的ticks调整min,max，否则舍弃(min,max)范围之外的ticks
         * @type {Boolean}
         * @default false
         */
        nice: false,

        /**
         * 自动生成标记时的个数
         * @type {Number}
         * @default null
         */
        tickCount: null,

        /**
         * 坐标轴点之间的间距，指的是真实数据的差值
         * @type {Number}
         * @default null
         */
        tickInterval: null,

        /**
         * 用于计算坐标点时逼近的数组
         * @type {Array}
         */
        snapArray: null
      });
    }
    /**
     * @protected
     * @override
     */

  }, {
    key: "init",
    value: function init() {
      var self = this;

      if (!self.ticks) {
        self.min = self.translate(self.min);
        self.max = self.translate(self.max);
        self.initTicks();
      } else {
        var ticks = self.ticks;
        var firstValue = self.translate(ticks[0]);
        var lastValue = self.translate(ticks[ticks.length - 1]);

        if (_util["default"].isNil(self.min) || self.min > firstValue) {
          self.min = firstValue;
        }

        if (_util["default"].isNil(self.max) || self.max < lastValue) {
          self.max = lastValue;
        }
      }
    }
    /**
     * 计算坐标点
     * @protected
     * @return {Array} 计算完成的坐标点
     */

  }, {
    key: "calculateTicks",
    value: function calculateTicks() {
      var self = this;
      var min = self.min;
      var max = self.max;
      var count = self.tickCount;
      var interval = self.tickInterval;

      if (max < min) {
        throw new Error("max: ".concat(max, " should not be less than min: ").concat(min));
      }

      var tmp = (0, _number["default"])({
        min: min,
        max: max,
        minLimit: self.minLimit,
        maxLimit: self.maxLimit,
        minCount: count,
        maxCount: count,
        interval: interval,
        snapArray: this.snapArray
      });
      return tmp.ticks;
    } // 初始化ticks

  }, {
    key: "initTicks",
    value: function initTicks() {
      var self = this;
      var calTicks = self.calculateTicks();

      if (self.nice) {
        // 如果需要优化显示的tick
        self.ticks = calTicks;
        self.min = calTicks[0];
        self.max = calTicks[calTicks.length - 1];
      } else {
        var ticks = [];

        _util["default"].each(calTicks, function (tick) {
          if (tick >= self.min && tick <= self.max) {
            ticks.push(tick);
          }
        }); // 如果 ticks 为空，直接输入最小值、最大值


        if (!ticks.length) {
          ticks.push(self.min);
          ticks.push(self.max);
        }

        self.ticks = ticks;
      }
    }
    /**
     * @override
     */

  }, {
    key: "scale",
    value: function scale(value) {
      if (value === null || value === undefined) {
        return NaN;
      }

      var max = this.max;
      var min = this.min;

      if (max === min) {
        return 0;
      }

      var percent = Math.min(1, Math.max(0, (value - min) / (max - min))); // 数据控制到 0-1 范围
      // const percent = (value - min) / (max - min);

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
      var percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
      return this.min + percent * (this.max - this.min);
    }
  }]);

  return Linear;
}(_base["default"]);

var _default = Linear;
exports["default"] = _default;