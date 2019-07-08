import Base from '../core/base';
import WorkerPool from '../worker/worker_pool';
import { toLngLat, Bounds } from '@antv/geo-coord';
import SourceCache from '../source/source_cache';
import WorkerController from '../worker/worker_controller';
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
    this.addMapEvent();
  }
  addSource(id, sourceCfg) {
    if (this._sourceCaches[id] !== undefined) {
      throw new Error('SourceID 已存在');
    }
    this._sourceCaches[id] = new SourceCache(this.scene, sourceCfg);
  }
  getSource(id) {
    return this._sourceCaches[id];
  }
  // 设置
  addTileStyle(layerCfg) {
    const layerid = layerCfg.layerId;
    this.layerStyles[layerid] = layerCfg;
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
    this.addTileStyle(parameters);
    for (const key in this._sourceCaches) {
      this._sourceCaches[key].update(this.sourceStyles[key]);
    }

  }
  addMapEvent() {
    this.mapEventHander = () => {
      for (const key in this._sourceCaches) {
        this._sourceCaches[key].update(this.sourceStyles[key]);
      }
    };
    this.scene.on('zoomchange', this.mapEventHander);
    this.scene.on('dragend', this.mapEventHander);
  }
  clearMapEvent() {
    this.scene.off('zoomchange', this.mapEventHander);
    this.scene.off('dragend', this.mapEventHander);
  }
  // 计算视野内的瓦片坐标
  _calculateTileIDs() {
    this.updateTileList = [];
    const pixelBounds = this._getPixelBounds();
    const tileRange = this._pxBoundsToTileRange(pixelBounds);
    const margin = this.get('keepBuffer');
    this.noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([ margin, -margin ]),
    tileRange.getTopRight().add([ margin, -margin ]));
    if (!(isFinite(tileRange.min.x) &&
    isFinite(tileRange.min.y) &&
    isFinite(tileRange.max.x) &&
    isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }
    for (let j = tileRange.min.y; j <= tileRange.max.y; j++) {
      for (let i = tileRange.min.x; i <= tileRange.max.x; i++) {
        const coords = [ i, j, this.tileZoom ];
        this.tileList.push(coords);
        this._tileMap[coords.join('_')] = coords;
      }
    }
  }
  _getPixelBounds() {
    const viewPort = this.scene.getBounds().toBounds();
    const NE = viewPort.getNorthEast();
    const SW = viewPort.getSouthWest();
    const zoom = this.tileZoom;
    const center = this.scene.getCenter();
    const NEPoint = this.scene.crs.lngLatToPoint(toLngLat(NE.lng, NE.lat), zoom);
    const SWPoint = this.scene.crs.lngLatToPoint(toLngLat(SW.lng, SW.lat), zoom);
    const centerPoint = this.scene.crs.lngLatToPoint(toLngLat(center.lng, center.lat), zoom);
    const topHeight = centerPoint.y - NEPoint.y;
    const bottomHeight = SWPoint.y - centerPoint.y;
    // 跨日界线的情况
    let leftWidth;
    let rightWidth;
    if (center.lng - NE.lng > 0 || center.lng - SW.lng < 0) {
      const width = Math.pow(2, zoom) * 256 / 360 * (180 - NE.lng) + Math.pow(2, zoom) * 256 / 360 * (SW.lng + 180);
      if (center.lng - NE.lng > 0) { // 日界线在右侧
        leftWidth = Math.pow(2, zoom) * 256 / 360 * (center.lng - NE.lng);
        rightWidth = width - leftWidth;
      } else {
        rightWidth = Math.pow(2, zoom) * 256 / 360 * (SW.lng - center.lng);
        leftWidth = width - rightWidth;
      }
    } else { // 不跨日界线
      leftWidth = Math.pow(2, zoom) * 256 / 360 * (center.lng - SW.lng);
      rightWidth = Math.pow(2, zoom) * 256 / 360 * (NE.lng - center.lng);
    }
    const pixelBounds = new Bounds(centerPoint.subtract(leftWidth, topHeight), centerPoint.add(rightWidth, bottomHeight));
    return pixelBounds;
  }
  _pxBoundsToTileRange(pixelBounds) {
    return new Bounds(
      pixelBounds.min.divideBy(256).floor(),
      pixelBounds.max.divideBy(256).ceil().subtract([ 1, 1 ])
    );
  }

}
