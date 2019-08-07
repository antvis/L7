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

// 求以a为次幂，结果为b的基数，如 x^^a = b;求x
function calBase(a, b) {
  var e = Math.E;
  var value = Math.pow(e, Math.log(b) / a); // 使用换底公式求底

  return value;
}
/**
 * 度量的Pow计算
 * @class Scale.Log
 */


var Pow =
/*#__PURE__*/
function (_Linear) {
  _inherits(Pow, _Linear);

  function Pow() {
    _classCallCheck(this, Pow);

    return _possibleConstructorReturn(this, _getPrototypeOf(Pow).apply(this, arguments));
  }

  _createClass(Pow, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Pow.prototype), "getDefaultCfg", this).call(this);

      return _util["default"].mix({}, cfg, {
        /**
         * @override
         */
        type: 'pow',

        /**
         * 进行pow计算的基数
         * @type {Number}
         */
        exponent: 2,

        /**
         * @override
         * pow 的坐标点的个数控制在10个以下
         * @type {Number}
         */
        tickCount: 10
      });
    }
    /**
     * @override
     */

  }, {
    key: "calculateTicks",
    value: function calculateTicks() {
      var self = this;
      var exponent = self.exponent;
      var min;
      var max = Math.ceil(calBase(exponent, self.max));

      if (self.min >= 0) {
        min = Math.floor(calBase(exponent, self.min));
      } else {
        min = 0;
      }

      if (min > max) {
        var tmp = max;
        max = min;
        min = tmp;
      }

      var count = max - min;
      var tickCount = self.tickCount;
      var avg = Math.ceil(count / tickCount);
      var ticks = [];

      for (var i = min; i < max + avg; i = i + avg) {
        ticks.push(Math.pow(i, exponent));
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
      }

      var exponent = this.exponent;
      var percent = (calBase(exponent, value) - calBase(exponent, min)) / (calBase(exponent, max) - calBase(exponent, min));
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
      var percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
      var exponent = this.exponent;
      var max = calBase(exponent, this.max);
      var min = calBase(exponent, this.min);
      var tmp = percent * (max - min) + min;
      return Math.pow(tmp, exponent);
    }
  }]);

  return Pow;
}(_linear["default"]);

var _default = Pow;
exports["default"] = _default;