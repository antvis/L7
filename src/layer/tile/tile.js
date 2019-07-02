import * as THREE from '../../core/three';
import Base from '../../core/base';
import { destoryObject } from '../../util/object3d-util';
import Controller from '../../core/controller/index';
import { toLngLatBounds, toBounds } from '@antv/geo-coord';
const r2d = 180 / Math.PI;
const tileURLRegex = /\{([zxy])\}/g;
export default class Tile extends Base {
  constructor(key, url, layer) {
    super({
      scales: {},
      attrs: {}
    });
    this.layer = layer;
    this._tile = key.split('_').map(v => v * 1);
    this._path = url;
    this._tileLnglatBounds = this._tileLnglatBounds(this._tile);

    this._tileBounds = this._tileBounds(this._tileLnglatBounds);

    this._center = this._tileBounds.getCenter();

    this._centerLnglat = this._tileLnglatBounds.getCenter();
    this._object3D = new THREE.Object3D({ name: key });
    this._object3D.frustumCulled = false;
    // this._object3D.name = key;
    this._object3D.onBeforeRender = () => {
    };
    this._isLoaded = false;
    this.requestTileAsync(data => this._init(data));
  }
  _init(data) {
    // this._creatSource(data); // 获取Source
    this.layerSource = data;

    if (this.layerSource.data === null) {
      this.isValid = false;
      return;
    }
    this.isValid = true;
    this._initControllers();
    this._createMesh();
  }
  repaint() {
    this._initControllers();
    this._createMesh();
  }
  requestTileAsync(done) {
    // 获取数据
    this.layer.workerTileSource.loadTile({
      tile: this._tile,
      url: this.layer.tileSource.getRequestUrl(this._tile[0], this._tile[1], this._tile[2])
    });
    const data = this.layer.tileSource.getTileData(this._tile[0], this._tile[1], this._tile[2]);
    if (data.loaded) {
      done(data.data);
    } else {
      data.data.then(data => {
        done(data);
      });
    }
  }
  _initControllers() {
    const mappingCtr = new Controller.Mapping({
      layer: this.layer,
      mesh: this
    });
    const bufferCtr = new Controller.Buffer({
      layer: this.layer,
      mesh: this
    });
    this.set('mappingController', mappingCtr);
    this.set('bufferController', bufferCtr);

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
    const ne = this.layer.scene.project([ lnglatBound.getNorthEast().lng, lnglatBound.getNorthEast().lat ]);
    const sw = this.layer.scene.project([ lnglatBound.getSouthWest().lng, lnglatBound.getSouthWest().lat ]);
    return toBounds(sw, ne);
  }
  getMesh() {
    return this._object3D;
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
  _retainParent(x, y, z, minZoom = 5) {
    const x2 = Math.floor(x / 2),
      y2 = Math.floor(y / 2),
      z2 = z - 1,
      coords2 = [ +x2, +y2, +z2 ];
    const tile = this._tiles[coords2]; // 计算保留
    if (tile && tile.active) {
      tile.retain = true;
      return true;

    } else if (tile && tile.loaded) {
      tile.retain = true;
    }

    if (z2 > minZoom) {
      return this._retainParent(x2, y2, z2, minZoom);
    }

    return false;
  }
  updateColor() {
    const bufferCtr = this.get('bufferController');
    this.get('mappingController').update();
    bufferCtr._updateColorAttributes(this.getMesh().children[0]);
  }
  updateStyle() {
    const bufferCtr = this.get('bufferController');
    bufferCtr._updateStyle(this.getMesh().children[0]);
  }
  _preRender() {
  }
  destroy() {
    super.destroy();
    destoryObject(this._object3D);
  }
}
