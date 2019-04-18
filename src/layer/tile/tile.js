import * as THREE from '../../core/three';
import { toLngLatBounds, toBounds } from '@antv/geo-coord';
const r2d = 180 / Math.PI;
const tileURLRegex = /\{([zxy])\}/g;

export default class Tile {
  constructor(key, url, layer) {
    this.layer = layer;
    this._tile = key.split('_').map(v => v * 1);
    this._path = url;
    this._tileLnglatBounds = this._tileLnglatBounds(this._tile);

    this._tileBounds = this._tileBounds(this._tileLnglatBounds);

    this._center = this._tileBounds.getCenter();

    this._centerLnglat = this._tileLnglatBounds.getCenter();
    this.Object3D = new THREE.Object3D();
    this.requestTileAsync();


  }
  _createMesh() {}
  _getTileURL(urlParams) {
    if (!urlParams.s) {
      // Default to a random choice of a, b or c
      urlParams.s = String.fromCharCode(97 + Math.floor(Math.random() * 3));
    }

    tileURLRegex.lastIndex = 0;
    return this._path.replace(tileURLRegex, function(value, key) {
      return urlParams[key];
    });
  }
   // 经纬度范围转瓦片范围
  _tileBounds(lnglatBound) {
    const ne = this.layer.scene.project([ lnglatBound.getNorthWest().lng, lnglatBound.getNorthEast().lat ]);
    const sw = this.layer.scene.project([ lnglatBound.getSouthEast().lng, lnglatBound.getSouthWest().lat ]);
    return toBounds(sw, ne);
  }
  getMesh() {
    return this.Object3D;
  }


  // Get tile bounds in WGS84 coordinates
  _tileLnglatBounds(tile) {
    const e = this._tile2lng(tile[0] + 1, tile[2]);
    const w = this._tile2lng(tile[0], tile[2]);
    const s = this._tile2lat(tile[1] + 1, tile[2]);
    const n = this._tile2lat(tile[1], tile[2]);
    return toLngLatBounds([ w, n ], [ e, s ]);
  }

  _tile2lng(x, z) {
    return x / Math.pow(2, z) * 360 - 180;
  }

  _tile2lat(y, z) {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  }
  destory() {

  }
}
