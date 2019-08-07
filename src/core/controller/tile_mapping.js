import Util from '../../util';
import Global from '../../global';
import ScaleController from './scale';
import Base from '../base';
import Attr from '../../attr/index';
export default class TileMapping extends Base {
  constructor(source, cfg) {
    super(cfg);
    this.source = source;
    this._init();
  }
  _init() {
    this._initControllers();
    this._initTileAttrs();
    this._mapping();
  }
  update() {
    this.set('scales', {});
    this._initTileAttrs();
    this._updateMaping();
  }
  _initControllers() {
    const scalesOption = this.get('scaleOptions');
    const scaleController = new ScaleController({
      defs: {
        ...scalesOption
      }
    });
    this.set('scaleController', scaleController);
  }
  _createScale(field) {
    const scales = this.get('scales');
    this._initControllers(); // scale更新
    let scale = scales[field];
    if (!scale) {
      scale = this.createScale(field);
      scales[field] = scale;
    }
    return scale;
  }
  createScale(field) {
    const data = this.source.data.dataArray;
    const scales = this.get('scales');
    let scale = scales[field];
    const scaleController = this.get('scaleController');
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
    const attrs = this.get('attrs');
    const mappedData = [];
    const data = this.source.data.dataArray;
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
    this.layerData = mappedData;
  }

  _updateMaping() {
    const attrs = this.get('attrs');

    const data = this.source.data.dataArray;
    const layerData = this.layerData;
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
    const attrOptions = this.get('attrOptions');
    for (const type in attrOptions) {
      if (attrOptions.hasOwnProperty(type)) {
        this._updateTileAttr(type);
      }
    }
  }
  _updateTileAttr(type) {
    const self = this;
    const attrs = this.get('attrs');
    const attrOptions = this.get('attrOptions');
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
