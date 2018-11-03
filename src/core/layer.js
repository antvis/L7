/**
 * @fileOverview Layer基类
 * @author lzx199065@gmail.com
 */
import Base from './base';
import * as THREE from './three';
import ColorUtil from '../attr/color-util';
import * as source from '../source/index';
import * as turfMeta from '@turf/meta';
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
        stroke: [1.0,1.0,1.0,1.0],
        strokeWidth: 1.0,
        opacity: 1.0
      },
      // 选中时的配置项
      selectedOptions: null,
      // active 时的配置项
      activedOptions: null,
      animateOptions: null
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
    // todo 用户参数
    this._object3D.position.z = this.get('zIndex')*100;
    scene._engine._scene.add(this._object3D);
    this.layerMesh = null;

  }
  /**
   * 将图层添加加到 Object
   * @param {*} object three 物体
   */
  add(object) {
    this.layerMesh = object;
    // 更新
    if(this._needUpdateFilter) {
      this._updateFilter();
    }
    this._object3D.add(object);
    this._addPickMesh(object);
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
    const dataType = this._getDataType(data);
    const { type = dataType } = cfg;
    cfg.data = data;
    cfg.mapType = this.get('mapType');
    this.layerSource = new source[type](cfg);

    return this;
  }
  color(field, values) {
    this._needUpdateColor = true;//标识颜色是否需要更新
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

    this._createAttrOption('shape', field, values, Global.sizes);
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
    const colorItem = [ 'fill', 'stroke', 'color' ];
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
      if (colorItem.indexOf(item) !== -1) {
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
  animate(callback) {
    this.set('animateOptions', callback);
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
    if (this.get('allowActive')) {

      this.scene.on('pick', activeHander);

    } else {
      this.scene.off('pick', activeHander);
    }
  }

  _addActiveFeature(e) {
    const { featureId } = e;
    const activeStyle = this.get('activedOptions');
    const data = this.layerSource.get('data');
    const selectFeatureIds = [];
    let featureStyleId = 0;
    /* eslint-disable */
    turfMeta.flattenEach(data, (currentFeature, featureIndex, multiFeatureIndex) => {
    /* eslint-disable */
      if (featureIndex === featureId) {
        selectFeatureIds.push(featureStyleId);
      }
      featureStyleId++;
      if (featureIndex > featureId) {
        return;
      }
    });
    if (this.StyleData[selectFeatureIds[0]].hasOwnProperty('filter') && this.StyleData[selectFeatureIds[0]].filter === false) { return; }
    const style = Util.assign({}, this.StyleData[featureId]);
    style.color = ColorUtil.toRGB(activeStyle.fill).map(e => e / 255);
    this.updateStyle(selectFeatureIds, style);
  }


  _initAttrs() {
    const attrOptions = this.get('attrOptions');
    for (const type in attrOptions) {
      if (attrOptions.hasOwnProperty(type)) {
        this._updateAttr(type)
      }
    }
  }
  _updateAttr(type){
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
    const data = this.layerSource.propertiesData;
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
    const data = this.layerSource.propertiesData;
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
      mappedData.push(newRecord);
    }

    this.StyleData = mappedData;
    return mappedData;
  }
  _updateMaping() {
    const self = this;
    const attrs = self.get('attrs');

    const data = this.layerSource.propertiesData;
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
              this.StyleData[i][name] = (Util.isArray(val) && val.length === 1) ? val[0] : val; // 只有一个值时返回第一个属性值
            }
          } else {
            this.StyleData[i][names[0]] = values.length === 1 ? values[0] : values;

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
  /**
   * 
   * @param {*} overwrite 
   * @param {*} callback 
   */
  on(type,callback) {

    this._addPickingEvents();
    super.on(type, callback);
  }
  getPickingId() {
      return this.scene._engine._picking.getNextId();
  }
  addToPicking(object) {
    this.scene._engine._picking.add(object);
  }
  removeFromPicking(object) {
    this.scene._engine._picking.remove(object);
  }
  _addPickMesh(mesh){
    this._pickingMesh = new THREE.Object3D();
    this.addToPicking(this._pickingMesh);
    const pickmaterial = new PickingMaterial();
    const pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
    this._pickingMesh.add(pickingMesh);
  }
  _setPickingId() {
    this._pickingId = this.getPickingId();
  }
  _addPickingEvents() {
    // TODO: Find a way to properly remove this listener on destroy
    this.scene.on('pick', (e) => {
      // Re-emit click event from the layer
      const { featureId, point2d, point3d, intersects } = e;
      if(intersects.length === 0)
        return;
      const source = this.layerSource.get('data');
      const feature = source.features[featureId];
      const lnglat = this.scene.containerToLngLat(point2d);
      const target = {
        feature,
        pixel:point2d,
        lnglat:{lng:lnglat.lng,lat:lnglat.lat}
      }
      this.emit('click', target);
      // this.emit('move', target);
    });
  }
  /**
   * 更新active操作
   * @param {*} featureStyleId 需要更新的要素Id
   * @param {*} style  更新的要素样式
   */
  updateStyle(featureStyleId, style) {
    const {indices} = this._buffer.bufferStruct;
   
    if (this._activeIds) {
      this.resetStyle();
    }
    this._activeIds = featureStyleId;
    
    const id = featureStyleId[0];
    let dataIndex = 0;
    if(indices){ 
      // 面图层和
        for (let i = 0; i < id; i++) {
          dataIndex += indices[i].length;
        }
     } else {
      dataIndex = id;
     }
 
    featureStyleId.forEach((index,value) => {
      let vertindex =[value]
      if(indices)
        vertindex = indices[index];
      const color = style.color;
      const colorAttr =this.layerMesh.geometry.attributes.a_color;
      colorAttr.dynamic =true;
      vertindex.forEach(() => {
        colorAttr.array[dataIndex*4+0]=color[0];
        colorAttr.array[dataIndex*4+1]=color[1];
        colorAttr.array[dataIndex*4+2]=color[2];
        colorAttr.array[dataIndex*4+3]=color[3];
        dataIndex++;
      });
      colorAttr.needsUpdate =true
    });

  }
  _updateColor(){
   
    this._updateMaping();
    
  }
   /**
   * 用于过滤数据
   * @param {*} filterData  数据过滤标识符
   */
  _updateFilter() {
    this._updateMaping();
    const filterData = this.StyleData;
    this._activeIds = null; // 清空选中元素
    let dataIndex = 0;
    const colorAttr =  this.layerMesh.geometry.attributes.a_color;
    if(this.layerMesh.type =='Points'){ //点图层更新
      filterData.forEach((item,index)=>{
        const color = [ ...this.StyleData[index].color ];
        if (item.hasOwnProperty('filter') && item.filter === false) {
          color[0] = 0;
          color[1] = 0;
          color[2] = 0;
          color[3] = 0;
        }
          colorAttr.array[index*4+0]=color[0];
          colorAttr.array[index*4+1]=color[1];
          colorAttr.array[index*4+2]=color[2];
          colorAttr.array[index*4+3]=color[3];
      })
      colorAttr.needsUpdate =true;
      return;
    }
    const {indices} = this._buffer.bufferStruct;
     indices.forEach((vertIndexs, i) => {
      const color = [ ...this.StyleData[i].color ];
      if (filterData[i].hasOwnProperty('filter') && filterData[i].filter === false) {
        color[3] = 0;
      }
      vertIndexs.forEach(() => {
        colorAttr.array[dataIndex*4+0]=color[0];
        colorAttr.array[dataIndex*4+1]=color[1];
        colorAttr.array[dataIndex*4+2]=color[2];
        colorAttr.array[dataIndex*4+3]=color[3];
        dataIndex++;
      });
      colorAttr.needsUpdate =true;
    });
    this._needUpdateFilter = false;
    this._needUpdateColor = false;
  }
  /**
   * 重置高亮要素
   */
  resetStyle() {
    const {indices} = this._buffer.bufferStruct;
    const colorAttr =  this.layerMesh.geometry.attributes.a_color;
    let dataIndex = 0;
    const id = this._activeIds[0];
    if(indices){
      for (let i = 0; i < id; i++) {
        dataIndex += indices[i].length;
      }
    } else {
      dataIndex = id;
    }
    this._activeIds.forEach((index,value) => {
      const color = this.StyleData[index].color;
      let vertindex = [value];
      if(indices){
       vertindex = indices[index];
      }
      vertindex.forEach(() => {
        colorAttr.array[dataIndex*4+0]=color[0];
        colorAttr.array[dataIndex*4+1]=color[1];
        colorAttr.array[dataIndex*4+2]=color[2];
        colorAttr.array[dataIndex*4+3]=color[3];
        dataIndex++;
      });
      colorAttr.needsUpdate =true
    });
  }
  /**
   * 销毁Layer对象
   */
  despose() {
    this.destroy();
    if(this._object3D && this._object3D.children){
      let child;
      for(let i =0;i<this._object3D.children.length;i++){
         child = this._object3D.children[i];
         if(!child){
           continue;
         }
         this.remove(child);
         if(child.geometry){
           child.geometry.dispose();
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
      }
    }
    this._object3D =null;
    this.scene = null;
  }
}

