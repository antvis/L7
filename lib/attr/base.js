"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _colorUtil = _interopRequireDefault(require("./color-util"));

var _util = _interopRequireDefault(require("../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function toScaleString(scale, value) {
  if (_util["default"].isString(value)) {
    return value;
  }

  return scale.invert(scale.scale(value));
}
/**
 * 所有视觉通道属性的基类
 * @class Attr
 */


var AttributeBase =
/*#__PURE__*/
function () {
  function AttributeBase(cfg) {
    _classCallCheck(this, AttributeBase);

    /**
     * 属性的类型
     * @type {String}
     */
    this.type = 'base';
    /**
     * 属性的名称
     * @type {String}
     */

    this.name = null;
    /**
     * 回调函数
     * @type {Function}
     */

    this.method = null;
    /**
     * 备选的值数组
     * @type {Array}
     */

    this.values = [];
    /**
     * 属性内部的度量
     * @type {Array}
     */

    this.scales = [];
    /**
     * 是否通过线性取值, 如果未指定，则根据数值的类型判定
     * @type {Boolean}
     */

    this.linear = null;

    _util["default"].mix(this, cfg);
  }

  _createClass(AttributeBase, [{
    key: "get",
    value: function get(name) {
      return this[name];
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this[name] = value;
    } // 获取属性值，将值映射到视觉通道

  }, {
    key: "_getAttrValue",
    value: function _getAttrValue(scale, value) {
      var values = this.values;

      if (scale.isCategory && !this.linear) {
        var index = scale.translate(value);
        return values[index % values.length];
      }

      var percent = scale.scale(value);
      return this.getLinearValue(percent);
    }
    /**
     * 如果进行线性映射，返回对应的映射值
     * @protected
     * @param  {Number} percent 百分比
     * @return {*}  颜色值、形状、大小等
     */

  }, {
    key: "getLinearValue",
    value: function getLinearValue(percent) {
      var values = this.values;
      var steps = values.length - 1;
      var step = Math.floor(steps * percent);
      var leftPercent = steps * percent - step;
      var start = values[step];
      var end = step === steps ? start : values[step + 1];
      var rstValue = start + (end - start) * leftPercent;
      return rstValue;
    }
    /**
     * 默认的回调函数
     * @param {*} value 回调函数的值
     * @type {Function}
     * @return {Array} 返回映射后的值
     */

  }, {
    key: "callback",
    value: function callback(value) {
      var self = this;
      var scale = self.scales[0];
      var rstValue = null;

      if (scale.type === 'identity') {
        rstValue = scale.value;
      } else {
        rstValue = self._getAttrValue(scale, value);
      }

      return rstValue;
    }
    /**
     * 根据度量获取属性名
     * @return {Array} dims of this Attribute
     */

  }, {
    key: "getNames",
    value: function getNames() {
      var scales = this.scales;
      var names = this.names;
      var length = Math.min(scales.length, names.length);
      var rst = [];

      for (var i = 0; i < length; i++) {
        rst.push(names[i]);
      }

      return rst;
    }
    /**
     * 根据度量获取维度名
     * @return {Array} dims of this Attribute
     */

  }, {
    key: "getFields",
    value: function getFields() {
      var scales = this.scales;
      var rst = [];

      _util["default"].each(scales, function (scale) {
        rst.push(scale.field);
      });

      return rst;
    }
    /**
     * 根据名称获取度量
     * @param  {String} name the name of scale
     * @return {Scale} scale
     */

  }, {
    key: "getScale",
    value: function getScale(name) {
      var scales = this.scales;
      var names = this.names;
      var index = names.indexOf(name);
      return scales[index];
    }
    /**
     * 映射数据
     * @param {*} param1...paramn 多个数值
     * @return {Array} 映射的值组成的数组
     */

  }, {
    key: "mapping",
    value: function mapping() {
      var scales = this.scales;
      var callback = this.callback;

      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var values = params;

      if (callback) {
        for (var i = 0; i < params.length; i++) {
          params[i] = this._toOriginParam(params[i], scales[i]);
        }

        values = callback.apply(this, params);
      }

      if (this.type === 'color' && !_util["default"].isArray(values)) {
        values = _colorUtil["default"].toRGB(values).map(function (e) {
          return e / 255;
        }); // values[3] = values[3] * 255;
      }

      if (!_util["default"].isArray(values)) {
        values = [values];
      }

      return values;
    } // 原始的参数

  }, {
    key: "_toOriginParam",
    value: function _toOriginParam(param, scale) {
      var rst = param;

      if (!scale.isLinear) {
        if (_util["default"].isArray(param)) {
          rst = [];

          for (var i = 0; i < param.length; i++) {
            rst.push(toScaleString(scale, param[i]));
          }
        } else {
          rst = toScaleString(scale, param);
        }
      }

      return rst;
    }
  }]);

  return AttributeBase;
}();

var _default = AttributeBase;
exports["default"] = _default;