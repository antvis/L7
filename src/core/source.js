
import Base from './base';
import Controller from './controller/index';
import { getTransform, getParser } from '../source';
import { getMap } from '../map/index';
export default class Source extends Base {
  getDefaultCfg() {
    return {
      data: null,
      defs: {},
      parser: {},
      transforms: [],
      scales: {
      },
      options: {}
    };
  }
  constructor(cfg) {
    super(cfg);
    const transform = this.get('transforms');
    this._transforms = transform || [];
    this._initControllers();
    // 数据解析
    this._excuteParser();
    // 数据转换 统计，聚合，分类
    this._executeTrans();
    // 坐标转换
    this._projectCoords();
  }
  _excuteParser() {
    const parser = this.get('parser');
    const { type = 'geojson' } = parser;
    const data = this.get('data');
    this.data = getParser(type)(data, parser);
  }
  /**
   * 数据统计
   */
  _executeTrans() {
    const trans = this._transforms;
    trans.forEach(tran => {
      const { type } = tran;
      this.data = getTransform(type)(this.data, tran);
    });
    this._transforms = trans;
  }
  _projectCoords() {
    this.data.dataArray.forEach(data => {
      data.coordinates = this._coordProject(data.coordinates);
    });
  }
  createScale(field) {
    const data = this.data.dataArray;
    const scales = this.get('scales');
    let scale = scales[field];
    const scaleController = this.get('scaleController');
    if (!scale) {
      scale = scaleController.createScale(field, data);
      scales[field] = scale;
    }
    return scale;
  }
  _initControllers() {
    const defs = this.get('defs');
    const mapType = this.get('mapType');
    this.projectFlat = getMap(mapType).project;
    const scaleController = new Controller.Scale({
      defs
    });
    this.set('scaleController', scaleController);
  }

  _getCoord(geo) {
    if (geo.geometry) {
      // GeoJSON feature
      geo = geo.geometry.coordinates;
    } else if (geo.coordinates) {
      // GeoJSON geometry
      geo = geo.coordinates;
    }
    return geo;
  }
  _coordProject(geo) {

    if (Array.isArray(geo[0][0])) {
      return geo.map(coor => {
        return this._coordProject(coor);
      });
    }
    if (!Array.isArray(geo[0])) {
      return this._coorConvert(geo);

    }
    return geo.map(coor => {
      return this._coorConvert(coor);
    });
  }
  _coorConvert(geo) {

    const ll = this.projectFlat(geo);
    return [ ll.x, ll.y, geo[2] || 0 ];

  }
  getSelectFeature(featureId) {
    const data = this.get('data');
    // 如果是GeoJSON 数据返回原数
    return data.features ? data.features[featureId] : this.data.dataArray[featureId];
  }

}
