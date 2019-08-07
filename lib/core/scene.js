"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("./engine"));

var _layer = require("../layer");

var _base = _interopRequireDefault(require("./base"));

var _image = _interopRequireDefault(require("./image"));

var _fontManager = _interopRequireDefault(require("../geom/buffer/point/text/font-manager"));

var _index = require("../map/index");

var _global = _interopRequireDefault(require("../global"));

var _index2 = require("../interaction/index");

var _shader = require("../geom/shader");

var _style = _interopRequireDefault(require("./style"));

var _crsEpsg = require("@antv/geo-coord/lib/geo/crs/crs-epsg3857");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Scene =
/*#__PURE__*/
function (_Base) {
  _inherits(Scene, _Base);

  _createClass(Scene, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return _global["default"].scene;
    }
  }]);

  function Scene(cfg) {
    var _this;

    _classCallCheck(this, Scene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scene).call(this, cfg));

    _this._initMap();

    _this.crs = _crsEpsg.epsg3857; // this._initAttribution(); // 暂时取消，后面作为组件去加载

    _this.addImage();

    _this.fontAtlasManager = new _fontManager["default"]();
    _this._layers = [];
    _this.animateCount = 0;
    return _this;
  }

  _createClass(Scene, [{
    key: "_initEngine",
    value: function _initEngine(mapContainer) {
      this._engine = new _engine["default"](mapContainer, this);
      this.registerMapEvent(); // this._engine.run();

      (0, _shader.compileBuiltinModules)();
    } // 为pickup场景添加 object 对象

  }, {
    key: "addPickMesh",
    value: function addPickMesh(object) {
      this._engine._picking.add(object);
    }
  }, {
    key: "_initMap",
    value: function _initMap() {
      var _this2 = this;

      this.mapContainer = this.get('id');
      this.mapType = this.get('mapType') || 'amap';
      var MapProvider = (0, _index.getMap)(this.mapType);
      var Map = new MapProvider(this._attrs);
      Map.mixMap(this);
      this._container = Map.container;
      Map.on('mapLoad', function () {
        _this2.map = Map.map;

        _this2._initEngine(Map.renderDom);

        Map.asyncCamera(_this2._engine);

        _this2.initLayer();

        _this2._registEvents();

        var hash = _this2.get('hash');

        if (hash) {
          var Ctor = (0, _index2.getInteraction)('hash');
          var interaction = new Ctor({
            layer: _this2
          });

          interaction._onHashChange();
        }

        _this2.style = new _style["default"](_this2, {});

        _this2.emit('loaded');

        _this2._engine.update();
      });
    }
  }, {
    key: "initLayer",
    value: function initLayer() {
      var _this3 = this;

      var _loop = function _loop(key) {
        Scene.prototype[key] = function (cfg) {
          var layer = new _layer.LAYER_MAP[key](_this3, cfg);

          _this3._layers.push(layer);

          return layer;
        };
      };

      for (var key in _layer.LAYER_MAP) {
        _loop(key);
      }
    } // 添加 Tile Source

  }, {
    key: "addTileSource",
    value: function addTileSource(id, Sourcecfg) {
      this.style.addSource(id, Sourcecfg);
    }
  }, {
    key: "getTileSource",
    value: function getTileSource(id) {
      return this.style.getSource(id);
    }
  }, {
    key: "on",
    value: function on(type, hander) {
      if (this.map) {
        this.map.on(type, hander);
      }

      _get(_getPrototypeOf(Scene.prototype), "on", this).call(this, type, hander);
    }
  }, {
    key: "off",
    value: function off(type, hander) {
      if (this.map) {
        this.map.off(type, hander);
      }

      _get(_getPrototypeOf(Scene.prototype), "off", this).call(this, type, hander);
    }
  }, {
    key: "addImage",
    value: function addImage() {
      this.image = new _image["default"]();
    }
  }, {
    key: "_initEvent",
    value: function _initEvent() {}
  }, {
    key: "getLayers",
    value: function getLayers() {
      return this._layers;
    }
  }, {
    key: "_addLayer",
    value: function _addLayer() {}
  }, {
    key: "_registEvents",
    value: function _registEvents() {
      var _this4 = this;

      var events = ['mouseout', 'mouseover', 'mousemove', 'mousedown', 'mouseleave', 'mouseup', 'rightclick', 'click', 'dblclick'];
      events.forEach(function (event) {
        _this4._container.addEventListener(event, function (e) {
          // 要素拾取
          e.pixel || (e.pixel = e.point);
          requestAnimationFrame(function () {
            _this4._engine._picking.pickdata(e);
          });
        }, false);
      });
    }
  }, {
    key: "removeLayer",
    value: function removeLayer(layer) {
      var layerIndex = this._layers.indexOf(layer);

      if (layerIndex > -1) {
        this._layers.splice(layerIndex, 1);
      }

      layer.destroy();
      layer = null;
    }
  }, {
    key: "startAnimate",
    value: function startAnimate() {
      if (this.animateCount === 0) {
        this.unRegsterMapEvent();

        this._engine.run();
      }

      this.animateCount++;
    }
  }, {
    key: "stopAnimate",
    value: function stopAnimate() {
      if (this.animateCount === 1) {
        this._engine.stop();

        this.registerMapEvent();
      }

      this.animateCount++;
    } // 地图状态变化时更新可视化渲染

  }, {
    key: "registerMapEvent",
    value: function registerMapEvent() {
      var _this5 = this;

      this._updateRender = function () {
        return _this5._engine.update();
      };

      this.map.on('mousemove', this._updateRender);
      this.map.on('mapmove', this._updateRender);
      this.map.on('camerachange', this._updateRender);
    }
  }, {
    key: "unRegsterMapEvent",
    value: function unRegsterMapEvent() {
      this.map.off('mousemove', this._updateRender);
      this.map.off('mapmove', this._updateRender);
      this.map.off('camerachange', this._updateRender);
    }
  }]);

  return Scene;
}(_base["default"]);

exports["default"] = Scene;