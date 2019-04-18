import Layer from '../../core/layer';
import * as THREE from '../../core/three';
import TileCache from './tileCache';
import { toLngLat } from '@antv/geo-coord';
import { epsg3857 } from '@antv/geo-coord/lib/geo/crs/crs-epsg3857';
export default class TileLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, cfg);
    this._tileCache = new TileCache();
    this._crs = epsg3857;
    this._tiles = new THREE.Object3D();
    this._tileKeys = [];
    this.tileList = [];


  }
  source(url) {
    this.url = url;
    return this;
  }
  render() {
    this._initMapEvent();
    this.draw();
  }
  draw() {
    this._object3D.add(this._tiles);
    this._calculateLOD();
  }
  drawTile() {

  }
  zoomchange(ev) {
    super.zoomchange(ev);
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
    const NWPonint = this._crs.lngLatToPoint(toLngLat(NW.lng, NW.lat), zoom);
    const SEPonint = this._crs.lngLatToPoint(toLngLat(SE.lng, SE.lat), zoom);
    const minXY = NWPonint.divideBy(256).round();
    const maxXY = SEPonint.divideBy(256).round();
    // console.log(NW.lng, NW.lat, SE.lng, SE.lat, NWPonint, SEPonint);
    let updateTileList = [];
    this.tileList = [];
    const halfx = Math.floor((maxXY.x - minXY.x) / 2) + 1;
    const halfy = Math.floor((maxXY.y - minXY.y) / 2) + 1;
    for (let i = minXY.x - halfx; i < maxXY.x + halfx; i++) {
      for (let j = minXY.y - halfy; j < maxXY.y + halfy; j++) {
        const key = [ i, j, zoom ].join('_');
        this.tileList.push(key);
        if (this._tileKeys.indexOf(key) === -1) {
          updateTileList.push(key);
        }
      }
    }
    // 过滤掉已经存在的
    // tileList = tileList.filter(tile => {
    // })
    updateTileList = updateTileList.sort((a, b) => {
      const tile1 = a.split('_');
      const tile2 = b.split('_');
      const d1 = Math.pow((tile1[0] - halfx), 2) + Math.pow((tile1[1] - halfy));
      const d2 = Math.pow((tile2[0] - halfy), 2) + Math.pow((tile2[1] - halfy));
      return d1 - d2;
    });
    updateTileList.forEach(key => {
      this._requestTile(key, this);
    });
    this._removeOutTiles();
  }
  _requestTile(key, layer) {
    let tile = this._tileCache.getTile(key);
    if (!tile) {
      tile = this._createTile(key, layer);
      const mesh = tile.getMesh();
      mesh.name = key;
      this._tileCache.setTile(tile, key);
      this._tileKeys.push(key);
      // this.scene._engine.update();
    }
    this._tiles.add(tile.getMesh());
    this._tileKeys.push(key);
  }
  // 移除视野外的tile
  _removeOutTiles() {
    for (let i = this._tiles.children.length - 1; i >= 0; i--) {
      const tile = this._tiles.children[i];
      const key = tile.name;
      if (this.tileList.indexOf(key) === -1) {
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
  _destroyTile() {

  }
  desttroy() {
  }
}
