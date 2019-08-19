/**
 * @fileOverview Layer基类
 * @author lzx199065@gmail.com
 */
import Base from './base';
import * as THREE from './three';
import ColorUtil from '../attr/color-util';
import Controller from './controller/index';
import source from './source';
import diff from '../util/diff';
import { updateObjecteUniform } from '../util/object3d-util';
import Util from '../util';
import Global from '../global';
let id = 1;
function parseFields(field) {
  if (Util.isArray(field)) {
    return field;
  }
  if (Util.isString(field)) {
    return field.split('*');
  }
  return [ field ];
}
export default class Layer extends Base {
  getDefaultCfg() {
    return {
      visible: true,
      zIndex: 0,
      type: '',
      minZoom: 0,
      maxZoom: 22,
      rotation: 0,
      option: {},
      attrOptions: {
      },
      scaleOptions: {},
      preScaleOptions: null,
      scales: {},
      attrs: {},
      // 样式配置项
      styleOptions: {
        stroke: [ 1, 1, 1, 1 ],
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
        fill: [ 1.0, 0, 0, 1.0 ]
      },
      interactions: {},
      animateOptions: {
        enable: false
      }
    };
  }
  constructor(scene, cfg) {
    super(cfg);
    this.scene = scene;
    this.map = scene.map;
    this._object3D = new THREE.Object3D();
    this._pickObject3D = new THREE.Object3D();
    this._object3D.visible = this.get('visible');
    this._object3D.renderOrder = this.get('zIndex') || 0;
    this._mapEventHandlers = [];
    const layerId = this._getUniqueId();
    this.set('layerId', layerId);
    this.set('mapType', this.scene.mapType);
    this.layerId = layerId;
    this._activeIds = null;
    const world = scene._engine.world;
    world.add(this._object3D);
    this.layerMesh = null;
    this.layerLineMesh = null;
  }
  /**
   * 将图层添加加到 Object
   * @param {*} object three 物体
    * @param {*} type mesh类型是区别是填充还是边线
   */
  add(object, type = 'fill') {
    // composer合图层绘制
    if (object.type === 'composer') {
      this._object3D = object;
      this.scene._engine.composerLayers.push(object);
      return;
    }
    type === 'fill' ? this.layerMesh = object : this.layerLineMesh = object;
    this._visibleWithZoom();
    object.onBeforeRender = () => { // 每次渲染前改变状态
      const zoom = this.scene.getZoom();
      updateObjecteUniform(this._object3D, {
        u_time: this.scene._engine.clock.getElapsedTime(),
        u_zoom: zoom
      });
      this.preRender();
    };

    object.onAfterRender = () => { // 每次渲染后改变状态
      this.afterRender();
    };
    this._object3D.add(object);
    if (type === 'fill') {
      this.get('pickingController').addPickMesh(object);
    }
  }
  remove(object) {
    if (object.type === 'composer') {
      this.scene._engine.composerLayers = this.scene._engine.composerLayers.filter(layer => {
        return (layer !== object);
      });
      return;
    }
    this._object3D.remove(object);
  }
  _getUniqueId() {
    return id++;
  }
  _visible(visible) {
    this.set('visible', visible);
    this._object3D.visible = this.get('visible');
  }
  // 兼容瓦片source，非瓦片source

  source(data, cfg = {}) {
    // 根据Source类型判断，是不是瓦片图层
    if (this.scene.getTileSource(data)) {
      this.set('layerType', 'tile');
      this.set('sourceOption', {
        id: data,
        ...cfg
      });
      this.scene.style.addLayer(this);
      // 初始化tiles
      this.tiles = new THREE.Object3D();
      this._object3D.add(this.tiles);
      return this;
    }

    if (data instanceof source) {
      this.layerSource = data;
      this.layerSource.on('SourceUpdate', () => {
        this.repaint();
      });
      return this;
    }
    cfg.data = data;
    cfg.mapType = this.scene.mapType;
    cfg.zoom = this.scene.getZoom();
    this.layerSource = new source(cfg);
    return this;
  }
  color(field, values) {
    this._createAttrOption('color', field, values, Global.colors);
    return this;
  }
  size(field, values) {
    const fields = parseFields(field);
    if (fields.indexOf('zoom') !== -1) {
      this._zoomScale = true;
    }
    if (Util.isArray(fields) && !values) values = fields;
    this._createAttrOption('size', field, values, Global.size);
    return this;
  }
  scale(field, cfg) {
    const options = this.get('scaleOptions');
    const scaleDefs = options;
    if (Util.isObject(field)) {
      Util.mix(scaleDefs, field);
    } else {
      scaleDefs[field] = cfg;
    }
    return this;
  }
  shape(field, values) {
    if (field.split(':').length === 2) {
      this.shapeType = field.split(':')[0];
      field = field.split(':')[1];
    }
    values === 'text' ? this.shapeType = values : null;

    this._createAttrOption('shape', field, values, Global.shape);
    return this;
  }
  pattern(field, values) {
    this._createAttrOption('pattern', field, values, Global.pattern);
    return this;
  }
  /**
   * 是否允许使用默认的图形激活交互
   * @param  {Boolean} enable 是否允许激活开关
   * @param {Object} cfg 激活的配置项
   * @return {Geom}    返回 geom 自身
   */
  active(enable, cfg) {
    if (enable === false) {
      this.set('allowActive', false);
    } else if (Util.isObject(enable) && enable.fill) {
      this.set('allowActive', true);
      if (enable.fill) enable.fill = ColorUtil.color2RGBA(enable.fill);
      this.set('activedOptions', enable);
    } else {
      this.set('allowActive', true);
      this.set('activedOptions', cfg || { fill: ColorUtil.color2RGBA(Global.activeColor) });
    }
    return this;
  }

  style(field, cfg) {
    const colorItem = [ 'fill', 'stroke', 'color', 'baseColor', 'brightColor', 'windowColor' ];
    let styleOptions = this.get('styleOptions');
    if (!styleOptions) {
      styleOptions = {};
      this.set('styleOptions', styleOptions);
    }
    if (Util.isObject(field)) {
      cfg = field;
      field = null;
    }
    let fields;
    if (field) {
      fields = parseFields(field);
    }
    styleOptions.fields = fields;
    Util.assign(styleOptions, cfg);
    for (const item in cfg) {
      if (colorItem.indexOf(item) !== -1 && styleOptions[item] !== 'none') {
        styleOptions[item] = ColorUtil.color2RGBA(styleOptions[item]);
      }
    }
    this.set('styleOptions', styleOptions);
    return this;
  }

  filter(field, values) {
    this._createAttrOption('filter', field, values, true);
    return this;
  }

  animate(field, cfg) {
    let animateOptions = this.get('animateOptions');
    if (!animateOptions) {
      animateOptions = {};
      this.set('animateOptions', animateOptions);
    }
    if (Util.isObject(field)) {
      cfg = field;
      field = null;
    }
    let fields;
    if (field) {
      fields = parseFields(field);
    }
    animateOptions.fields = fields;
    Util.assign(animateOptions, cfg);
    this.set('animateOptions', animateOptions);
    return this;
  }
  fitBounds() {
    const extent = this.layerSource.data.extent;
    this.scene.fitBounds(extent);
  }
  hide() {
    this._visible(false);
    this.scene._engine.update();
    return this;
  }
  show() {
    this._visible(true);
    this.scene._engine.update();
    return this;
  }
  setData(data, cfg) {
    this.layerSource.setData(data, cfg);
    this.repaint();
  }
  _createScale(field) {
    // TODO scale更新
    const scales = this.get('scales');
    let scale = scales[field];
    if (!scale) {
      scale = this.createScale(field);
      scales[field] = scale;
    }
    return scale;
  }
  _setAttrOptions(attrName, attrCfg) {
    const options = this.get('attrOptions');
    if (attrName === 'size' && this._zoomScale) {
      attrCfg.zoom = this.map.getZoom();
    }
    options[attrName] = attrCfg;
  }
  _createAttrOption(attrName, field, cfg, defaultValues) {

    const attrCfg = {};
    attrCfg.field = field;
    if (cfg) {
      if (Util.isFunction(cfg)) {
        attrCfg.callback = cfg;
      } else {
        attrCfg.values = cfg;
      }
    } else if (attrName !== 'color') {
      attrCfg.values = defaultValues;
    }
    this._setAttrOptions(attrName, attrCfg);
  }
  _initControllers() {
    const pickCtr = new Controller.Picking({ layer: this });
    const interactionCtr = new Controller.Interaction({ layer: this });
    const eventCtr = new Controller.Event({ layer: this });
    this.set('pickingController', pickCtr);
    this.set('interacionController', interactionCtr);
    this.set('eventController', eventCtr);
  }
  _mapping() {
    const mappingCtr = new Controller.Mapping({ layer: this });
    this.set('mappingController', mappingCtr);
  }
  render() {
    if (this.get('layerType') === 'tile') {
      this._initControllers();
      this._initInteraction();
      this.scene.style.update(this._attrs);
      return this;
    }
    this.init();
    this.scene._engine.update();
    return this;
  }
  // 重绘 度量， 映射，顶点构建
  repaint() {
    this.set('scales', {});
    this._mapping();
    this.redraw();
  }
  // 初始化图层
  init() {
    this._initControllers();
    this._mapping();
    this._updateDraw();
  }
  _initInteraction() {
    if (this.get('allowActive')) {
      this.get('interacionController').addInteraction('active');
    }
  }
  _initMapEvent() {
    // zoomchange  mapmove resize
    const EVENT_TYPES = [ 'zoomchange', 'dragend' ];
    Util.each(EVENT_TYPES, type => {
      const handler = Util.wrapBehavior(this, `${type}`);
      this.map.on(`${type}`, handler);
      this._mapEventHandlers.push({ type, handler });
    });
  }
  clearMapEvent() {
    const eventHandlers = this._mapEventHandlers;
    Util.each(eventHandlers, eh => {
      this.map.off(eh.type, eh.handler);
    });
  }
  zoomchange(ev) {
    // 地图缩放等级变化
    this._visibleWithZoom(ev);
  }
  dragend() {

  }
  resize() {
  }

  setActive(id, color) {
    this._activeIds = id;
    if (!Array.isArray(color)) {
      color = ColorUtil.color2RGBA(color);
    }
    updateObjecteUniform(this._object3D, {
      u_activeColor: color,
      u_activeId: id
    });
    this.scene._engine.update();
  }

  _addActiveFeature(e) {
    const { featureId } = e;
    this._activeIds = featureId;
    updateObjecteUniform(this._object3D, { u_activeId: featureId });
  }

  _setPreOption() {
    const nextAttrs = this.get('attrOptions');
    const nextStyle = this.get('styleOptions');
    this.set('preAttrOptions', Util.clone(nextAttrs));
    this.set('preStyleOption', Util.clone(nextStyle));
  }
  _updateDraw() {
    const preAttrs = this.get('preAttrOptions');
    const nextAttrs = this.get('attrOptions');
    const preStyle = this.get('preStyleOption');
    const nextStyle = this.get('styleOptions');
    if (preAttrs === undefined && preStyle === undefined) { // 首次渲染
      // this._mapping();
      // this._scaleByZoom();
      this._setPreOption();
      this._initInteraction();
      this._initMapEvent();
      this.draw();
      return;
    }
    if (!Util.isEqual(preAttrs.color, nextAttrs.color)) {
      this._updateAttributes(this.layerMesh);
    }
    // 更新数据过滤 filter
    if (!Util.isEqual(preAttrs.filter, nextAttrs.filter)) {
      // 更新color；
      this._updateAttributes(this.layerMesh);
    }
    // 更新Size
    if (!Util.isEqual(preAttrs.size, nextAttrs.size)) {
      // 更新color；
      this._updateSize();
    }
    // 更新形状
    if (!Util.isEqual(preAttrs.shape, nextAttrs.shape)) {
      // 更新color；
      this._updateShape();
    }
    if (!Util.isEqual(preStyle, nextStyle)) {
      // 判断新增，修改，删除
      const newStyle = {};
      Util.each(diff(preStyle, nextStyle), ({ type, key, value }) => {
        (type !== 'remove') && (newStyle[key] = value);
        // newStyle[key] = type === 'remove' ? null : value;
      });
      this._updateStyle(newStyle);
    }
    this._setPreOption();
  }

  _updateSize(zoom) {
    const sizeOption = this.get('attrOptions').size;
    const fields = parseFields(sizeOption.field);
    const data = this.layerSource.data.dataArray;
    if (!this.zoomSizeCache) this.zoomSizeCache = {};
    if (!this.zoomSizeCache[zoom]) {
      this.zoomSizeCache[zoom] = [];
      for (let i = 0; i < data.length; i++) {
        const params = fields.map(field => data[i][field]);
        const indexZoom = fields.indexOf('zoom');
        indexZoom !== -1 ? params[indexZoom] = zoom : null;
        this.zoomSizeCache[zoom].push(sizeOption.callback(...params));

      }
    }
    this.emit('sizeUpdated', this.zoomSizeCache[zoom]);
  }
  _updateStyle(option) {
    const newOption = { };
    for (const key in option) {
      newOption['u_' + key] = option[key];
    }
    updateObjecteUniform(this._object3D, newOption);
  }
  _scaleByZoom() {
    if (this._zoomScale) {
      this.map.on('zoomend', () => {
        const zoom = this.map.getZoom();
        this._updateSize(Math.floor(zoom));
      });
    }
  }

  _initEvents() {
    this.scene.on('pick-' + this.layerId, e => {
      let { featureId, point2d, type } = e;
      // TODO 瓦片图层获取选中数据信息
      const lnglat = this.scene.containerToLngLat(point2d);
      let feature = null;
      let style = null;
      if (featureId !== -999) {
        const res = this.getSelectFeature(featureId, lnglat);
        feature = res.feature;
        style = res.style;
      }
      const target = {
        featureId,
        feature,
        style,
        pixel: point2d,
        type,
        lnglat: { lng: lnglat.lng, lat: lnglat.lat }
      };
      if (featureId >= 0) { // 拾取到元素，或者离开元素
        this.emit(type, target);
      }
      if (featureId < 0 && this._activeIds >= 0) {
        type = 'mouseleave';
        this.emit(type, target);
      }
      this._activeIds = featureId;

    });
  }
  getSelectFeature(featureId, lnglat) {
    // return {};
    if (this.get('layerType') === 'tile') {
      const sourceCache = this.getSourceCache(this.get('sourceOption').id);
      const feature = sourceCache.getSelectFeature(featureId, this.layerId, lnglat);
      return {
        feature
      };
    }
    const feature = this.layerSource && this.layerSource.getSelectFeature(featureId) || {};
    const style = this.layerData[featureId - 1];
    return {
      feature,
      style
    };
  }
  /**
   *  用于过滤数据
   * @param {*} object  更新颜色和数据过滤
   */
  _updateAttributes(object) {
    this.get('mappingController').update();
    const filterData = this.layerData;
    this._activeIds = null; // 清空选中元素
    const colorAttr = object.geometry.attributes.a_color;
    const pickAttr = object.geometry.attributes.pickingId;
    pickAttr.array.forEach((id, index) => {
      id = Math.abs(id);
      const color = [ ...this.layerData[id - 1].color ];
      id = Math.abs(id);
      const item = filterData[id - 1];
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
  _visibleWithZoom() {
    if (this._object3D === null) return;
    const zoom = this.scene.getZoom();
    const minZoom = this.get('minZoom');
    const maxZoom = this.get('maxZoom');
    // z-fighting
    let offset = 0;
    if (this.type === 'point') {
      offset = 5;

    } else if (this.type === 'polyline' || this.type === 'line') {
      offset = 2;
    } else if (this.type === 'polygon') {
      offset = 1;
    }
    if (this.type === 'text') {
      offset = 10;
    }
    this._object3D.position && (this._object3D.position.z = offset * Math.pow(2, 20 - zoom));
    if (zoom < minZoom || zoom >= maxZoom) {
      this._object3D.visible = false;
    } else if (this.get('visible')) {
      this._object3D.visible = true;
    }
  }

  // 重新构建mesh
  redraw() {
    this._object3D.children.forEach(child => {
      this._object3D.remove(child);
    });
    this.get('pickingController').removeAllMesh();
    this.draw();
  }
  // 更新mesh
  updateDraw() {

  }

  styleCfg() {

  }

  /**
   * 重置高亮要素
   */
  _resetStyle() {
    this._activeIds = null;
    updateObjecteUniform(this._object3D, { u_activeId: 0 });
  }
  /**
   * 销毁Layer对象
   */
  destroy() {
    this.removeAllListeners();
    this.clearAllInteractions();
    this.clearMapEvent();
    if (this._object3D.type === 'composer') {
      this.remove(this._object3D);
      return;
    }
    if (this._object3D && this._object3D.children) {
      let child;
      for (let i = 0; i < this._object3D.children.length; i++) {
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
  getLegendCfg(field, type = 'color') {
    // todo heatmap
    if (this.type === 'heatmap' && this.shapeType === 'heatmap') {
      return this.get('styleOptions').rampColors;
    }
    const scales = this.get('scales');
    const scale = scales[field];
    const colorAttrs = this.get('attrs')[type];
    const lengendCfg = {};
    if (scale) {
      const ticks = scale.ticks;
      lengendCfg.value = ticks;
      lengendCfg.type = scale.type;
      const values = ticks.map(value => {
        const v = this._getAttrValues(colorAttrs, { [field]: value });
        return type === 'color' ? ColorUtil.colorArray2RGBA(v) : v;
      });
      lengendCfg[type] = values;
    }
    return lengendCfg;
  }
  preRender() {

  }

  afterRender() {

  }

  // tileLayer
  getSourceCache(id) {
    return this.scene.style.getSource(id);
  }
}

