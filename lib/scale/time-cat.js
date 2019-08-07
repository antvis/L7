"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _category = _interopRequireDefault(require("./category"));

var _util = _interopRequireDefault(require("../util"));

var _fecha = _interopRequireDefault(require("fecha"));

var _timeUtil = _interopRequireDefault(require("./time-util"));

var _cat = _interopRequireDefault(require("./auto/cat"));

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
 * 度量的构造函数
 * @class Scale.TimeCategory
 */
var TimeCategory =
/*#__PURE__*/
function (_Category) {
  _inherits(TimeCategory, _Category);

  function TimeCategory() {
    _classCallCheck(this, TimeCategory);

    return _possibleConstructorReturn(this, _getPrototypeOf(TimeCategory).apply(this, arguments));
  }

  _createClass(TimeCategory, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(TimeCategory.prototype), "getDefaultCfg", this).call(this);

      return _util["default"].mix({}, cfg, {
        /**
         * @override
         */
        type: 'timeCat',

        /**
         * 格式化符
         * @type {String}
         */
        mask: 'YYYY-MM-DD',

        /**
         * @override
         */
        tickCount: 7
      });
    }
  }, {
    key: "init",
    value: function init() {
      var self = this;
      var values = this.values; // 针对时间分类类型，会将时间统一转换为时间戳

      _util["default"].each(values, function (v, i) {
        values[i] = self._toTimeStamp(v);
      });

      values.sort(function (v1, v2) {
        return v1 - v2;
      });

      if (!self.ticks) {
        self.ticks = this.calculateTicks(false);
      }
    }
    /**
     * 计算 ticks
     * @param  {boolean} formated 是否将 ticks 按照指定的 mask 格式化
     * @return {array} 返回 ticks 数组
     */

  }, {
    key: "calculateTicks",
    value: function calculateTicks(formated) {
      var self = this;
      var count = self.tickCount;
      var ticks;

      if (count) {
        var temp = (0, _cat["default"])({
          maxCount: count,
          data: self.values
        });
        ticks = temp.ticks;
      } else {
        ticks = self.values;
      }

      if (formated) {
        _util["default"].each(ticks, function (value, index) {
          ticks[index] = _fecha["default"].format(value, self.mask);
        });
      }

      return ticks;
    }
    /**
     * @override
     */

  }, {
    key: "translate",
    value: function translate(value) {
      value = this._toTimeStamp(value);
      var index = this.values.indexOf(value);

      if (index === -1) {
        if (_util["default"].isNumber(value) && value < this.values.length) {
          index = value;
        } else {
          index = NaN;
        }
      }

      return index;
    }
    /**
     * @override
     */

  }, {
    key: "scale",
    value: function scale(value) {
      var rangeMin = this.rangeMin();
      var rangeMax = this.rangeMax();
      var index = this.translate(value);
      var percent;

      if (this.values.length === 1) {
        percent = index;
      } else if (index > -1) {
        percent = index / (this.values.length - 1);
      } else {
        percent = 0;
      }

      return rangeMin + percent * (rangeMax - rangeMin);
    }
    /**
     * @override
     */

  }, {
    key: "getText",
    value: function getText(value) {
      var result = '';
      var index = this.translate(value);

      if (index > -1) {
        result = this.values[index];
      } else {
        result = value;
      }

      var formatter = this.formatter;
      result = parseInt(result, 10);
      result = formatter ? formatter(result) : _fecha["default"].format(result, this.mask);
      return result;
    }
    /**
     * @override
     */

  }, {
    key: "getTicks",
    value: function getTicks() {
      var self = this;
      var ticks = this.ticks;
      var rst = [];

      _util["default"].each(ticks, function (tick) {
        var obj;

        if (_util["default"].isObject(tick)) {
          obj = tick;
        } else {
          obj = {
            text: _util["default"].isString(tick) ? tick : self.getText(tick),
            tickValue: tick,
            // 用于坐标轴上文本动画时确定前后帧的对应关系
            value: self.scale(tick)
          };
        }

        rst.push(obj);
      });

      return rst;
    } // 将时间转换为时间戳

  }, {
    key: "_toTimeStamp",
    value: function _toTimeStamp(value) {
      return _timeUtil["default"].toTimeStamp(value);
    }
  }]);

  return TimeCategory;
}(_category["default"]);

var _default = TimeCategory;
exports["default"] = _default;