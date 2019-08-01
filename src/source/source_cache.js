import Base from '../core/base';
import TileCache from '../layer/tile/tile_cache';
import VectorTileSource from './vector_tile_source';
import { toLngLat, Bounds, Point } from '@antv/geo-coord';
import VectorTileMesh from '../layer/tile/vector_tile_mesh';
// 统一管理 source 添加，管理，更新
export default class SouceCache extends Base {
  constructor(scene, cfg) {
    super({
      cacheLimit: 50,
      minZoom: 0,
      maxZoom: 18,
      keepBuffer: 0,
      ...cfg
    });
    this._tileMap = {};// 视野内瓦片坐标序列
    this.tileList = {}; // 正在使用的瓦片坐标，记录瓦片的使用状态
    this.scene = scene;
    // TODO 销毁函数
    this._tileCache = new TileCache(this.get('cacheLimit'), this._destroyTile.bind(this));
    this.layers = this.scene.getLayers();
    this._source = new VectorTileSource(cfg, this.scene.style.WorkerController);
    this.layersTiles = {}; // 存储当前source所有layer的瓦片
    // this._tiles = new THREE.Object3D();
  }
  getLayerById(id) {
    const layers = this.scene.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      if (layers[i].layerId === id * 1) {
        return layers[i];
      }
    }
  }
  /**
   * 移除视野外的瓦片，计算新增的瓦片数据
   * @param {*}tileMap 瓦片列表
   */

  update() {
    // if (!layercfg && this.layercfg) return;
    // this._layercfg = layercfg;
    this._calculateTileIDs();
    // this.updateList = this._getNewTiles(this._tileMap);// 计算新增瓦片
    // this._pruneTiles();
    for (let i = 0; i < this.updateTileList.length; i++) {
      // 瓦片相关参数
      const tileId = this.updateTileList[i].join('_');
      const tileinfo = this.tileList[tileId];
      tileinfo.loading = true;
      const tiles = this._tileCache.getTile(tileId);
      if (tiles !== undefined) {
        tileinfo.active = true;
        tileinfo.loaded = true;
        for (const layerId in tiles) {
          const layer = this.getLayerById(layerId);
          const tileMesh = tiles[layerId];
          layer.tiles.add(tileMesh.getMesh());
          this.scene._engine.update();
        }
        this._pruneTiles();
        continue;
      }
      this._source.loadTile(tileinfo, (err, data) => {
        if (!err && data !== undefined) {
          this._renderTile(tileinfo, data);
          tileinfo.active = true;
        }
        tileinfo.loaded = true;
        this._pruneTiles();
      });
    }
  }

  _renderTile(tileinfo, data) {
    const tileId = tileinfo.id;
    const tiles = {};
    for (const layerId in data) {
      const layer = this.getLayerById(layerId);
      const tileMesh = new VectorTileMesh(layer, data[layerId]);
      tiles[layerId] = tileMesh;
      layer.tiles.add(tileMesh.getMesh());
      this.scene._engine.update();
    }

    this._tileCache.setTile(tiles, tileId);
  }
  // 计算视野内的瓦片坐标
  _calculateTileIDs() {
    this._tileMap = {};
    this.updateTileList = [];
    const zoom = Math.floor(this.scene.getZoom());  // - window.window.devicePixelRatio + 1; // zoom - 1
    const minSourceZoom = this.get('minZoom');
    const maxSourceZoom = this.get('maxZoom');
    this.tileZoom = zoom > maxSourceZoom ? maxSourceZoom : zoom;
    const currentZoom = this.scene.getZoom();
    if (currentZoom < minSourceZoom) {
      this._removeTiles();
      // 小于source最小范围不在处理
      return;
    }
    const pixelBounds = this._getPixelBounds();
    const tileRange = this._pxBoundsToTileRange(pixelBounds);
    const margin = this.get('keepBuffer');
    const center = this.scene.getCenter();
    const centerPoint = this.scene.crs.lngLatToPoint(toLngLat(center.lng, center.lat), this.tileZoom);
    const centerXY = centerPoint.divideBy(256).floor();
    this._noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([ margin, -margin ]),
      tileRange.getTopRight().add([ margin, -margin ]));
    if (!(isFinite(tileRange.min.x) &&
      isFinite(tileRange.min.y) &&
      isFinite(tileRange.max.x) &&
      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }
    for (let j = tileRange.min.y; j <= tileRange.max.y; j++) {
      for (let i = tileRange.min.x; i <= tileRange.max.x; i++) {
        const coords = [ i, j, this.tileZoom ];
        const tile = this.tileList[coords.join('_')];
        if (tile && tile.loading) {
          tile.current = true;
          tile.retain = true;
        } else {
          this.tileList[coords.join('_')] = {
            current: true,
            active: false,
            retain: true,
            loading: false,
            coords,
            id: coords.join('_')
          };
          this.updateTileList.push(coords);
        }
      }
    }
    // 根据中心点排序
    this.updateTileList.sort((a, b) => {
      const tile1 = a;
      const tile2 = b;
      const d1 = Math.pow((tile1[0] * 1 - centerXY.x), 2) + Math.pow((tile1[1] * 1 - centerXY.y), 2);
      const d2 = Math.pow((tile2[0] * 1 - centerXY.x), 2) + Math.pow((tile2[1] * 1 - centerXY.y), 2);
      return d1 - d2;
    });
    this._pruneTiles();
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

  _loadTile(tile, callback) {
    return this._source.loadTile(tile, callback);

  }
  _unloadTile(tile) {
    if (this._source.unloadTile) {
      return this._source.unloadTile(tile, () => { });
    }
  }

  _abortTile(tile) {
    if (this._source.abortTile) {
      return this._source.abortTile(tile, () => { });
    }
  }
  reload() {

  }

  _reloadTile() {

  }
  _removeTile() {

  }
  clearTiles() {

  }
  _pruneTiles() {
    let tile;
    const zoom = this.tileZoom;
    for (const key in this.tileList) {
      const c = this.tileList[key].coords;
      if (c[2] !== zoom || !this._noPruneRange.contains(new Point(c[0], c[1]))) {
        this.tileList[key].current = false;
        this.tileList[key].retain = false;
      }
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
      tile.current = true;
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
          tile.current = true;
          continue;
        } else if (tile && tile.loaded) {
          tile.retain = true;
          tile.current = true;
        }

        if (z + 1 < maxZoom) {
          this._retainChildren(i, j, z + 1, maxZoom);
        }
      }
    }
  }
  _removeOutTiles() {
    // 移除视野外的tile
    for (const key in this.tileList) {
      if (!this.tileList[key].retain) {
        this._abortTile(this.tileList[key]);
        this._unloadTile(this.tileList[key]);
        delete this.tileList[key];
      }
    }
    const layers = this.scene.getLayers();
    for (let i = 0; i < layers.length; i++) {
      const id = this.get('sourceID');
      const layerSource = layers[i].get('sourceOption').id;
      if (layerSource !== id) {
        return;
      }
      layers[i].tiles.children.forEach(tile => {
        const key = tile.name;
        if (!this.tileList[key]) {
          layers[i].tiles.remove(tile);
        }
      });
    }
    // 移除对应的数据
  }
  _destroyTile(tile, key) {
    this._unloadTile(key);
  }
  // 移除视野外的tile

}
