import Util from '../../util';
import Global from '../../global';
import ScaleController from './scale';
import Attr from '../../attr/index';
export default class Mapping {
   /** 初始化mapping
    *  初始化mapping
    * @param {*} cfg 配置
    * @param {*} cfg.layer layer对象
    * @param {*} cfg.mesh  mesh对象
    */
  constructor(cfg) {
    Util.assign(this, cfg);
    if (!this.mesh) this.mesh = this.layer;
    this._init();
  }
  _init() {
    this._initControllers();
    this._initTileAttrs();
    this._mapping();
  }
  update() {
    this.mesh.set('scales', {});
    this._initTileAttrs();
    this._updateMaping();
  }
  _initControllers() {
    const scalesOption = this.layer.get('scaleOptions');
    const scaleController = new ScaleController({
      defs: {
        ...scalesOption
      }
    });
    this.mesh.set('scaleController', scaleController);
  }
  _createScale(field) {
    // TODO scale更新
    const scales = this.mesh.get('scales');
    let scale = scales[field];
    if (!scale) {
      scale = this.createScale(field);
      scales[field] = scale;
    }
    return scale;
  }
  createScale(field) {
    const data = this.mesh.layerSource.data.dataArray;
    const scales = this.mesh.get('scales');
    let scale = scales[field];
    const scaleController = this.mesh.get('scaleController');
    if (!scale) {
      scale = scaleController.createScale(field, data);
      scales[field] = scale;
    }
    return scale;
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
  _mapping() {
    const attrs = this.mesh.get('attrs');
    const mappedData = [];
    const data = this.mesh.layerSource.data.dataArray;
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const newRecord = {};
      newRecord.id = data[i]._id;
      for (const k in attrs) {
        if (attrs.hasOwnProperty(k)) {
          const attr = attrs[k];
          const names = attr.names;
          const values = this._getAttrValues(attr, record);
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
    // 通过透明度过滤数据
    if (attrs.hasOwnProperty('filter')) {
      mappedData.forEach(item => {
        if (item.filter === false) {
          (item.color[3] = 0);
          item.id = -item.id;
        }
      });
    }
    this.mesh.layerData = mappedData;
  }

  /**
   * 更新数据maping
   * @param {*} layerSource 数据源
   * @param {*} layer map
   */
  _updateMaping() {
    const attrs = this.mesh.get('attrs');

    const data = this.mesh.layerSource.data.dataArray;
    const layerData = this.mesh.layerData;
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      for (const attrName in attrs) {
        if (attrs.hasOwnProperty(attrName) && attrs[attrName].neadUpdate) {
          const attr = attrs[attrName];
          const names = attr.names;
          const values = this._getAttrValues(attr, record);
          if (names.length > 1) { // position 之类的生成多个字段的属性
            for (let j = 0; j < values.length; j++) {
              const val = values[j];
              const name = names[j];
              layerData[i][name] = (Util.isArray(val) && val.length === 1) ? val[0] : val; // 只有一个值时返回第一个属性值
            }
          } else {
            layerData[i][names[0]] = values.length === 1 ? values[0] : values;

          }
          attr.neadUpdate = true;
        }
      }
    }
  }


  _initTileAttrs() {
    const attrOptions = this.layer.get('attrOptions');
    for (const type in attrOptions) {
      if (attrOptions.hasOwnProperty(type)) {
        this._updateTileAttr(type);
      }
    }
  }
  _updateTileAttr(type) {
    const self = this;
    const attrs = this.mesh.get('attrs');
    const attrOptions = this.layer.get('attrOptions');
    const option = attrOptions[type];
    option.neadUpdate = true;
    const className = Util.upperFirst(type);
    const fields = this._parseFields(option.field);
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
  _parseFields(field) {
    if (Util.isArray(field)) {
      return field;
    }
    if (Util.isString(field)) {
      return field.split('*');
    }
    return [ field ];
  }
}
