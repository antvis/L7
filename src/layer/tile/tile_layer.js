import Layer from '../../core/layer';
import Util from '../../util';
import diff from '../../util/diff';
import TileSource from '../../source/tile_source';
import * as THREE from '../../core/three';
import Controller from '../../core/controller/index';
import Global from '../../global';
const { pointShape } = Global;
import TileCache from './tile_cache';
import { toLngLat, Bounds, Point } from '@antv/geo-coord';
import { wrapNum } from '@antv/geo-coord/lib/util/index';
import { epsg3857 } from '@antv/geo-coord/lib/geo/crs/crs-epsg3857';
export default class TileLayer extends Layer {
  constructor(scene, cfg) {
    super(scene, {
      ...cfg,
      minSourceZoom: 0,
      maxSOurceZoom: 18,
      keepBuffer: 2
    });
    this._tileCache = new TileCache(50, this._destroyTile);
    this._crs = epsg3857;
    this._tiles = new THREE.Object3D();
    this._tiles.frustumCulled = false;
    this._tileKeys = [];
    this.tileList = {};
    this.type = this.get('layerType');
    this.workerPool = this.scene.workerPool;
  }
  shape(field, values) {
    const layerType = this.get('layerType');
    if (layerType === 'point') {
      return super.shape(field, values);
    }
    this.shape = field;
    return this;
  }
  source(data, cfg = {}) {
    if (data instanceof TileSource) {
      data.set('mapType', this.scene.mapType);
      this.tileSource = data;
    } else {
      cfg.mapType = this.scene.mapType;
      this.tileSource = new TileSource(data, cfg);
      this.sourceCfg = {
        ...cfg,
        url: data
      };
     
    }
    return this;
  }
  _initControllers() {
    const pickCtr = new Controller.Picking({ layer: this });
    const interactionCtr = new Controller.Interaction({ layer: this });
    this.set('pickingController', pickCtr);
    this.set('interacionController', interactionCtr);
  }
  render() {
    this._visibleWithZoom();
    this._updateDraw();
    this.scene._engine.update();
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
    this._visibleWithZoom();
    requestAnimationFrame(() => {
      this._calculateLOD();
    });
    this._calculateLOD();
  }

  dragend(ev) {
    super.dragend(ev);
    requestAnimationFrame(() => {
      this._calculateLOD();
    });

  }

  _calculateLOD() {
    /**
     * 加载完成 active
     * 需要显示 current
     * 是否保留 retain
     */
    const zoom = Math.floor(this.scene.getZoom()) - 1;
    const minZoom = this.get('minZoom');
    const maxZoom = this.get('maxZoom');
    const minSourceZoom = this.tileSource.get('minSourceZoom');
    const maxSourceZoom = this.tileSource.get('maxSourceZoom');
    const currentZoom = this.scene.getZoom();
    this.tileZoom = zoom > maxSourceZoom ? maxSourceZoom : zoom;
    if (currentZoom < minZoom || currentZoom >= maxZoom || currentZoom < minSourceZoom) {
      this._removeTiles();
      this._object3D.visible = false;
      return;
    } else if (this.get('visible')) {
      this._object3D.visible = true;
    }
    this.show();
    this.updateTileList = [];
    const center = this.scene.getCenter();
    const centerPoint = this._crs.lngLatToPoint(toLngLat(center.lng, center.lat), this.tileZoom);
    const centerXY = centerPoint.divideBy(256).floor();
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
        const tile = this.tileList[coords.join('_')];
        if (tile) {
          tile.current = true;
        } else {
          this.tileList[coords.join('_')] = {
            current: true,
            coords
          };
          this.updateTileList.push(coords);
        }
      }
    }
    this.updateTileList.sort((a, b) => {
      const tile1 = a;
      const tile2 = b;
      const d1 = Math.pow((tile1[0] * 1 - centerXY.x), 2) + Math.pow((tile1[1] * 1 - centerXY.y), 2);
      const d2 = Math.pow((tile2[0] * 1 - centerXY.x), 2) + Math.pow((tile2[1] * 1 - centerXY.y), 2);
      return d1 - d2;
    });
    this._pruneTiles();
    // 更新瓦片数据
    this.updateTileList.forEach(coords => {
      const key = coords.join('_');
      if (this.tileList[key].current) {
        this._requestTile(key, this);
      }
    });
  }
  _getShape(layerData) {
    let shape = null;
    if (!layerData[0].hasOwnProperty('shape')) {
      return 'normal';
    }
    for (let i = 0; i < layerData.length; i++) {
      shape = layerData[i].shape;
      if (shape !== undefined) {
        break;
      }
    }
    if (pointShape['2d'].indexOf(shape) !== -1) {
      return 'circle';
    } else if (pointShape['3d'].indexOf(shape) !== -1) {
      return 'fill';
    } else if (this.scene.image.imagesIds.indexOf(shape) !== -1) {
      return 'image';
    }
    return 'text';
  }
  _updateTileList(x, y, z) {
    const key = [ x, y, z ].join('_');
    const tile = this.tileList[key];
    if (tile) {
      tile.current = true;
    } else {
      this.tileList[key] = {
        current: true,
        active: false,
        coords: key.split('_')
      };
      this.updateTileList.push(key);
    }
  }
  _requestTile(key, layer) {
    const t = this.tileList[key];
    if (!t) {
      return;
    }
    let tile = this._tileCache.getTile(key);
    if (!tile) {
      tile = this._createTile(key, layer);
      tile.on('tileLoaded', () => {
        t.active = true;
        const mesh = tile.getMesh();
        mesh.name = key;
        this._tileCache.setTile(tile, key);
        this._tileKeys.push(key);
        if (mesh.type === 'composer') {
          this.scene._engine.composerLayers.push(mesh);
          this.scene._engine.update();
          this._pruneTiles();
          return;
        }
        if (mesh.children.length !== 0) {
          this._tiles.add(tile.getMesh());
          this._addPickTile(tile.getMesh());
        }
        this.scene._engine.update();
        this._pruneTiles();
      });
    } else {
      if (tile.getMesh().type === 'composer') {
        this.scene._engine.composerLayers.push(tile.getMesh());
        this.scene._engine.update();
        this._pruneTiles();
        return;
      }
      if (tile.needUpdate) {
        tile.updateColor();
        tile.needUpdate = false;
      }
      this._tiles.add(tile.getMesh());
      t.active = true;
      this._addPickTile(tile.getMesh());
      this._tileKeys.push(key);
      this.scene._engine.update();
      this._pruneTiles();
    }
  }
  _addPickTile(meshobj) {
    if (this.type === 'image') {
      return;
    }
    const pickCtr = this.get('pickingController');
    const mesh = meshobj.children[0];
    mesh.name = meshobj.name;
    pickCtr.addPickMesh(mesh);
  }
  // 根据距离优先级查找
  getSelectFeature(id, lnglat) {
    const zoom = this.tileZoom;

    const tilePoint = this._crs.lngLatToPoint(toLngLat(lnglat.lng, lnglat.lat), zoom);
    const tileXY = tilePoint.divideBy(256).floor();
    const key = [ tileXY.x, tileXY.y, zoom ].join('_');
    const tile = this._tileCache.getTile(key);
    const feature = tile ? tile.getSelectFeature(id) : null;
    return { feature };
  }
  _pruneTiles() {
    let tile;
    const zoom = this.tileZoom;
    for (const key in this.tileList) {
      const c = this.tileList[key].coords;
      if (c[2] !== zoom || !this.noPruneRange.contains(new Point(c[0], c[1]))) {
        this.tileList[key].current = false;
      }
    }

    for (const key in this.tileList) {
      tile = this.tileList[key];
      tile.retain = tile.current;
    }
    for (const key in this.tileList) {
      tile = this.tileList[key];
      if (tile.current && !tile.active) {
        const [ x, y, z ] = key.split('_').map(v => v * 1);
        if (!this._retainParent(x, y, z, z - 5)) {
          this._retainChildren(x, y, z, z + 2);
        }
      }

    }
    this._removeOutTiles();
  }
  _retainParent(x, y, z, minZoom) {
    const x2 = Math.floor(x / 2);
    const y2 = Math.floor(y / 2);
    const z2 = z - 1;
    const tile = this.tileList[[ x2, y2, z2 ].join('_')];
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
  _retainChildren(x, y, z, maxZoom) {
    for (let i = 2 * x; i < 2 * x + 2; i++) {
      for (let j = 2 * y; j < 2 * y + 2; j++) {
        const key = [ i, j, z + 1 ].join('_');
        const tile = this.tileList[key];
        if (tile && tile.active) {
          tile.retain = true;
          continue;
        } else if (tile && tile.loaded) {
          tile.retain = true;
        }

        if (z + 1 < maxZoom) {
          this._retainChildren(i, j, z + 1, maxZoom);
        }
      }
    }
  }
  // 移除视野外的tile
  _removeOutTiles() {
    for (const key in this.tileList) {
      if (!this.tileList[key].retain) {
        const tileObj = this._tileCache.getTile(key);
        if (tileObj) {
          tileObj._abortRequest();
          const pickCtr = this.get('pickingController');
          pickCtr && pickCtr.removePickMeshByName(tileObj.getMesh().name);
          this._tiles.remove(tileObj.getMesh());
        }
        if (tileObj && tileObj.getMesh().type === 'composer') {
          this.scene._engine.composerLayers = this.scene._engine.composerLayers.filter(obj => {
            return obj.name !== tileObj.getMesh().name;
          });
        }
        delete this.tileList[key];
      }
    }
    if (this._tiles.children.length > Object.keys(this.tileList).length) {
      this._tiles.children.forEach(tile => {
        const key = tile.name;
        if (!this.tileList[key]) {
          this._tiles.remove(tile);
        }
      });
    } // 移除 空的geom

    this.scene._engine.update();
  }


  _removeTiles() {
    this.hide();
    if (!this._tiles || !this._tiles.children) {
      return;
    }

    for (let i = this._tiles.children.length - 1; i >= 0; i--) {
      this._tiles.remove(this._tiles.children[i]);
    }
    this.tileList = [];
    this._tileKeys = [];
    this._tileCache.destory();
    const pickCtr = this.get('pickingController');
    pickCtr.removeAllMesh();
  }
  _getPixelBounds() {
    const viewPort = this.scene.getBounds().toBounds();
    const NE = viewPort.getNorthEast();
    const SW = viewPort.getSouthWest();
    const zoom = this.tileZoom;
    const center = this.scene.getCenter();
    const NEPoint = this._crs.lngLatToPoint(toLngLat(NE.lng, NE.lat), zoom);
    const SWPoint = this._crs.lngLatToPoint(toLngLat(SW.lng, SW.lat), zoom);
    const centerPoint = this._crs.lngLatToPoint(toLngLat(center.lng, center.lat), zoom);
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
  _wrapCoords(coords) {
    const wrapX = [ 0, Math.pow(2, coords[2]) ];
    const newX = wrapNum(coords[0], wrapX);
    return [ newX, coords[1], coords[2] ];
  }
  _destroyTile(tile) {
    tile.destroy();
    tile = null;
  }
  _updateDraw() {
    const preAttrs = this.get('preAttrOptions');
    const nextAttrs = this.get('attrOptions');
    const preStyle = this.get('preStyleOption');
    const nextStyle = this.get('styleOptions');
    if (preAttrs === undefined && preStyle === undefined) { // 首次渲染
      // this._setPreOption();
      this._scaleByZoom();
      this._initControllers();
      this._initInteraction();
      this._initMapEvent();
      this.draw();
      this._setPreOption();
      return;
    }
    if (!this._tiles.children.length > 0 || !this._object3D.visible) {
      return;
    }
     // 更新数据颜色 过滤 filter
    if (!Util.isEqual(preAttrs.color, nextAttrs.color) || !Util.isEqual(preAttrs.filter, nextAttrs.filter)) {
      this._tileCache.setNeedUpdate();
      this._tiles.children.forEach(tile => {
        const tileObj = this._tileCache.getTile(tile.name);
        tileObj.updateColor();
        tileObj.needUpdate = false;
        this.scene._engine.update();
      });
    }
    // 更新Size
    if (!Util.isEqual(preAttrs.size, nextAttrs.size)) {
      // this._tiles.children(tile => {
      //   this._tileCache.get(tile.name).updateSize();
      // });
    }
    // 更新形状
    if (!Util.isEqual(preAttrs.shape, nextAttrs.shape)) {
      // this._tiles.children(tile => {
      //   this._tileCache.get(tile.name).updateShape();
      // });
    }
    if (!Util.isEqual(preStyle, nextStyle)) {
      // 判断新增，修改，删除
      const newStyle = {};
      Util.each(diff(preStyle, nextStyle), ({ type, key, value }) => {
        (type !== 'remove') && (newStyle[key] = value);
        // newStyle[key] = type === 'remove' ? null : value;
      });
      this._tiles.children(tile => {
        this._tileCache.get(tile.name).updateStyle();
      });
    }
    this._setPreOption();
  }
  destroy() {
  }
}
