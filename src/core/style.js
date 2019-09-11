import Base from '../core/base';
import WorkerPool from '../worker/worker_pool';
import throttle from '../util/throttle';
import SourceCache from '../source/source_cache';
import WorkerController from '../worker/worker_controller';
const omitOption = [ 'mappingController', 'interacionController', 'pickingController', 'interactions', 'eventController' ];
// 统一管理所有的Source
// 统一管理地图样式
export default class Style extends Base {
  constructor(scene, cfg) {
    super(cfg);
    this.scene = scene;
    this._sourceCaches = {};
    this.WorkerPool = new WorkerPool();
    this._tileMap = {};
    this.WorkerController = new WorkerController(this.WorkerPool, this);
    this.layerStyles = {};
    this.layers = [];
    this.addMapEvent();
  }
  addSource(id, sourceCfg) {
    if (this._sourceCaches[id] !== undefined) {
      throw new Error('SourceID 已存在');
    }
    sourceCfg.sourceID = id;
    this._sourceCaches[id] = new SourceCache(this.scene, sourceCfg);
  }
  getSource(id) {
    return this._sourceCaches[id];
  }
  addLayer(layer) {
    const id = layer.layerId;
    this.layers[id] = layer;
  }
  // 设置
  _addTileStyle(layerCfg) {
    const layerid = layerCfg.layerId;
    const newLayerCfg = {};
    for (const key in layerCfg) { // 过滤不可传递对象
      if (omitOption.indexOf(key) === -1) {
        newLayerCfg[key] = layerCfg[key];
      }
    }
    this.layerStyles[layerid] = newLayerCfg;
    this._layerStyleGroupBySourceID();

    this.WorkerController.broadcast('setLayers', this.layerStyles);
    // TODO 更新 style

  }
  removeTileStyle(id) {
    delete this.layerStyles[id];
    this._layerStyleGroupBySourceID();

  }
  _layerStyleGroupBySourceID() {
    const sourceStyles = [];
    // 支持VectorLayer
    for (const layerId in this.layerStyles) {
      const sourceID = this.layerStyles[layerId].sourceOption.id;
      const sourcelayer = this.layerStyles[layerId].sourceOption.parser.sourceLayer;
      if (!sourceStyles[sourceID]) sourceStyles[sourceID] = {};
      if (!sourceStyles[sourceID][sourcelayer]) sourceStyles[sourceID][sourcelayer] = [];
      sourceStyles[sourceID][sourcelayer].push(this.layerStyles[layerId]);
    }
    this.sourceStyles = sourceStyles;
  }
  update(parameters) {
    this._addTileStyle(parameters);
    for (const key in this._sourceCaches) {
      this._sourceCaches[key].update(this.layers, this.sourceStyles[key]);
    }

  }
  addMapEvent() {
    this.mapEventHander = throttle(() => {
      requestAnimationFrame(() => {
        for (const key in this._sourceCaches) {
          this._sourceCaches[key].update(this.layers, this.sourceStyles[key]);
        }
      });
    }, 200);
    this.scene.map.on('zoomchange', this.mapEventHander);
    this.scene.map.on('dragend', this.mapEventHander);
  }
  clearMapEvent() {
    this.scene.map.off('zoomchange', this.mapEventHander);
    this.scene.map.off('dragend', this.mapEventHander);
  }
  destroy() {
    this.WorkerController.remove();

  }
  // 计算视野内的瓦片坐标

}
