"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tile_mapping = _interopRequireDefault(require("../core/controller/tile_mapping"));

var _index = require("../geom/buffer/index");

var _source = _interopRequireDefault(require("../core/source"));

var _global = _interopRequireDefault(require("../global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pointShape = _global["default"].pointShape;

var WorkerTile =
/*#__PURE__*/
function () {
  function WorkerTile(params) {
    _classCallCheck(this, WorkerTile);

    this.tileID = params.id;
    this.source = params.sourceID;
    this.params = params;
  }

  _createClass(WorkerTile, [{
    key: "parse",
    value: function parse(data, layerstyle, actor, callback) {
      this.status = 'parsing';
      this.data = data;

      var sourceStyle = this._layerStyleGroupBySourceID(layerstyle)[this.source];

      var tile = this.tileID.split('_');
      var sourceLayerData = {}; // 数据源解析

      for (var sourcelayer in sourceStyle) {
        // sourceLayer
        var vectorLayer = data.layers[sourcelayer];

        if (vectorLayer === undefined) {
          return null;
        }

        var style = sourceStyle[sourcelayer][0];
        style.sourceOption.parser.type = 'vector';
        style.sourceOption.parser.tile = tile;
        var tileSource2 = new _source["default"](_objectSpread({}, style.sourceOption, {
          mapType: style.mapType,
          projected: true,
          data: data.layers[sourcelayer]
        }));

        for (var i = 0; i < sourceStyle[sourcelayer].length; i++) {
          var _style = sourceStyle[sourcelayer][i];
          var tileMapping = new _tile_mapping["default"](tileSource2, _style);

          if (_style.type === 'point') {
            _style.shape = this._getPointShape(tileMapping);
          }

          var geometryBuffer = (0, _index.getBuffer)(_style.type, _style.shape);
          var buffer = new geometryBuffer({
            layerData: tileMapping.layerData,
            shape: _style.shape
          });
          sourceLayerData[_style.layerId] = {
            buffer: {
              attributes: buffer.attributes,
              indexArray: buffer.indexArray
            },
            // layerData: tileMapping.layerData,
            // sourceData: tileSource.data,
            shape: _style.shape,
            layerId: _style.layerId,
            sourcelayer: sourcelayer,
            tileId: this.tileID
          };
        }
      }

      this.status = 'done';
      callback(null, _objectSpread({}, sourceLayerData));
    }
  }, {
    key: "_layerStyleGroupBySourceID",
    value: function _layerStyleGroupBySourceID(layerStyles) {
      var sourceStyles = {}; // 支持VectorLayer

      for (var layerId in layerStyles) {
        var sourceID = layerStyles[layerId].sourceOption.id;
        var sourcelayer = layerStyles[layerId].sourceOption.parser.sourceLayer;
        if (!sourceStyles[sourceID]) sourceStyles[sourceID] = {};
        if (!sourceStyles[sourceID][sourcelayer]) sourceStyles[sourceID][sourcelayer] = [];
        sourceStyles[sourceID][sourcelayer].push(layerStyles[layerId]);
      }

      return sourceStyles;
    }
  }, {
    key: "_getPointShape",
    value: function _getPointShape(tileMapping) {
      var shape = null;

      if (!tileMapping.layerData[0].hasOwnProperty('shape')) {
        return 'normal';
      }

      for (var i = 0; i < tileMapping.layerData.length; i++) {
        shape = tileMapping.layerData[i].shape;

        if (shape !== undefined) {
          break;
        }
      } // 2D circle 特殊处理


      if (pointShape['2d'].indexOf(shape) !== -1) {
        return 'fill';
      } else if (pointShape['3d'].indexOf(shape) !== -1) {
        return 'extrude';
      } // TODO 图片支持
      //  else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
      //   return 'image';
      // }


      return 'text';
    }
  }]);

  return WorkerTile;
}();

exports["default"] = WorkerTile;