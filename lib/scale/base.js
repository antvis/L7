"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 度量的构造函数
 * @class Scale
 */
var Base =
/*#__PURE__*/
function () {
  _createClass(Base, [{
    key: "getDefaultCfg",

    /**
     * 获取默认的配置属性
     * @protected
     * @return {Object} 默认属性
     */
    value: function getDefaultCfg() {
      return {
        /**
         * type of the scale
         * @type {String}
         */
        type: 'base',

        /**
         * 格式化函数,输出文本或者tick时的格式化函数
         * @type {Function}
         */
        formatter: null,

        /**
         * 输出的值域
         * @type {Array}
         */
        range: [0, 1],

        /**
         * 度量的标记
         * @type {Array}
         */
        ticks: null,

        /**
         * 参与度量计算的值，可选项
         * @type {Array}
         */
        values: []
      };
    }
  }]);

  function Base(cfg) {
    _classCallCheck(this, Base);

    var defaultCfg = this.getDefaultCfg();

    _util["default"].mix(this, defaultCfg, cfg);

    this.init();
  }
  /**
   * 度量初始化
   * @protected
   */


  _createClass(Base, [{
    key: "init",
    value: function init() {}
    /**
     * 获取该度量的ticks,返回的是多个对象，
     *   - text: tick 的文本
     *   - value: 对应的度量转换后的值
     * <code>
     *   [
     *     {text: 0,value:0}
     *     {text: 1,value:0.2}
     *     {text: 2,value:0.4}
     *     {text: 3,value:0.6}
     *     {text: 4,value:0.8}
     *     {text: 5,value:1}
     *   ]
     * </code>
     * @param {Number} count 输出tick的个数的近似值，默认是 10
     * @return {Array} 返回 ticks 数组
     */

  }, {
    key: "getTicks",
    value: function getTicks() {
      var self = this;
      var ticks = self.ticks;
      var rst = [];

      _util["default"].each(ticks, function (tick) {
        var obj;

        if (_util["default"].isObject(tick)) {
          obj = tick;
        } else {
          obj = {
            text: self.getText(tick),
            tickValue: tick,
            value: self.scale(tick)
          };
        }

        rst.push(obj);
      });

      return rst;
    }
    /**
     * 获取格式化后的文本
     * @param  {*} value 输入的数据
     * @return {String} 格式化的文本
     */

  }, {
    key: "getText",
    value: function getText(value) {
      var formatter = this.formatter;
      value = formatter ? formatter(value) : value;

      if (_util["default"].isNil(value) || !value.toString) {
        value = '';
      }

      return value.toString();
    }
    /**
     * 输出的值域最小值
     * @protected
     * @return {Number} 返回最小的值
     */

  }, {
    key: "rangeMin",
    value: function rangeMin() {
      return this.range[0];
    }
    /**
     * 输出的值域最大值
     * @protected
     * @return {Number} 返回最大的值
     */

  }, {
    key: "rangeMax",
    value: function rangeMax() {
      var range = this.range;
      return range[range.length - 1];
    }
    /**
     * 度量转换后的结果，翻转回输入域
     * @param  {Number} value 需要翻转的数值
     * @return {*} 度量的输入值
     */

  }, {
    key: "invert",
    value: function invert(value) {
      return value;
    }
    /**
     * 将传入的值从非数值转换成数值格式，如分类字符串、时间字符串等
     * @param  {*} value 传入的值
     * @return {Number} 转换的值
     */

  }, {
    key: "translate",
    value: function translate(value) {
      return value;
    }
    /**
     * 进行度量转换
     * @param  {*} value 输入值
     * @return {Number} 输出值，在设定的输出值域之间，默认[0,1]
     */

  }, {
    key: "scale",
    value: function scale(value) {
      return value;
    }
    /**
     * 克隆一个新的scale,拥有跟当前scale相同的输入域、输出域等
     * @return {Scale} 克隆的度量
     */

  }, {
    key: "clone",
    value: function clone() {
      var self = this;
      var constr = self.constructor;
      var cfg = {};

      _util["default"].each(self, function (v, k) {
        cfg[k] = self[k];
      });

      return new constr(cfg);
    }
    /**
     * 更改度量的属性信息
     * @param  {Object} info 属性信息
     * @chainable
     * @return {Scale} 返回自身的引用
     */

  }, {
    key: "change",
    value: function change(info) {
      this.ticks = null;

      _util["default"].mix(this, info);

      this.init();
      return this;
    }
  }]);

  return Base;
}();

var _default = Base;
exports["default"] = _default;