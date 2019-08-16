"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("../../util"));

var _global = _interopRequireDefault(require("../../global"));

var _scale = _interopRequireDefault(require("./scale"));

var _base = _interopRequireDefault(require("../base"));

var _index = _interopRequireDefault(require("../../attr/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TileMapping =
/*#__PURE__*/
function (_Base) {
  _inherits(TileMapping, _Base);

  function TileMapping(source, cfg) {
    var _this;

    _classCallCheck(this, TileMapping);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TileMapping).call(this, cfg));
    _this.source = source;

    _this._init();

    return _this;
  }

  _createClass(TileMapping, [{
    key: "_init",
    value: function _init() {
      this._initControllers();

      this._initTileAttrs();

      this._mapping();
    }
  }, {
    key: "update",
    value: function update() {
      this.set('scales', {});

      this._initTileAttrs();

      this._updateMaping();
    }
  }, {
    key: "_initControllers",
    value: function _initControllers() {
      var scalesOption = this.get('scaleOptions');
      var scaleController = new _scale["default"]({
        defs: _objectSpread({}, scalesOption)
      });
      this.set('scaleController', scaleController);
    }
  }, {
    key: "_createScale",
    value: function _createScale(field) {
      var scales = this.get('scales');

      this._initControllers(); // scale更新


      var scale = scales[field];

      if (!scale) {
        scale = this.createScale(field);
        scales[field] = scale;
      }

      return scale;
    }
  }, {
    key: "createScale",
    value: function createScale(field) {
      var data = this.source.data.dataArray;
      var scales = this.get('scales');
      var scale = scales[field];
      var scaleController = this.get('scaleController');

      if (!scale) {
        scale = scaleController.createScale(field, data);
        scales[field] = scale;
      }

      return scale;
    } // 获取属性映射的值

  }, {
    key: "_getAttrValues",
    value: function _getAttrValues(attr, record) {
      var scales = attr.scales;
      var params = [];

      for (var i = 0; i < scales.length; i++) {
        var scale = scales[i];
        var field = scale.field;

        if (scale.type === 'identity') {
          params.push(scale.value);
        } else {
          params.push(record[field]);
        }
      }

      var indexZoom = params.indexOf('zoom');
      indexZoom !== -1 ? params[indexZoom] = attr.zoom : null;
      var values = attr.mapping.apply(attr, params);
      return values;
    }
  }, {
    key: "_mapping",
    value: function _mapping() {
      var attrs = this.get('attrs');
      var mappedData = [];
      var data = this.source.data.dataArray;

      for (var i = 0; i < data.length; i++) {
        var record = data[i];
        var newRecord = {};
        newRecord.id = data[i]._id;

        for (var k in attrs) {
          if (attrs.hasOwnProperty(k)) {
            var attr = attrs[k];
            var names = attr.names;

            var values = this._getAttrValues(attr, record);

            if (names.length > 1) {
              // position 之类的生成多个字段的属性
              for (var j = 0; j < values.length; j++) {
                var val = values[j];
                var name = names[j];
                newRecord[name] = _util["default"].isArray(val) && val.length === 1 ? val[0] : val; // 只有一个值时返回第一个属性值
              }
            } else {
              newRecord[names[0]] = values.length === 1 ? values[0] : values;
            }
          }
        }

        newRecord.coordinates = record.coordinates;
        mappedData.push(newRecord);
      } // 通过透明度过滤数据


      if (attrs.hasOwnProperty('filter')) {
        mappedData.forEach(function (item) {
          if (item.filter === false) {
            item.color[3] = 0;
            item.id = -item.id;
          }
        });
      }

      this.layerData = mappedData;
    }
    /**
     * 更新数据maping
     * @param {*} layerSource 数据源
     * @param {*} layer map
     */

  }, {
    key: "_updateMaping",
    value: function _updateMaping() {
      var attrs = this.get('attrs');
      var data = this.source.data.dataArray;
      var layerData = this.layerData;

      for (var i = 0; i < data.length; i++) {
        var record = data[i];

        for (var attrName in attrs) {
          if (attrs.hasOwnProperty(attrName) && attrs[attrName].neadUpdate) {
            var attr = attrs[attrName];
            var names = attr.names;

            var values = this._getAttrValues(attr, record);

            if (names.length > 1) {
              // position 之类的生成多个字段的属性
              for (var j = 0; j < values.length; j++) {
                var val = values[j];
                var name = names[j];
                layerData[i][name] = _util["default"].isArray(val) && val.length === 1 ? val[0] : val; // 只有一个值时返回第一个属性值
              }
            } else {
              layerData[i][names[0]] = values.length === 1 ? values[0] : values;
            }

            attr.neadUpdate = true;
          }
        }
      }
    }
  }, {
    key: "_initTileAttrs",
    value: function _initTileAttrs() {
      var attrOptions = this.get('attrOptions');

      for (var type in attrOptions) {
        if (attrOptions.hasOwnProperty(type)) {
          this._updateTileAttr(type);
        }
      }
    }
  }, {
    key: "_updateTileAttr",
    value: function _updateTileAttr(type) {
      var self = this;
      var attrs = this.get('attrs');
      var attrOptions = this.get('attrOptions');
      var option = attrOptions[type];
      option.neadUpdate = true;

      var className = _util["default"].upperFirst(type);

      var fields = this._parseFields(option.field);

      var scales = [];

      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];

        var scale = self._createScale(field);

        if (type === 'color' && _util["default"].isNil(option.values)) {
          // 设置 color 的默认色值
          option.values = _global["default"].colors;
        }

        scales.push(scale);
      }

      option.scales = scales;
      var attr = new _index["default"][className](option);
      attrs[type] = attr;
    }
  }, {
    key: "_parseFields",
    value: function _parseFields(field) {
      if (_util["default"].isArray(field)) {
        return field;
      }

      if (_util["default"].isString(field)) {
        return field.split('*');
      }

      return [field];
    }
  }]);

  return TileMapping;
}(_base["default"]);

exports["default"] = TileMapping;