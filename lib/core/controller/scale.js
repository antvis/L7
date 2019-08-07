"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

var _global = _interopRequireDefault(require("../../global"));

var _scale = _interopRequireDefault(require("../../scale/"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;
var TYPES = {
  LINEAR: 'linear',
  CAT: 'cat',
  TIME: 'time'
};

var ScaleController =
/*#__PURE__*/
function () {
  function ScaleController(cfg) {
    _classCallCheck(this, ScaleController);

    // defs 列定义
    this.defs = {};

    _util["default"].assign(this, cfg);
  }

  _createClass(ScaleController, [{
    key: "_getDef",
    value: function _getDef(field) {
      var defs = this.defs;
      var def = null;

      if (_global["default"].scales[field] || defs[field]) {
        def = _util["default"].mix({}, _global["default"].scales[field]); // 处理覆盖属性的问题

        _util["default"].each(defs[field], function (v, k) {
          if (_util["default"].isNil(v)) {
            delete def[k];
          } else {
            def[k] = v;
          }
        });
      }

      return def;
    }
  }, {
    key: "_getDefaultType",
    value: function _getDefaultType(field, data) {
      var type = TYPES.LINEAR;

      var value = _util["default"].Array.firstValue(data, field);

      if (_util["default"].isArray(value)) {
        value = value[0];
      }

      if (dateRegex.test(value)) {
        type = TYPES.TIME;
      } else if (_util["default"].isString(value)) {
        type = TYPES.CAT;
      }

      return type;
    }
  }, {
    key: "_getScaleCfg",
    value: function _getScaleCfg(type, field, data) {
      var cfg = {
        field: field
      };

      var values = _util["default"].Array.values(data, field);

      cfg.values = values;

      if (!_scale["default"].isCategory(type) && type !== 'time') {
        var range = _util["default"].Array.getRange(values);

        cfg.min = range.min;
        cfg.max = range.max;
        cfg.nice = true;
      }

      if (type === 'time') {
        cfg.nice = false;
      }

      return cfg;
    }
  }, {
    key: "createScale",
    value: function createScale(field, data) {
      var self = this;

      var def = self._getDef(field);

      var scale; // 如果数据为空直接返回常量度量

      if (!data || !data.length) {
        if (def && def.type) {
          scale = _scale["default"][def.type](def);
        } else {
          scale = _scale["default"].identity({
            value: field,
            field: field.toString(),
            values: [field]
          });
        }

        return scale;
      }

      var firstValue = _util["default"].Array.firstValue(data, field);

      if (_util["default"].isNumber(field) || _util["default"].isNil(firstValue) && !def) {
        scale = _scale["default"].identity({
          value: field,
          field: field.toString(),
          values: [field]
        });
      } else {
        // 如果已经定义过这个度量
        var type;

        if (def) {
          type = def.type;
        }

        type = type || self._getDefaultType(field, data);

        var cfg = self._getScaleCfg(type, field, data);

        if (def) {
          _util["default"].mix(cfg, def);
        }

        scale = _scale["default"][type](cfg);
      }

      return scale;
    }
  }]);

  return ScaleController;
}();

var _default = ScaleController;
exports["default"] = _default;