"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("../core/base"));

var _worker_pool = _interopRequireDefault(require("../worker/worker_pool"));

var _throttle = _interopRequireDefault(require("../util/throttle"));

var _source_cache = _interopRequireDefault(require("../source/source_cache"));

var _worker_controller = _interopRequireDefault(require("../worker/worker_controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// 统一管理所有的Source
// 统一管理地图样式
var Style =
/*#__PURE__*/
function (_Base) {
  _inherits(Style, _Base);

  function Style(scene, cfg) {
    var _this;

    _classCallCheck(this, Style);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Style).call(this, cfg));
    _this.scene = scene;
    _this._sourceCaches = {};
    _this.WorkerPool = new _worker_pool["default"]();
    _this._tileMap = {};
    _this.WorkerController = new _worker_controller["default"](_this.WorkerPool, _assertThisInitialized(_this));
    _this.layerStyles = {};
    _this.layers = [];

    _this.addMapEvent();

    return _this;
  }

  _createClass(Style, [{
    key: "addSource",
    value: function addSource(id, sourceCfg) {
      if (this._sourceCaches[id] !== undefined) {
        throw new Error('SourceID 已存在');
      }

      sourceCfg.sourceID = id;
      this._sourceCaches[id] = new _source_cache["default"](this.scene, sourceCfg);
    }
  }, {
    key: "getSource",
    value: function getSource(id) {
      return this._sourceCaches[id];
    }
  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      var id = layer.layerId;
      this.layers[id] = layer;
    } // 设置

  }, {
    key: "_addTileStyle",
    value: function _addTileStyle(layerCfg) {
      var layerid = layerCfg.layerId;
      this.layerStyles[layerid] = layerCfg;

      this._layerStyleGroupBySourceID();

      this.WorkerController.broadcast('setLayers', this.layerStyles); // TODO 更新 style
    }
  }, {
    key: "removeTileStyle",
    value: function removeTileStyle(id) {
      delete this.layerStyles[id];

      this._layerStyleGroupBySourceID();
    }
  }, {
    key: "_layerStyleGroupBySourceID",
    value: function _layerStyleGroupBySourceID() {
      var sourceStyles = []; // 支持VectorLayer

      for (var layerId in this.layerStyles) {
        var sourceID = this.layerStyles[layerId].sourceOption.id;
        var sourcelayer = this.layerStyles[layerId].sourceOption.parser.sourceLayer;
        if (!sourceStyles[sourceID]) sourceStyles[sourceID] = {};
        if (!sourceStyles[sourceID][sourcelayer]) sourceStyles[sourceID][sourcelayer] = [];
        sourceStyles[sourceID][sourcelayer].push(this.layerStyles[layerId]);
      }

      this.sourceStyles = sourceStyles;
    }
  }, {
    key: "update",
    value: function update(parameters) {
      this._addTileStyle(parameters);

      for (var key in this._sourceCaches) {
        this._sourceCaches[key].update(this.layers, this.sourceStyles[key]);
      }
    }
  }, {
    key: "addMapEvent",
    value: function addMapEvent() {
      var _this2 = this;

      this.mapEventHander = (0, _throttle["default"])(function () {
        requestAnimationFrame(function () {
          for (var key in _this2._sourceCaches) {
            _this2._sourceCaches[key].update(_this2.layers, _this2.sourceStyles[key]);
          }
        });
      }, 200);
      this.scene.map.on('zoomchange', this.mapEventHander);
      this.scene.map.on('dragend', this.mapEventHander);
    }
  }, {
    key: "clearMapEvent",
    value: function clearMapEvent() {
      this.scene.map.off('zoomchange', this.mapEventHander);
      this.scene.map.off('dragend', this.mapEventHander);
    } // 计算视野内的瓦片坐标

  }]);

  return Style;
}(_base["default"]);

exports["default"] = Style;