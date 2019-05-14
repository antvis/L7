import Layer from '../../core/layer';
import source from '../../core/source';
import * as THREE from '../../core/three';
import Util from '../../util';
import TileCache from './tileCache';
import { throttle } from '@antv/util';
import { toLngLat } from '@antv/geo-coord';
import { epsg3857 } from '@antv/geo-coord/lib/geo/crs/crs-epsg3857';
export default class TileLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this._tileCache = new TileCache(50, this._destroyTile);
    this._crs = epsg3857;
    this._tiles = new THREE.Object3D();
    this._tileKeys = [];
    this.tileList = [];
  }
  source(url, cfg = {}) {
    this.url = url;
    this.sourceCfg = cfg;
    return this;
  }
  tileSource(data) {
    super.source(data, this.sourceCfg);
    if (data instanceof source) {
      return data;
    }
    this.sourceCfg.data = data;
    this.sourceCfg.mapType = this.scene.mapType;
    this.sourceCfg.zoom = this.scene.getZoom();
    return new source(this.sourceCfg);
  }
  render() {
    this._initControllers();
    this._initMapEvent();
    this._initAttrs();
    this.draw();
    return this;
  }
  draw() {
    this._object3D.add(this._tiles);
    this._calculateLOD();
  }
  drawTile() {

  }
  _mapping(source) {

    const attrs = this.get('attrs');
    const mappedData = [];
    // const data = this.layerSource.propertiesData;
    const data = source.data.dataArray;
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
        item.filter === false && (item.color[3] = 0);
      });
    }
    return mappedData;
  }
  zoomchange(ev) {
    super.zoomchange(ev);
    throttle(this._calculateLOD, 200);
    this._calculateLOD();
  }
  dragend(ev) {
    super.dragend(ev);
    this._calculateLOD();

  }
  _calculateLOD() {
    const viewPort = this.scene.getBounds().toBounds();
    const SE = viewPort.getSouthEast();
    const NW = viewPort.getNorthWest();
    const zoom = Math.round(this.scene.getZoom()) - 1;
    const tileCount = Math.pow(2, zoom);
    const center = this.scene.getCenter();
    const NWPoint = this._crs.lngLatToPoint(toLngLat(NW.lng, NW.lat), zoom);
    const SEPoint = this._crs.lngLatToPoint(toLngLat(SE.lng, SE.lat), zoom);
    const centerPoint = this._crs.lngLatToPoint(toLngLat(center.lng, center.lat), zoom);
    const centerXY = centerPoint.divideBy(256).round();
    const minXY = NWPoint.divideBy(256).round();
    const maxXY = SEPoint.divideBy(256).round();
    // console.log(NW.lng, NW.lat, SE.lng, SE.lat, NWPonint, SEPonint);
    let updateTileList = [];
    this.tileList = [];
    const halfx = 1;
    const halfy = 1;

    if (!(centerPoint.x > NWPoint.x && centerPoint.x < SEPoint.x)) { // 地图循环的问题
      for (let i = 0; i < minXY.x; i++) {
        for (let j = Math.min(0, minXY.y - halfy); j < Math.max(maxXY.y + halfy, tileCount); j++) {
          this._updateTileList(updateTileList, i, j, zoom);
        }
      }
      for (let i = maxXY.x; i < tileCount; i++) {
        for (let j = Math.min(0, minXY.y - halfy); j < Math.max(maxXY.y + halfy, tileCount); j++) {
          this._updateTileList(updateTileList, i, j, zoom);
        }
      }
    }
    for (let i = Math.max(0, minXY.x - halfx); i < Math.min(maxXY.x + halfx, tileCount); i++) {
      for (let j = Math.max(0, minXY.y - halfy); j < Math.min(maxXY.y + halfy, tileCount); j++) {
        this._updateTileList(updateTileList, i, j, zoom);
      }
    }
    // 过滤掉已经存在的
    // tileList = tileList.filter(tile => {
    // })
    updateTileList = updateTileList.sort((a, b) => {
      const tile1 = a.split('_');
      const tile2 = b.split('_');
      const d1 = Math.pow((tile1[0] * 1 - centerXY.x), 2) + Math.pow((tile1[1] * 1 - centerXY.y), 2);
      const d2 = Math.pow((tile2[0] * 1 - centerXY.x), 2) + Math.pow((tile2[1] * 1 - centerXY.y), 2);
      return d1 - d2;
    });
    updateTileList.forEach(key => {
      this._requestTile(key, this);
    });
    this._removeOutTiles();
  }

  _updateTileList(updateTileList, x, y, z) {
    const key = [ x, y, z ].join('_');
    this.tileList.push(key);
    if (this._tileKeys.indexOf(key) === -1 && updateTileList.indexOf(key) === -1) {
      updateTileList.push(key);
    }
  }
  _requestTile(key, layer) {
    let tile = this._tileCache.getTile(key);
    if (!tile) {
      tile = this._createTile(key, layer);
      tile.on('tileLoaded', () => {
        if (this.tileList.indexOf(key) === -1) {
          return;
        }
        const mesh = tile.getMesh();
        mesh.name = key;
        this._tileCache.setTile(tile, key);
        this._tileKeys.push(key);
        mesh.children.length !== 0 && this._tiles.add(tile.getMesh());
        this.scene._engine.update();
      });
    } else {
      this._tiles.add(tile.getMesh());
      this._tileKeys.push(key);
    }
  }
  // 移除视野外的tile
  _removeOutTiles() {
    for (let i = this._tiles.children.length - 1; i >= 0; i--) {
      const tile = this._tiles.children[i];
      const key = tile.name;
      if (this.tileList.indexOf(key) === -1) {
        const tileObj = this._tileCache.getTile(key);
        tileObj && tileObj._abortRequest();
        this._tiles.remove(tile);
      }
      this._tileKeys = [].concat(this.tileList);
    }
  }
  _removeTiles() {
    if (!this._tiles || !this._tiles.children) {
      return;
    }

    for (let i = this._tiles.children.length - 1; i >= 0; i--) {
      this._tiles.remove(this._tiles.children[i]);
    }
  }
  _destroyTile(tile) {
    tile.destroy();
  }
  desttroy() {
  }
}
