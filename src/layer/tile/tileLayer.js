import Layer from '../../core/layer';
import source from '../../core/source';
import * as THREE from '../../core/three';
import TileCache from './tileCache';
import pickingFragmentShader from '../../core/engine/picking/picking_frag.glsl';
import { throttle, deepMix } from '@antv/util';
import { toLngLat } from '@antv/geo-coord';
import { epsg3857 } from '@antv/geo-coord/lib/geo/crs/crs-epsg3857';
export default class TileLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this._tileCache = new TileCache(50, this._destroyTile);
    this._crs = epsg3857;
    this._tiles = new THREE.Object3D();
    this._pickTiles = new THREE.Object3D();
    this._pickTiles.name = this.layerId;
    this.scene._engine._picking.add(this._pickTiles);
    this._tiles.frustumCulled = false;
    this._tileKeys = [];
    this.tileList = [];
  }
  shape(field, values) {
    const layerType = this.get('layerType');
    if (layerType === 'point') {
      return super.shape(field, values);
    }
    this.shape = field;
    return this;
  }
  source(url, cfg = {}) {
    this.url = url;
    this.sourceCfg = cfg;
    this.sourceCfg.mapType = this.scene.mapType;
    return this;
  }
  tileSource(data, cfg) {
    if (data instanceof source) {
      return data;
    }
    const tileSourceCfg = {
      data,
      zoom: this.scene.getZoom()
    };
    deepMix(tileSourceCfg, this.sourceCfg, cfg);
    return new source(tileSourceCfg);
  }
  render() {
    this._initControllers();
    this._initMapEvent();
    this._initAttrs();
    this._initInteraction();
    this.draw();
    return this;
  }
  draw() {
    this._object3D.add(this._tiles);
    this._calculateLOD();
  }
  drawTile() {

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
        if (mesh.children.length !== 0) {
          this._tiles.add(tile.getMesh());
          this._addPickTile(tile.getMesh());
        }
      });
    } else {
      this._tiles.add(tile.getMesh());
      this._addPickTile(tile.getMesh());
      this._tileKeys.push(key);
      this.scene._engine.update();
    }
  }
  _addPickTile(meshobj) {
    const mesh = meshobj.children[0];
    const pickmaterial = mesh.material.clone();
    pickmaterial.fragmentShader = pickingFragmentShader;
    const pickingMesh = new THREE[mesh.type](mesh.geometry, pickmaterial);
    pickingMesh.name = this.layerId;
    pickingMesh.onBeforeRender = () => {
      const zoom = this.scene.getZoom();
      pickingMesh.material.setUniformsValue('u_zoom', zoom);
    };
    this._pickTiles.add(pickingMesh);

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
    tile = null;
  }
  desttroy() {
  }
}
