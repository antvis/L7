import * as THREE from '../../core/three';
import Base from '../../core/base';
import { destoryObject } from '../../util/object3d-util';
import Controller from '../../core/controller/index';
import Util from '../../util';
import Global from '../../global';
import Attr from '../../attr/index';
import { toLngLatBounds, toBounds } from '@antv/geo-coord';
const r2d = 180 / Math.PI;
const tileURLRegex = /\{([zxy])\}/g;
function parseFields(field) {
  if (Util.isArray(field)) {
    return field;
  }
  if (Util.isString(field)) {
    return field.split('*');
  }
  return [ field ];
}
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
    this._object3D = new THREE.Object3D();
    this._object3D.onBeforeRender = () => {
    };
    this._isLoaded = false;
    this._initControllers();
    this.requestTileAsync(data => this._init(data));
  }
  _init(data) {
    this._creatSource(data);
    this._initTileAttrs();
    this._mapping();
    this._createMesh();
  }
  _initControllers() {
    const scales = this.layer.get('scaleOptions');
    const scaleController = new Controller.Scale({
      defs: {
        ...scales
      }
    });
    this.set('scaleController', scaleController);
  }
  _createScale(field) {
    // TODO scale更新
    const scales = this.get('scales');
    let scale = scales[field];
    if (!scale) {
      scale = this.createScale(field);
      scales[field] = scale;
    }
    return scale;
  }
  createScale(field) {
    const data = this.source.data.dataArray;
    const scales = this.get('scales');
    let scale = scales[field];
    const scaleController = this.get('scaleController');
    if (!scale) {
      scale = scaleController.createScale(field, data);
      scales[field] = scale;
    }
    return scale;
  }
  // 获取属性映射的值
  _getAttrValues(attr, record) {
    const scales = attr.scales;
    const params = [];
    for (let i = 0; i < scales.length; i++) {
      const scale = scales[i];
      const field = scale.field;
      if (scale.type === 'identity') {
        params.push(scale.value);
      } else {
        params.push(record[field]);
      }
    }
    const indexZoom = params.indexOf('zoom');
    indexZoom !== -1 ? params[indexZoom] = attr.zoom : null;
    const values = attr.mapping(...params);
    return values;
  }
  _mapping() {

    const attrs = this.get('attrs');
    const mappedData = [];
    // const data = this.layerSource.propertiesData;
    const data = this.source.data.dataArray;
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
    this.layerData = mappedData;
  }
  _initTileAttrs() {
    const attrOptions = this.layer.get('attrOptions');
    for (const type in attrOptions) {
      if (attrOptions.hasOwnProperty(type)) {
        this._updateTileAttr(type);
      }
    }
  }
  _updateTileAttr(type) {
    const self = this;
    const attrs = this.get('attrs');
    const attrOptions = this.layer.get('attrOptions');
    const option = attrOptions[type];
    option.neadUpdate = true;
    const className = Util.upperFirst(type);
    const fields = parseFields(option.field);
    const scales = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const scale = self._createScale(field);

      if (type === 'color' && Util.isNil(option.values)) { // 设置 color 的默认色值
        option.values = Global.colors;
      }
      scales.push(scale);
    }
    option.scales = scales;
    const attr = new Attr[className](option);
    attrs[type] = attr;
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
  _preRender() {
  }
  destroy() {
    super.destroy();
    destoryObject(this._object3D);
  }
}
