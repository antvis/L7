import Base from './base';
import { getTransform, getParser } from '../source';
import { cluster, formatData } from '../source/transform/cluster';
import { extent, tranfrormCoord } from '../util/geo';
import { clone } from '@antv/util';
import { getMap } from '../map/index';
export default class Source extends Base {
  getDefaultCfg() {
    return {
      data: null,
      defs: {},
      parser: {},
      transforms: [],
      scaledefs: {},
      scales: {},
      options: {}
    };
  }
  constructor(cfg) {
    super(cfg);
    const transform = this.get('transforms');
    this._transforms = transform || [];
    const mapType = this.get('mapType');
    this.projectFlat = getMap(mapType).project;
    // 数据解析
    this._init();

  }
  _init() {
    this._excuteParser();
    const isCluster = this.get('isCluster') || false;
    isCluster && this._executeCluster();
    // 数据转换 统计，聚合，分类
    this._executeTrans();
    // 坐标转换
    this._projectCoords();
  }
  setData(data, cfg = {}) {
    Object.assign(this._attrs, cfg);
    const transform = this.get('transforms');
    this._transforms = transform || [];
    this.set('data', data);
    this._init();
  }
  // 数据更新
  updateTransfrom(cfg) {
    const { transforms } = cfg;
    this._transforms = transforms;
    this.data = clone(this.originData);
    this._executeTrans();
    this._projectCoords();
  }

  _excuteParser() {
    const parser = this.get('parser');
    const { type = 'geojson' } = parser;
    const data = this.get('data');
    this.originData = getParser(type)(data, parser);
    this.data = clone(this.originData);
    this.data.extent = extent(this.data.dataArray);
  }
  /**
   * 数据统计
   */
  _executeTrans() {
    const trans = this._transforms;
    trans.forEach(tran => {
      const { type } = tran;
      const data = getTransform(type)(this.data, tran);
      Object.assign(this.data, data);
    });
    this._transforms = trans;
  }
  transform(option) {
    const data = getTransform(option.type)(this.data, option);
    Object.assign(this.data, data);
  }
  _executeCluster() {
    const clusterCfg = this.get('Cluster') || {};
    const zoom = this.get('zoom');
    clusterCfg.zoom = Math.floor(zoom);
    this.set('cluster', clusterCfg);
    const clusterData = cluster(this.data, clusterCfg);
    this.data = clusterData.data;
    this.pointIndex = clusterData.pointIndex;
  }
  updateCusterData(zoom, bbox) {
    const clusterPoint = this.pointIndex.getClusters(bbox, zoom);
    this.data.dataArray = formatData(clusterPoint);
    const clusterCfg = this.get('Cluster') || {};
    clusterCfg.zoom = Math.floor(zoom);
    clusterCfg.bbox = bbox;
    this.set('cluster', clusterCfg);
    this._projectCoords();
  }
  _projectCoords() {
    this.data.dataArray.forEach(data => {
      // data.coordinates = this._coordProject(data.coordinates);
      data.coordinates = tranfrormCoord(data.coordinates, this._coorConvert.bind(this));
    });
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
    // 颜色编码从1开始，要素索引从0开始，所以颜色转变要素需要减1
    const isCluster = this.get('isCluster') || false;
    return (data.features && !isCluster)
      ? data.features[featureId - 1]
      : this.data.dataArray[featureId - 1];
  }
  getSeletFeatureIndex(featureId) {
    const data = this.get('data');
    if (!data.features) {
      return featureId - 1;
    }
    let featureIndex = 0;
    for (let i = 0; i < this.data.dataArray.length; i++) {
      const item = this.data.dataArray[i];
      if (item._id === featureId) {
        break;
      }
      featureIndex++;
    }
    return featureIndex;
  }
  destroy() {
    this.data = null;
    this.originData = null;
  }
}
