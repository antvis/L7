"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _util = _interopRequireDefault(require("../util"));

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
 * @class Scale.Category
 */
var Category =
/*#__PURE__*/
function (_Base) {
  _inherits(Category, _Base);

  function Category() {
    _classCallCheck(this, Category);

    return _possibleConstructorReturn(this, _getPrototypeOf(Category).apply(this, arguments));
  }

  _createClass(Category, [{
    key: "getDefaultCfg",

    /**
     * @override
     */
    value: function getDefaultCfg() {
      var cfg = _get(_getPrototypeOf(Category.prototype), "getDefaultCfg", this).call(this);

      return _util["default"].mix({}, cfg, {
        /**
         * type of the scale
         * @type {String}
         */
        type: 'cat',

        /**
         * 自动生成标记时的个数
         * @type {Number}
         * @default null
         */
        tickCount: null,

        /**
         * 是否分类度量
         * @type {Boolean}
         */
        isCategory: true
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
      var tickCount = self.tickCount;

      _util["default"].each(values, function (v, i) {
        values[i] = v.toString();
      });

      if (!self.ticks) {
        var ticks = values;

        if (tickCount) {
          var temp = (0, _cat["default"])({
            maxCount: tickCount,
            data: values
          });
          ticks = temp.ticks;
        }

        this.ticks = ticks;
      }
    }
    /**
     * @override
     */

  }, {
    key: "getText",
    value: function getText(value) {
      if (this.values.indexOf(value) === -1 && _util["default"].isNumber(value)) {
        value = this.values[Math.round(value)];
      }

      return _get(_getPrototypeOf(Category.prototype), "getText", this).call(this, value);
    }
    /**
     * @override
     */

  }, {
    key: "translate",
    value: function translate(value) {
      var index = this.values.indexOf(value);

      if (index === -1 && _util["default"].isNumber(value)) {
        index = value;
      } else if (index === -1) {
        index = NaN;
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
      var percent;

      if (_util["default"].isString(value) || this.values.indexOf(value) !== -1) {
        value = this.translate(value);
      }

      if (this.values.length > 1) {
        percent = value / (this.values.length - 1);
      } else {
        percent = value;
      }

      return rangeMin + percent * (rangeMax - rangeMin);
    }
    /**
     * @override
     */

  }, {
    key: "invert",
    value: function invert(value) {
      if (_util["default"].isString(value)) {
        // 如果已经是字符串
        return value;
      }

      var min = this.rangeMin();
      var max = this.rangeMax(); // 归一到 范围内

      if (value < min) {
        value = min;
      }

      if (value > max) {
        value = max;
      }

      var percent = (value - min) / (max - min);
      var index = Math.round(percent * (this.values.length - 1)) % this.values.length;
      index = index || 0;
      return this.values[index];
    }
  }]);

  return Category;
}(_base["default"]);

var _default = Category;
exports["default"] = _default;