/*
 * @Author: ThinkGIS
 * @Date: 2018-06-08 11:19:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-10-30 11:13:39
 */
const Base = require('./base');
const Controller = require('./controller/index');
import { aProjectFlat } from '../geo/project';
export default class Source extends Base {
  getDefaultCfg() {
    return {
      data: null,
      defs: {},
      scales: {
      },
      options: {}
    };
  }
  constructor(cfg) {
    super(cfg);

    this._initControllers();
    this.prepareData();
  }

  // 标准化数据
  prepareData() {
    const data = this.get('data');
    this.propertiesData = [];// 临时使用
    this.geoData = [];

    data.coordinates.forEach(geo => {
      const coord = this._coordProject(geo);
      this.geoData.push(coord);
      this.propertiesData.push([]);
    });
  }

  createScale(field) {
    const data = this.propertiesData;
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

    const ll = aProjectFlat(geo);
    return [ ll.x, -ll.y, geo[2] || 0 ];

  }

}
