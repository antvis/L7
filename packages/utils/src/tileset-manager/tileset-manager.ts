import EventEmitter from 'eventemitter3';
import {
  DEFAULT_CACHE_SCALE,
  DEFAULT_EXTENT,
  NOOP,
  UPDATE_TILE_STRATEGIES,
} from './const';
import { Tile } from './tile';
import { TilesetManagerOptions, UpdateTileStrategy } from './types';
import { getTileIndices } from './utils/lonlat-tile';

/**
 * 管理瓦片数据
 */
export class TilesetManager extends EventEmitter {
  public get isLoaded() {
    return this.currentTiles.every((tile) => tile.isDone);
  }
  // 缓存的瓦片数组
  public get tiles() {
    // 通过 zoom 层级排序，最小的层级在上面
    const tiles = Array.from(this.cacheTiles.values()).sort(
      (t1, t2) => t1.z - t2.z,
    );
    return tiles;
  }
  // 当前层级的瓦片
  public currentTiles: Tile[] = [];
  // 配置项
  protected options: TilesetManagerOptions;
  // 缓存的瓦片，key 为 {z}-{x}-{y}
  private cacheTiles = new Map<string, Tile>();
  // 上一次视野状态
  private lastViewStates: {
    zoom: number;
    latLonBounds: [number, number, number, number];
  };

  constructor(options: Partial<TilesetManagerOptions>) {
    super();
    this.options = {
      tileSize: 256,
      minZoom: 0,
      maxZoom: Infinity,
      zoomOffset: 0,
      extent: DEFAULT_EXTENT,
      getTileData: NOOP,
      updateStrategy: UpdateTileStrategy.Overlap,
    };
    this.updateOptions(options);
  }

  // 更新配置项
  public updateOptions(options: Partial<TilesetManagerOptions>) {
    const minZoom =
      options.minZoom === undefined
        ? this.options.minZoom
        : Math.ceil(options.minZoom);
    const maxZoom =
      options.maxZoom === undefined
        ? this.options.maxZoom
        : Math.floor(options.maxZoom);
    this.options = { ...this.options, ...options, minZoom, maxZoom };
  }

  // 更新
  // 1.瓦片序号发生改变 2.瓦片新增 3.瓦片显隐控制
  public update(zoom: number, latLonBounds: [number, number, number, number]) {
    if (
      this.lastViewStates &&
      this.lastViewStates.zoom === zoom &&
      this.lastViewStates.latLonBounds.toString() === latLonBounds.toString()
    ) {
      return;
    }

    this.lastViewStates = { zoom, latLonBounds };

    let isAddTile = false;
    const tileIndices = this.getTileIndices(zoom, latLonBounds);

    this.currentTiles = tileIndices.map(({ x, y, z }) => {
      let tile = this.getTile(x, y, z);
      if (tile) {
        return tile;
      }

      tile = this.createTile(x, y, z);
      isAddTile = true;
      return tile;
    });

    if (isAddTile) {
      // 更新缓存
      this.resizeCacheTiles();
      // 重新瓦片树
      this.rebuildTileTree();
    }

    // 更新瓦片显示状态
    this.updateTileVisible();
  }

  // 重新加载瓦片
  public reloadAll() {
    for (const [tileId, tile] of this.cacheTiles) {
      if (!this.currentTiles.includes(tile)) {
        this.cacheTiles.delete(tileId);
        this.onTileUnload(tile);
      }
      this.onTileUnload(tile);
      tile.loadData({
        getData: this.options.getTileData,
        onLoad: this.onTileLoad,
        onError: this.onTileError,
      });
    }
  }

  // 摧毁
  public destroy() {
    for (const tile of this.cacheTiles.values()) {
      if (tile.isLoading) {
        tile.abortLoad();
      }
    }
    this.cacheTiles.clear();
    this.currentTiles = [];
    this.removeAllListeners();
  }

  // 更新瓦片显隐状态
  public updateTileVisible() {
    const updateStrategy = this.options.updateStrategy;
    const beforeVisible = new Map<string, boolean>();

    // 重置显示状态
    for (const tile of this.cacheTiles.values()) {
      // 存储已经显示的瓦片
      beforeVisible.set(tile.key, tile.isVisible);
      tile.isCurrent = false;
      tile.isVisible = false;
    }
    // 设置当前视野的瓦片为可见
    for (const tile of this.currentTiles) {
      tile.isCurrent = true;
      tile.isVisible = true;
    }

    const tiles = Array.from(this.cacheTiles.values());

    if (typeof updateStrategy === 'function') {
      updateStrategy(tiles);
    } else {
      UPDATE_TILE_STRATEGIES[updateStrategy](tiles);
    }

    // 检查瓦片显示状态是否发生改变
    const isVisibleChange = Array.from(this.cacheTiles.values()).some(
      (tile) => tile.isVisible !== beforeVisible.get(tile.key),
    );

    if (isVisibleChange) {
      this.emit('tile-update');
    }
  }

  // 获取当前视野层级瓦片的所有索引
  protected getTileIndices(
    zoom: number,
    latLonBounds: [number, number, number, number],
  ) {
    const { tileSize, extent, zoomOffset } = this.options;
    const maxZoom = Math.floor(this.options.maxZoom);
    const minZoom = Math.ceil(this.options.minZoom);

    const indices = getTileIndices({
      maxZoom,
      minZoom,
      zoomOffset,
      tileSize,
      zoom,
      latLonBounds,
      extent,
    });

    return indices;
  }

  // 瓦片加载成功回调
  private onTileLoad = (tile: Tile) => {
    this.emit('tile-loaded', tile);
    this.updateTileVisible();
  };

  // 瓦片加载失败回调
  private onTileError = (error: Error, tile: Tile) => {
    this.emit('tile-error', { error, tile });
    this.updateTileVisible();
  };

  // 瓦片被删除回调
  private onTileUnload = (tile: Tile) => {
    this.emit('tile-unload', tile);
  };

  // 获取瓦片 ID
  private getTileId(x: number, y: number, z: number) {
    const tileId = `${x},${y},${z}`;
    return tileId;
  }

  // 获取瓦片
  private getTile(x: number, y: number, z: number) {
    const tileId = this.getTileId(x, y, z);
    const tile = this.cacheTiles.get(tileId);

    return tile;
  }

  // 创建瓦片
  private createTile(x: number, y: number, z: number) {
    const tileId = this.getTileId(x, y, z);
    const tile = new Tile({ x, y, z, tileSize: this.options.tileSize });

    this.cacheTiles.set(tileId, tile);
    tile.loadData({
      getData: this.options.getTileData,
      onLoad: this.onTileLoad,
      onError: this.onTileError,
    });

    return tile;
  }

  // 当缓存超过最大值时，清除不可见的瓦片
  private resizeCacheTiles() {
    const maxCacheSize = DEFAULT_CACHE_SCALE * this.currentTiles.length;

    const overflown = this.cacheTiles.size > maxCacheSize;

    if (overflown) {
      for (const [tileId, tile] of this.cacheTiles) {
        if (!tile.isVisible && !this.currentTiles.includes(tile)) {
          this.cacheTiles.delete(tileId);
          this.onTileUnload(tile);
        }
        if (this.cacheTiles.size <= maxCacheSize) {
          break;
        }
      }
    }
  }

  // 重新计算瓦片树
  private rebuildTileTree() {
    // 清空瓦片上的数据
    for (const tile of this.cacheTiles.values()) {
      tile.parent = null;
      tile.children.length = 0;
    }

    // 重新计算瓦片上的关系树
    for (const tile of this.cacheTiles.values()) {
      const parent = this.getNearestAncestor(tile.x, tile.y, tile.z);
      tile.parent = parent;
      if (parent?.children) {
        parent.children.push(tile);
      }
    }
  }

  // 获取瓦片的最近上级的瓦片
  private getNearestAncestor(x: number, y: number, z: number) {
    while (z > this.options.minZoom) {
      x = Math.floor(x / 2);
      y = Math.floor(y / 2);
      z = z - 1;
      const parent = this.getTile(x, y, z);
      if (parent) {
        return parent;
      }
    }
    return null;
  }
}
