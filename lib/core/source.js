"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var _source = require("../source");

var _cluster = require("../source/transform/cluster");

var _geo = require("../util/geo");

var _util = require("@antv/util");

var _index = require("../map/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Source =
/*#__PURE__*/
function (_Base) {
  _inherits(Source, _Base);

  _createClass(Source, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return {
        data: null,
        defs: {},
        parser: {},
        transforms: [],
        scaledefs: {},
        scales: {},
        options: {}
      };
    }
  }]);

  function Source(cfg) {
    var _this;

    _classCallCheck(this, Source);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Source).call(this, cfg));

    var transform = _this.get('transforms');

    _this._transforms = transform || [];
    var mapType = _this.get('mapType') || 'AMap';
    _this.projectFlat = (0, _index.getMap)(mapType).project; // 数据解析

    _this._init();

    return _this;
  }

  _createClass(Source, [{
    key: "_init",
    value: function _init() {
      this._excuteParser();

      var isCluster = this.get('isCluster') || false;
      isCluster && this._executeCluster(); // 数据转换 统计，聚合，分类

      this._executeTrans(); // 坐标转换


      if (!this.get('projected')) {
        this._projectCoords();
      }
    }
  }, {
    key: "setData",
    value: function setData(data) {
      var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      Object.assign(this._attrs, cfg);
      var transform = this.get('transforms');
      this._transforms = transform || [];
      this.set('data', data);

      this._init();
    } // 数据更新

  }, {
    key: "updateTransfrom",
    value: function updateTransfrom(cfg) {
      var transforms = cfg.transforms;
      this._transforms = transforms;
      this.data = (0, _util.clone)(this.originData);

      this._executeTrans();

      this._projectCoords();
    }
  }, {
    key: "_excuteParser",
    value: function _excuteParser() {
      var parser = this.get('parser');
      var _parser$type = parser.type,
          type = _parser$type === void 0 ? 'geojson' : _parser$type;
      var data = this.get('data');
      this.originData = (0, _source.getParser)(type)(data, parser); // this.data = {
      //   dataArray: clone(this.originData.dataArray)
      // }; // TODO 关闭数据备份

      this.data = this.originData;

      if (this.data !== null && !this.get('projected')) {
        this.data.extent = (0, _geo.extent)(this.data.dataArray);
      }
    }
    /**
     * 数据统计
     */

  }, {
    key: "_executeTrans",
    value: function _executeTrans() {
      var _this2 = this;

      var trans = this._transforms;
      trans.forEach(function (tran) {
        var type = tran.type;
        var data = (0, _source.getTransform)(type)(_this2.data, tran);
        Object.assign(_this2.data, data);
      });
      this._transforms = trans;
    }
  }, {
    key: "transform",
    value: function transform(option) {
      var data = (0, _source.getTransform)(option.type)(this.data, option);
      Object.assign(this.data, data);
    }
  }, {
    key: "_executeCluster",
    value: function _executeCluster() {
      var clusterCfg = this.get('Cluster') || {};
      var zoom = this.get('zoom');
      clusterCfg.zoom = Math.floor(zoom);
      this.set('cluster', clusterCfg);
      var clusterData = (0, _cluster.cluster)(this.data, clusterCfg);
      this.data = clusterData.data;
      this.pointIndex = clusterData.pointIndex;
    }
  }, {
    key: "updateCusterData",
    value: function updateCusterData(zoom, bbox) {
      var clusterPoint = this.pointIndex.getClusters(bbox, zoom);
      this.data.dataArray = (0, _cluster.formatData)(clusterPoint);
      var clusterCfg = this.get('Cluster') || {};
      clusterCfg.zoom = Math.floor(zoom);
      clusterCfg.bbox = bbox;
      this.set('cluster', clusterCfg);

      this._projectCoords();
    }
  }, {
    key: "_projectCoords",
    value: function _projectCoords() {
      var _this3 = this;

      if (this.data === null) {
        return;
      }

      this.data.dataArray.forEach(function (data) {
        // data.coordinates = this._coordProject(data.coordinates);
        data.coordinates = (0, _geo.tranfrormCoord)(data.coordinates, _this3._coorConvert.bind(_this3));
      });
    }
  }, {
    key: "_getCoord",
    value: function _getCoord(geo) {
      if (geo.geometry) {
        // GeoJSON feature
        geo = geo.geometry.coordinates;
      } else if (geo.coordinates) {
        // GeoJSON geometry
        geo = geo.coordinates;
      }

      return geo;
    }
  }, {
    key: "_coordProject",
    value: function _coordProject(geo) {
      var _this4 = this;

      if (Array.isArray(geo[0][0])) {
        return geo.map(function (coor) {
          return _this4._coordProject(coor);
        });
      }

      if (!Array.isArray(geo[0])) {
        return this._coorConvert(geo);
      }

      return geo.map(function (coor) {
        return _this4._coorConvert(coor);
      });
    }
  }, {
    key: "_coorConvert",
    value: function _coorConvert(geo) {
      var ll = this.projectFlat(geo);
      return [ll.x, ll.y, geo[2] || 0];
    }
  }, {
    key: "getSelectFeature",
    value: function getSelectFeature(featureId) {
      var data = this.get('data'); // 如果是GeoJSON 数据返回原数
      // 颜色编码从1开始，要素索引从0开始，所以颜色转变要素需要减1

      var isCluster = this.get('isCluster') || false;
      return data.features && !isCluster ? data.features[featureId - 1] : this.data.dataArray[featureId - 1];
    }
  }, {
    key: "getSeletFeatureIndex",
    value: function getSeletFeatureIndex(featureId) {
      var data = this.get('data');

      if (!data.features) {
        return featureId - 1;
      }

      var featureIndex = 0;

      for (var i = 0; i < this.data.dataArray.length; i++) {
        var item = this.data.dataArray[i];

        if (item._id === featureId) {
          break;
        }

        featureIndex++;
      }

      return featureIndex;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.data = null;
      this.originData = null;
    }
  }]);

  return Source;
}(_base["default"]);

exports["default"] = Source;