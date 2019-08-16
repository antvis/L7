"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

var THREE = _interopRequireWildcard(require("./three"));

var _colorUtil = _interopRequireDefault(require("../attr/color-util"));

var _index = _interopRequireDefault(require("./controller/index"));

var _source2 = _interopRequireDefault(require("./source"));

var _diff = _interopRequireDefault(require("../util/diff"));

var _object3dUtil = require("../util/object3d-util");

var _util = _interopRequireDefault(require("../util"));

var _global = _interopRequireDefault(require("../global"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var id = 1;

function parseFields(field) {
  if (_util["default"].isArray(field)) {
    return field;
  }

  if (_util["default"].isString(field)) {
    return field.split('*');
  }

  return [field];
}

var Layer =
/*#__PURE__*/
function (_Base) {
  _inherits(Layer, _Base);

  _createClass(Layer, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return {
        visible: true,
        zIndex: 0,
        type: '',
        minZoom: 0,
        maxZoom: 22,
        rotation: 0,
        option: {},
        attrOptions: {},
        scaleOptions: {},
        preScaleOptions: null,
        scales: {},
        attrs: {},
        // 样式配置项
        styleOptions: {
          stroke: [1, 1, 1, 1],
          strokeWidth: 1.0,
          opacity: 1.0,
          strokeOpacity: 1.0,
          texture: false,
          blending: 'normal'
        },
        destroyed: false,
        // 选中时的配置项
        selectedOptions: null,
        // active 时的配置项
        activedOptions: {
          fill: [1.0, 0, 0, 1.0]
        },
        interactions: {},
        animateOptions: {
          enable: false
        }
      };
    }
  }]);

  function Layer(scene, cfg) {
    var _this;

    _classCallCheck(this, Layer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layer).call(this, cfg));
    _this.scene = scene;
    _this.map = scene.map;
    _this._object3D = new THREE.Object3D();
    _this._pickObject3D = new THREE.Object3D();
    _this._object3D.visible = _this.get('visible');
    _this._object3D.renderOrder = _this.get('zIndex') || 0;
    _this._mapEventHandlers = [];

    var layerId = _this._getUniqueId();

    _this.set('layerId', layerId);

    _this.set('mapType', _this.scene.mapType);

    _this.layerId = layerId;
    _this._activeIds = null;
    var world = scene._engine.world;
    world.add(_this._object3D);
    _this.layerMesh = null;
    _this.layerLineMesh = null;

    _this._initEvents();

    return _this;
  }
  /**
   * 将图层添加加到 Object
   * @param {*} object three 物体
    * @param {*} type mesh类型是区别是填充还是边线
   */


  _createClass(Layer, [{
    key: "add",
    value: function add(object) {
      var _this2 = this;

      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fill';

      // composer合图层绘制
      if (object.type === 'composer') {
        this._object3D = object;

        this.scene._engine.composerLayers.push(object);

        setTimeout(function () {
          return _this2.scene._engine.update();
        }, 500);
        return;
      }

      type === 'fill' ? this.layerMesh = object : this.layerLineMesh = object;

      this._visibleWithZoom();

      object.onBeforeRender = function () {
        // 每次渲染前改变状态
        var zoom = _this2.scene.getZoom();

        (0, _object3dUtil.updateObjecteUniform)(_this2._object3D, {
          u_time: _this2.scene._engine.clock.getElapsedTime(),
          u_zoom: zoom
        });

        _this2.preRender();
      };

      object.onAfterRender = function () {
        // 每次渲染后改变状态
        _this2.afterRender();
      };

      this._object3D.add(object);

      if (type === 'fill') {
        this.get('pickingController').addPickMesh(object);
      }

      this.scene._engine.update(); // setTimeout(() => this.scene._engine.update(), 200);

    }
  }, {
    key: "remove",
    value: function remove(object) {
      if (object.type === 'composer') {
        this.scene._engine.composerLayers = this.scene._engine.composerLayers.filter(function (layer) {
          return layer !== object;
        });
        return;
      }

      this._object3D.remove(object);
    }
  }, {
    key: "_getUniqueId",
    value: function _getUniqueId() {
      return id++;
    }
  }, {
    key: "_visible",
    value: function _visible(visible) {
      this.set('visible', visible);
      this._object3D.visible = this.get('visible');
    } // 兼容瓦片source，非瓦片source

  }, {
    key: "source",
    value: function source(data) {
      var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // 根据Source类型判断，是不是瓦片图层
      if (this.scene.getTileSource(data)) {
        this.set('layerType', 'tile');
        this.set('sourceOption', _objectSpread({
          id: data
        }, cfg));
        this.scene.style.addLayer(this); // 初始化tiles

        this.tiles = new THREE.Object3D();

        this._object3D.add(this.tiles);

        return this;
      }

      if (data instanceof _source2["default"]) {
        this.layerSource = data;
        return this;
      }

      cfg.data = data;
      cfg.mapType = this.scene.mapType;
      cfg.zoom = this.scene.getZoom();
      this.layerSource = new _source2["default"](cfg);
      return this;
    }
  }, {
    key: "color",
    value: function color(field, values) {
      this._createAttrOption('color', field, values, _global["default"].colors);

      return this;
    }
  }, {
    key: "size",
    value: function size(field, values) {
      var fields = parseFields(field);

      if (fields.indexOf('zoom') !== -1) {
        this._zoomScale = true;
      }

      if (_util["default"].isArray(fields) && !values) values = fields;

      this._createAttrOption('size', field, values, _global["default"].size);

      return this;
    }
  }, {
    key: "scale",
    value: function scale(field, cfg) {
      var options = this.get('scaleOptions');
      var scaleDefs = options;

      if (_util["default"].isObject(field)) {
        _util["default"].mix(scaleDefs, field);
      } else {
        scaleDefs[field] = cfg;
      }

      return this;
    }
  }, {
    key: "shape",
    value: function shape(field, values) {
      if (field.split(':').length === 2) {
        this.shapeType = field.split(':')[0];
        field = field.split(':')[1];
      }

      values === 'text' ? this.shapeType = values : null;

      this._createAttrOption('shape', field, values, _global["default"].shape);

      return this;
    }
  }, {
    key: "pattern",
    value: function pattern(field, values) {
      this._createAttrOption('pattern', field, values, _global["default"].pattern);

      return this;
    }
    /**
     * 是否允许使用默认的图形激活交互
     * @param  {Boolean} enable 是否允许激活开关
     * @param {Object} cfg 激活的配置项
     * @return {Geom}    返回 geom 自身
     */

  }, {
    key: "active",
    value: function active(enable, cfg) {
      if (enable === false) {
        this.set('allowActive', false);
      } else if (_util["default"].isObject(enable) && enable.fill) {
        this.set('allowActive', true);
        if (enable.fill) enable.fill = _colorUtil["default"].color2RGBA(enable.fill);
        this.set('activedOptions', enable);
      } else {
        this.set('allowActive', true);
        this.set('activedOptions', cfg || {
          fill: _colorUtil["default"].color2RGBA(_global["default"].activeColor)
        });
      }

      return this;
    }
  }, {
    key: "style",
    value: function style(field, cfg) {
      var colorItem = ['fill', 'stroke', 'color', 'baseColor', 'brightColor', 'windowColor'];
      var styleOptions = this.get('styleOptions');

      if (!styleOptions) {
        styleOptions = {};
        this.set('styleOptions', styleOptions);
      }

      if (_util["default"].isObject(field)) {
        cfg = field;
        field = null;
      }

      var fields;

      if (field) {
        fields = parseFields(field);
      }

      styleOptions.fields = fields;

      _util["default"].assign(styleOptions, cfg);

      for (var item in cfg) {
        if (colorItem.indexOf(item) !== -1 && styleOptions[item] !== 'none') {
          styleOptions[item] = _colorUtil["default"].color2RGBA(styleOptions[item]);
        }
      }

      this.set('styleOptions', styleOptions);
      return this;
    }
  }, {
    key: "filter",
    value: function filter(field, values) {
      this._createAttrOption('filter', field, values, true);

      return this;
    }
  }, {
    key: "animate",
    value: function animate(field, cfg) {
      var animateOptions = this.get('animateOptions');

      if (!animateOptions) {
        animateOptions = {};
        this.set('animateOptions', animateOptions);
      }

      if (_util["default"].isObject(field)) {
        cfg = field;
        field = null;
      }

      var fields;

      if (field) {
        fields = parseFields(field);
      }

      animateOptions.fields = fields;

      _util["default"].assign(animateOptions, cfg);

      this.set('animateOptions', animateOptions);
      return this;
    }
  }, {
    key: "fitBounds",
    value: function fitBounds() {
      var extent = this.layerSource.data.extent;
      this.scene.fitBounds(extent);
    }
  }, {
    key: "hide",
    value: function hide() {
      this._visible(false);

      return this;
    }
  }, {
    key: "show",
    value: function show() {
      this._visible(true);

      return this;
    }
  }, {
    key: "setData",
    value: function setData(data, cfg) {
      this.layerSource.setData(data, cfg);
      this.repaint();
    }
  }, {
    key: "_createScale",
    value: function _createScale(field) {
      // TODO scale更新
      var scales = this.get('scales');
      var scale = scales[field];

      if (!scale) {
        scale = this.createScale(field);
        scales[field] = scale;
      }

      return scale;
    }
  }, {
    key: "_setAttrOptions",
    value: function _setAttrOptions(attrName, attrCfg) {
      var options = this.get('attrOptions');

      if (attrName === 'size' && this._zoomScale) {
        attrCfg.zoom = this.map.getZoom();
      }

      options[attrName] = attrCfg;
    }
  }, {
    key: "_createAttrOption",
    value: function _createAttrOption(attrName, field, cfg, defaultValues) {
      var attrCfg = {};
      attrCfg.field = field;

      if (cfg) {
        if (_util["default"].isFunction(cfg)) {
          attrCfg.callback = cfg;
        } else {
          attrCfg.values = cfg;
        }
      } else if (attrName !== 'color') {
        attrCfg.values = defaultValues;
      }

      this._setAttrOptions(attrName, attrCfg);
    }
  }, {
    key: "_initControllers",
    value: function _initControllers() {
      var mappingCtr = new _index["default"].Mapping({
        layer: this
      });
      var pickCtr = new _index["default"].Picking({
        layer: this
      });
      var interactionCtr = new _index["default"].Interaction({
        layer: this
      });
      this.set('mappingController', mappingCtr);
      this.set('pickingController', pickCtr);
      this.set('interacionController', interactionCtr);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.get('layerType') === 'tile') {
        this.scene.style.update(this._attrs);
        return this;
      }

      this.init();

      this.scene._engine.update();

      return this;
    } // 重绘 度量， 映射，顶点构建

  }, {
    key: "repaint",
    value: function repaint() {
      this.set('scales', {});
      var mappingCtr = new _index["default"].Mapping({
        layer: this
      });
      this.set('mappingController', mappingCtr); // this._initAttrs();
      // this._mapping();

      this.redraw();
    } // 初始化图层

  }, {
    key: "init",
    value: function init() {
      this._initControllers(); // this._initAttrs();


      this._updateDraw();
    }
  }, {
    key: "_initInteraction",
    value: function _initInteraction() {
      if (this.get('allowActive')) {
        this.get('interacionController').addInteraction('active');
      }
    }
  }, {
    key: "_initMapEvent",
    value: function _initMapEvent() {
      var _this3 = this;

      // zoomchange  mapmove resize
      var EVENT_TYPES = ['zoomchange', 'dragend'];

      _util["default"].each(EVENT_TYPES, function (type) {
        var handler = _util["default"].wrapBehavior(_this3, "".concat(type));

        _this3.map.on("".concat(type), handler);

        _this3._mapEventHandlers.push({
          type: type,
          handler: handler
        });
      });
    }
  }, {
    key: "clearMapEvent",
    value: function clearMapEvent() {
      var _this4 = this;

      var eventHandlers = this._mapEventHandlers;

      _util["default"].each(eventHandlers, function (eh) {
        _this4.map.off(eh.type, eh.handler);
      });
    }
  }, {
    key: "zoomchange",
    value: function zoomchange(ev) {
      // 地图缩放等级变化
      this._visibleWithZoom(ev);
    }
  }, {
    key: "dragend",
    value: function dragend() {}
  }, {
    key: "resize",
    value: function resize() {}
  }, {
    key: "setActive",
    value: function setActive(id, color) {
      this._activeIds = id;

      if (!Array.isArray(color)) {
        color = _colorUtil["default"].color2RGBA(color);
      }

      (0, _object3dUtil.updateObjecteUniform)(this._object3D, {
        u_activeColor: color,
        u_activeId: id
      });

      this.scene._engine.update();
    }
  }, {
    key: "_addActiveFeature",
    value: function _addActiveFeature(e) {
      var featureId = e.featureId;
      this._activeIds = featureId;
      (0, _object3dUtil.updateObjecteUniform)(this._object3D, {
        u_activeId: featureId
      });
    }
  }, {
    key: "_setPreOption",
    value: function _setPreOption() {
      var nextAttrs = this.get('attrOptions');
      var nextStyle = this.get('styleOptions');
      this.set('preAttrOptions', _util["default"].clone(nextAttrs));
      this.set('preStyleOption', _util["default"].clone(nextStyle));
    }
  }, {
    key: "_updateDraw",
    value: function _updateDraw() {
      var preAttrs = this.get('preAttrOptions');
      var nextAttrs = this.get('attrOptions');
      var preStyle = this.get('preStyleOption');
      var nextStyle = this.get('styleOptions');

      if (preAttrs === undefined && preStyle === undefined) {
        // 首次渲染
        // this._mapping();
        // this._scaleByZoom();
        this._setPreOption();

        this._initInteraction();

        this._initMapEvent();

        this.draw();
        return;
      }

      if (!_util["default"].isEqual(preAttrs.color, nextAttrs.color)) {
        this._updateAttributes(this.layerMesh);
      } // 更新数据过滤 filter


      if (!_util["default"].isEqual(preAttrs.filter, nextAttrs.filter)) {
        // 更新color；
        this._updateAttributes(this.layerMesh);
      } // 更新Size


      if (!_util["default"].isEqual(preAttrs.size, nextAttrs.size)) {
        // 更新color；
        this._updateSize();
      } // 更新形状


      if (!_util["default"].isEqual(preAttrs.shape, nextAttrs.shape)) {
        // 更新color；
        this._updateShape();
      }

      if (!_util["default"].isEqual(preStyle, nextStyle)) {
        // 判断新增，修改，删除
        var newStyle = {};

        _util["default"].each((0, _diff["default"])(preStyle, nextStyle), function (_ref) {
          var type = _ref.type,
              key = _ref.key,
              value = _ref.value;
          type !== 'remove' && (newStyle[key] = value); // newStyle[key] = type === 'remove' ? null : value;
        });

        this._updateStyle(newStyle);
      }

      this._setPreOption();
    }
  }, {
    key: "_updateSize",
    value: function _updateSize(zoom) {
      var _this5 = this;

      var sizeOption = this.get('attrOptions').size;
      var fields = parseFields(sizeOption.field);
      var data = this.layerSource.data.dataArray;
      if (!this.zoomSizeCache) this.zoomSizeCache = {};

      if (!this.zoomSizeCache[zoom]) {
        this.zoomSizeCache[zoom] = [];

        var _loop = function _loop(i) {
          var params = fields.map(function (field) {
            return data[i][field];
          });
          var indexZoom = fields.indexOf('zoom');
          indexZoom !== -1 ? params[indexZoom] = zoom : null;

          _this5.zoomSizeCache[zoom].push(sizeOption.callback.apply(sizeOption, _toConsumableArray(params)));
        };

        for (var i = 0; i < data.length; i++) {
          _loop(i);
        }
      }

      this.emit('sizeUpdated', this.zoomSizeCache[zoom]);
    }
  }, {
    key: "_updateStyle",
    value: function _updateStyle(option) {
      var newOption = {};

      for (var key in option) {
        newOption['u_' + key] = option[key];
      }

      (0, _object3dUtil.updateObjecteUniform)(this._object3D, newOption);
    }
  }, {
    key: "_scaleByZoom",
    value: function _scaleByZoom() {
      var _this6 = this;

      if (this._zoomScale) {
        this.map.on('zoomend', function () {
          var zoom = _this6.map.getZoom();

          _this6._updateSize(Math.floor(zoom));
        });
      }
    }
  }, {
    key: "_initEvents",
    value: function _initEvents() {
      var _this7 = this;

      this.scene.on('pick-' + this.layerId, function (e) {
        var featureId = e.featureId,
            point2d = e.point2d,
            type = e.type; // TODO 瓦片图层获取选中数据信息

        var lnglat = _this7.scene.containerToLngLat(point2d);

        var feature = null;
        var style = null;

        if (featureId !== -999) {
          var res = _this7.getSelectFeature(featureId, lnglat);

          feature = res.feature;
          style = res.style;
        }

        var target = {
          featureId: featureId,
          feature: feature,
          style: style,
          pixel: point2d,
          type: type,
          lnglat: {
            lng: lnglat.lng,
            lat: lnglat.lat
          }
        };

        if (featureId >= 0) {
          // 拾取到元素，或者离开元素
          _this7.emit(type, target);
        }

        if (featureId < 0 && _this7._activeIds >= 0) {
          type = 'mouseleave';

          _this7.emit(type, target);
        }

        _this7._activeIds = featureId;
      });
    }
  }, {
    key: "getSelectFeature",
    value: function getSelectFeature(featureId) {
      var feature = this.layerSource.getSelectFeature(featureId);
      var style = this.layerData[featureId - 1];
      return {
        feature: feature,
        style: style
      };
    }
    /**
     *  用于过滤数据
     * @param {*} object  更新颜色和数据过滤
     */

  }, {
    key: "_updateAttributes",
    value: function _updateAttributes(object) {
      var _this8 = this;

      this.get('mappingController').update();
      var filterData = this.layerData;
      this._activeIds = null; // 清空选中元素

      var colorAttr = object.geometry.attributes.a_color;
      var pickAttr = object.geometry.attributes.pickingId;
      pickAttr.array.forEach(function (id, index) {
        id = Math.abs(id);

        var color = _toConsumableArray(_this8.layerData[id - 1].color);

        id = Math.abs(id);
        var item = filterData[id - 1];

        if (item.hasOwnProperty('filter') && item.filter === false) {
          colorAttr.array[index * 4 + 0] = 0;
          colorAttr.array[index * 4 + 1] = 0;
          colorAttr.array[index * 4 + 2] = 0;
          colorAttr.array[index * 4 + 3] = 0;
          pickAttr.array[index] = -id; // 通过Id数据过滤 id<0 不显示
        } else {
          colorAttr.array[index * 4 + 0] = color[0];
          colorAttr.array[index * 4 + 1] = color[1];
          colorAttr.array[index * 4 + 2] = color[2];
          colorAttr.array[index * 4 + 3] = color[3];
          pickAttr.array[index] = id;
        }
      });
      colorAttr.needsUpdate = true;
      pickAttr.needsUpdate = true;
    }
  }, {
    key: "_visibleWithZoom",
    value: function _visibleWithZoom() {
      if (this._object3D === null) return;
      var zoom = this.scene.getZoom();
      var minZoom = this.get('minZoom');
      var maxZoom = this.get('maxZoom'); // z-fighting

      var offset = 0;

      if (this.type === 'point') {
        offset = 5;
        this.shapeType = 'text' && (offset = 10);
      } else if (this.type === 'polyline' || this.type === 'line') {
        offset = 2;
      } else if (this.type === 'polygon') {
        offset = 1;
      }

      this._object3D.position && (this._object3D.position.z = offset * Math.pow(2, 20 - zoom));

      if (zoom < minZoom || zoom >= maxZoom) {
        this._object3D.visible = false;
      } else if (this.get('visible')) {
        this._object3D.visible = true;
      }
    } // 重新构建mesh

  }, {
    key: "redraw",
    value: function redraw() {
      var _this9 = this;

      this._object3D.children.forEach(function (child) {
        _this9._object3D.remove(child);
      });

      this.get('pickingController').removeAllMesh();
      this.draw();
    } // 更新mesh

  }, {
    key: "updateDraw",
    value: function updateDraw() {}
  }, {
    key: "styleCfg",
    value: function styleCfg() {}
    /**
     * 重置高亮要素
     */

  }, {
    key: "_resetStyle",
    value: function _resetStyle() {
      this._activeIds = null;
      (0, _object3dUtil.updateObjecteUniform)(this._object3D, {
        u_activeId: 0
      });
    }
    /**
     * 销毁Layer对象
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.removeAllListeners();
      this.clearAllInteractions();
      this.clearMapEvent();

      if (this._object3D.type === 'composer') {
        this.remove(this._object3D);
        return;
      }

      if (this._object3D && this._object3D.children) {
        var child;

        for (var i = 0; i < this._object3D.children.length; i++) {
          child = this._object3D.children[i];

          if (!child) {
            continue;
          }

          this.remove(child);

          if (child.geometry) {
            // child.geometry.dispose();
            child.geometry = null;
          }

          if (child.material) {
            if (child.material.map) {
              child.material.map.dispose();
              child.material.map = null;
            }

            child.material.dispose();
            child.material = null;
          }

          child = null;
        }
      }

      this.layerMesh.geometry = null;
      this.layerMesh.material.dispose();
      this.layerMesh.material = null;

      if (this._pickingMesh) {
        this._pickingMesh.children[0].geometry = null;

        this._pickingMesh.children[0].material.dispose();

        this._pickingMesh.children[0].material = null;
      }

      this._buffer = null;
      this._object3D = null;

      this.scene._engine._scene.remove(this._object3D);

      this.layerData.length = 0;
      this.layerSource = null;

      this.scene._engine._picking.remove(this._pickingMesh);

      this.destroyed = true;
    }
    /**
     * 获取图例配置项
     * @param {*} field 字段
     * @param {*} type 图例类型 color, size
     * @return {*} 图例配置项
     */

  }, {
    key: "getLegendCfg",
    value: function getLegendCfg(field) {
      var _this10 = this;

      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'color';

      // todo heatmap
      if (this.type === 'heatmap' && this.shapeType === 'heatmap') {
        return this.get('styleOptions').rampColors;
      }

      var scales = this.get('scales');
      var scale = scales[field];
      var colorAttrs = this.get('attrs')[type];
      var lengendCfg = {};

      if (scale) {
        var ticks = scale.ticks;
        lengendCfg.value = ticks;
        lengendCfg.type = scale.type;
        var values = ticks.map(function (value) {
          var v = _this10._getAttrValues(colorAttrs, _defineProperty({}, field, value));

          return type === 'color' ? _colorUtil["default"].colorArray2RGBA(v) : v;
        });
        lengendCfg[type] = values;
      }

      return lengendCfg;
    }
  }, {
    key: "preRender",
    value: function preRender() {}
  }, {
    key: "afterRender",
    value: function afterRender() {}
  }]);

  return Layer;
}(_base["default"]);

exports["default"] = Layer;