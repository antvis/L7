/**
 * @fileOverview Layer基类
 * @author lzx199065@gmail.com
 */
import Base from './base';
import * as THREE from './three';
import ColorUtil from '../attr/color-util';
import source from './source';
import PickingMaterial from '../core/engine/picking/pickingMaterial';
import Attr from '../attr/index';
import Util from '../util';
const Global = require('../global');
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
      attrOptions: {
      },
      scales: {},
      attrs: {},
      // 样式配置项
      styleOptions: {
        stroke: 'none',
        strokeWidth: 1.0,
        opacity: 1.0,
        strokeOpacity: 1.0,
        texture: false
      },
      destroyed: false,
      // 选中时的配置项
      selectedOptions: null,
      // active 时的配置项
      activedOptions: null,
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
    const layerId = this._getUniqueId();
    this.layerId = layerId;
    this._activeIds = null;
    const world = scene._engine.world;
    world.add(this._object3D);
    this.layerMesh = null;
    this.layerLineMesh = null;
    this._initEvents();

  }
  /**
   * 将图层添加加到 Object
   * @param {*} object three 物体
    * @param {*} type mesh类型是区别是填充还是边线
   */
  add(object, type = 'fill') {
    type === 'fill' ? this.layerMesh = object : this.layerLineMesh = object;

    this._visibleWithZoom();
    this._zoomchangeHander = this._visibleWithZoom.bind(this);
    this.scene.on('zoomchange', this._zoomchangeHander);

    object.onBeforeRender = () => {
      const zoom = this.scene.getZoom();
      // object.material.setUniformsValue('u_time', this.scene._engine.clock.getElapsedTime());
      // object.material.setUniformsValue('u_zoom', zoom);
      this._preRender();

    };
    // 更新
    if (this._needUpdateFilter) {
      this._updateFilter(object);
    }
    this._object3D.add(object);
    if (type === 'fill') { this._addPickMesh(object); }
  }
  remove(object) {
    this._object3D.remove(object);
  }
  _getUniqueId() {
    return id++;
  }
  _visible(visible) {
    this.set('visible', visible);
    this._object3D.visible = this.get('visible');
  }
  source(data, cfg = {}) {
    cfg.data = data;
    cfg.mapType = this.scene.mapType;
    this.layerSource = new source(cfg);
    // this.scene.workerPool.runTask({
    //   command: 'geojson',
    //   data: cfg
    // }).then(data => {
    //   console.log(data);
    // });

    return this;
  }
  color(field, values) {
    this._needUpdateColor = true;// 标识颜色是否需要更新
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
  shape(field, values) {
    if (field.split(':').length === 2) {
      this.shapeType = field.split(':')[0];
      field = field.split(':')[1];
    }
    values === 'text' ? this.shapeType = values : null;

    this._createAttrOption('shape', field, values, Global.shape);
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
    } else if (Util.isObject(enable)) {
      this.set('allowActive', true);
      this.set('activedOptions', enable);
    } else {
      this.set('allowActive', true);
      this.set('activedOptions', cfg || { fill: Global.activeColor });
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
      styleOptions[item] = styleOptions[item];
    }
    this.set('styleOptions', styleOptions);
    return this;
  }
  filter(field, values) {
    this._needUpdateFilter = true;
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
  texture() {

  }
  hide() {
    this._visible(false);
    return this;
  }
  show() {
    this._visible(true);
    return this;
  }
  _createScale(field) {
    const scales = this.get('scales');
    let scale = scales[field];
    if (!scale) {
      scale = this.layerSource.createScale(field);
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
  // 初始化图层
  init() {
    this._initAttrs();
    this._scaleByZoom();
    this._mapping();

    const activeHander = this._addActiveFeature.bind(this);
    const resetHander = this._resetStyle.bind(this);
    if (this.get('allowActive')) {

      this.on('mousemove', activeHander);
      this.on('mouseleave', resetHander);

    } else {
      this.off('mousemove', activeHander);
      this.off('mouseleave', resetHander);
    }
  }

  _addActiveFeature(e) {
    const { featureId } = e;
    if (featureId < 0) return;
    const activeStyle = this.get('activedOptions');
    // const selectFeatureIds = this.layerSource.getSelectFeatureId(featureId);
    // 如果数据不显示状态则不进行高亮
    if (this.layerData[featureId].hasOwnProperty('filter') && this.layerData[featureId].filter === false) { return; }
    const style = Util.assign({}, this.layerData[featureId]);
    style.color = ColorUtil.toRGB(activeStyle.fill).map(e => e / 255);
    this.updateStyle([ featureId ], style);
  }


  _initAttrs() {
    const attrOptions = this.get('attrOptions');
    for (const type in attrOptions) {
      if (attrOptions.hasOwnProperty(type)) {
        this._updateAttr(type);
      }
    }
  }
  _updateAttr(type) {
    const self = this;
    const attrs = this.get('attrs');
    const attrOptions = this.get('attrOptions');
    const option = attrOptions[type];
    option.neadUpdate = true;
    const className = Util.upperFirst(type);
    const fields = parseFields(option.field);
    const scales = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const scale = self._createScale(field);

      if (type === 'color' && Util.isNil(option.values)) { // 设置 color 的默认色值
        option.values = Global.colors;
      }
      scales.push(scale);
    }
    option.scales = scales;
    const attr = new Attr[className](option);
    attrs[type] = attr;
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
  _mapping() {
    const self = this;
    const attrs = self.get('attrs');
    const mappedData = [];
    // const data = this.layerSource.propertiesData;
    const data = this.layerSource.data.dataArray;
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const newRecord = {};
      newRecord.id = data[i]._id;
      for (const k in attrs) {
        if (attrs.hasOwnProperty(k)) {
          const attr = attrs[k];
          attr.needUpdate = false;
          const names = attr.names;
          const values = self._getAttrValues(attr, record);
          if (names.length > 1) { // position 之类的生成多个字段的属性
            for (let j = 0; j < values.length; j++) {
              const val = values[j];
              const name = names[j];
              newRecord[name] = (Util.isArray(val) && val.length === 1) ? val[0] : val; // 只有一个值时返回第一个属性值
            }
          } else {
            newRecord[names[0]] = values.length === 1 ? values[0] : values;

          }
        }
      }
      newRecord.coordinates = record.coordinates;
      mappedData.push(newRecord);
    }
    this.layerData = mappedData;
  }
  // 更新地图映射
  _updateMaping() {
    const self = this;
    const attrs = self.get('attrs');

    const data = this.layerSource.data.dataArray;
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      for (const attrName in attrs) {
        if (attrs.hasOwnProperty(attrName) && attrs[attrName].neadUpdate) {
          const attr = attrs[attrName];
          const names = attr.names;
          const values = self._getAttrValues(attr, record);
          if (names.length > 1) { // position 之类的生成多个字段的属性
            for (let j = 0; j < values.length; j++) {
              const val = values[j];
              const name = names[j];
              this.layerData[i][name] = (Util.isArray(val) && val.length === 1) ? val[0] : val; // 只有一个值时返回第一个属性值
            }
          } else {
            this.layerData[i][names[0]] = values.length === 1 ? values[0] : values;

          }
          attr.neadUpdate = true;
        }
      }
    }
  }
  // 获取属性映射的值
  _getAttrValues(attr, record) {
    const scales = attr.scales;
    const params = [];
    for (let i = 0; i < scales.length; i++) {
      const scale = scales[i];
      const field = scale.field;
      if (scale.type === 'identity') {
        params.push(scale.value);
      } else {
        params.push(record[field]);
      }
    }
    const indexZoom = params.indexOf('zoom');
    indexZoom !== -1 ? params[indexZoom] = attr.zoom : null;
    const values = attr.mapping(...params);
    return values;
  }

  // temp
  _getDataType(data) {
    if (data.hasOwnProperty('type')) {
      const type = data.type;
      if (type === 'FeatureCollection') {
        return 'geojson';
      }
    }
    return 'basic';
  }
  _scaleByZoom() {
    if (this._zoomScale) {
      this.map.on('zoomend', () => {
        const zoom = this.map.getZoom();
        this._updateSize(Math.floor(zoom));
      });
    }
  }
  // on(type, callback) {

  //   this._addPickingEvents();
  //   super.on(type, callback);
  // }
  getPickingId() {
    return this.scene._engine._picking.getNextId();
  }
  addToPicking(object) {
    this.scene._engine._picking.add(object);
  }
  removeFromPicking(object) {
    this.scene._engine._picking.remove(object);
  }
  _addPickMesh(mesh) {
    this._pickingMesh = new THREE.Object3D();
    this._pickingMesh.name = this.layerId;
    // this._visibleWithZoom();
    // this.scene.on('zoomchange', () => {
    //   this._visibleWithZoom();
    // });

    this.addToPicking(this._pickingMesh);
    const pickmaterial = new PickingMaterial({
      u_zoom: this.scene.getZoom()
    });

    const pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
    pickingMesh.name = this.layerId;
    pickmaterial.setDefinesvalue(this.type, true);
    pickingMesh.onBeforeRender = () => {
      const zoom = this.scene.getZoom();
      pickingMesh.material.setUniformsValue('u_zoom', zoom);
    };
    this._pickingMesh.add(pickingMesh);

  }
  _setPickingId() {
    this._pickingId = this.getPickingId();
  }
  _initEvents() {
    this.scene.on('pick-' + this.layerId, e => {
      const { featureId, point2d, type } = e;
      if (featureId < -100 && this._activeIds !== null) {
        this.emit('mouseleave');
        return;
      }
      const feature = this.layerSource.getSelectFeature(featureId);
      const lnglat = this.scene.containerToLngLat(point2d);
      const target = {
        featureId,
        feature,
        pixel: point2d,
        lnglat: { lng: lnglat.lng, lat: lnglat.lat }
      };
      if (featureId >= 0) {
        this.emit(type, target);
      }

    });
  }
  /**
   * 更新active操作
   * @param {*} featureStyleId 需要更新的要素Id
   * @param {*} style  更新的要素样式
   */
  updateStyle(featureStyleId, style) {
    if (this._activeIds) {
      this._resetStyle();
    }
    this._activeIds = featureStyleId;
    const pickingId = this.layerMesh.geometry.attributes.pickingId.array;
    const color = style.color;
    const colorAttr = this.layerMesh.geometry.attributes.a_color;
    const firstId = pickingId.indexOf(featureStyleId[0] + 1);
    for (let i = firstId; i < pickingId.length; i++) {
      if (pickingId[i] === featureStyleId[0] + 1) {
        colorAttr.array[i * 4 + 0] = color[0];
        colorAttr.array[i * 4 + 1] = color[1];
        colorAttr.array[i * 4 + 2] = color[2];
        colorAttr.array[i * 4 + 3] = color[3];
      } else {
        break;
      }
    }
    colorAttr.needsUpdate = true;
    return;
  }

  _updateColor() {

    this._updateMaping();

  }
   /**
   *  用于过滤数据
   * @param {*} object  需要过滤的mesh
   */
  _updateFilter(object) {
    this._updateMaping();
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
    const zoom = this.scene.getZoom();
    const minZoom = this.get('minZoom');
    const maxZoom = this.get('maxZoom');
    // z-fighting
    let offset = 0;
    if (this.type === 'point') {
      offset = 5;
    } else if (this.type === 'polyline') {
      offset = 2;
    }
    this._object3D.position.z = offset * Math.pow(2, 20 - zoom);
    if (zoom < minZoom || zoom > maxZoom) {
      this._object3D.visible = false;
    } else if (this.get('visible')) {
      this._object3D.visible = true;
    }
  }
  /**
   * 重置高亮要素
   */
  _resetStyle() {

    const pickingId = this.layerMesh.geometry.attributes.pickingId.array;
    const colorAttr = this.layerMesh.geometry.attributes.a_color;
    this._activeIds.forEach(index => {
      const color = this.layerData[index].color;
      const firstId = pickingId.indexOf(index + 1);
      for (let i = firstId; i < pickingId.length; i++) {
        if (pickingId[i] === index + 1) {
          colorAttr.array[i * 4 + 0] = color[0];
          colorAttr.array[i * 4 + 1] = color[1];
          colorAttr.array[i * 4 + 2] = color[2];
          colorAttr.array[i * 4 + 3] = color[3];
        }
      }
    });
    colorAttr.needsUpdate = true;
    this._activeIds = null;
  }
  /**
   * 销毁Layer对象
   */
  destroy() {
    this.removeAllListeners();
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
    this._object3D = null;
    this.scene._engine._scene.remove(this._object3D);
    this.scene._engine._picking.remove(this._pickingMesh);
    this.scene.off('zoomchange', this._zoomchangeHander);
    this.destroyed = true;
  }
  _preRender() {

  }
}

