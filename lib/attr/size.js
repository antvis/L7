"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _util = _interopRequireDefault(require("../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 视觉通道 size
 * @class Attr.Size
 */
var Size =
/*#__PURE__*/
function (_Base) {
  _inherits(Size, _Base);

  function Size(cfg) {
    var _this;

    _classCallCheck(this, Size);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Size).call(this, cfg));
    _this.names = ['size'];
    _this.type = 'size';
    _this.gradient = null;
    _this.domainIndex = 0;
    return _this;
  }

  _createClass(Size, [{
    key: "mapping",
    value: function mapping() {
      // 重构
      var self = this;
      var outputs = [];
      var scales = self.scales;

      if (self.values.length === 0) {
        var callback = this.callback.bind(this);
        outputs.push(callback.apply(void 0, arguments));
      } else {
        if (!_util["default"].isArray(self.values[0])) {
          self.values = [self.values];
        }

        for (var i = 0; i < scales.length; i++) {
          outputs.push(self._scaling(scales[i], arguments[i]));
        }
      }

      this.domainIndex = 0;
      return outputs;
    }
  }, {
    key: "_scaling",
    value: function _scaling(scale, v) {
      if (scale.type === 'identity') {
        return v;
      }

      var percent = scale.scale(v);
      return this.getLinearValue(percent); // else if (scale.type === 'linear') {
    }
  }, {
    key: "getLinearValue",
    value: function getLinearValue(percent) {
      var values = this.values[this.domainIndex];
      var steps = values.length - 1;
      var step = Math.floor(steps * percent);
      var leftPercent = steps * percent - step;
      var start = values[step];
      var end = step === steps ? start : values[step + 1];
      var rstValue = start + (end - start) * leftPercent;
      this.domainIndex += 1;
      return rstValue;
    }
  }]);

  return Size;
}(_base["default"]);

var _default = Size;
exports["default"] = _default;