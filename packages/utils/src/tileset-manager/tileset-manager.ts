import EventEmitter from 'eventemitter3';
import { throttle } from 'lodash';
import {
  BOUNDS_BUFFER_SCALE,
  DEFAULT_CACHE_SCALE,
  DEFAULT_EXTENT,
  NOOP,
  UPDATE_TILE_STRATEGIES,
} from './const';
import { SourceTile } from './tile';
import { TileBounds, TilesetManagerOptions, UpdateTileStrategy } from './types';
import {
  getLatLonBoundsBuffer,
  isLatLonBoundsContains,
} from './utils/bound-buffer';
import { getTileIndices, osmLonLat2TileXY } from './utils/lonlat-tile';

export enum TileEventType {
  TilesLoadStart = 'tiles-load-start',
  TileLoaded = 'tile-loaded',
  TileError = 'tile-error',
  TileUnload = 'tile-unload',
  TileUpdate = 'tile-update',
  TilesLoadFinished = 'tiles-load-finished',
}

/**
 * 管理瓦片数据
 */
export class TilesetManager extends EventEmitter {
  public currentZoom?: number;
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
  public currentTiles: SourceTile[] = [];
  // 配置项
  protected options: TilesetManagerOptions;
  // 缓存的瓦片，key 为 {z}-{x}-{y}
  private cacheTiles = new Map<string, SourceTile>();
  // 上一次视野状态
  private lastViewStates?: {
    zoom: number;
    latLonBounds: [number, number, number, number];
    latLonBoundsBuffer: [number, number, number, number];
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
      warp: true,
      // TODO 更新策略
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

  public throttleUpdate = throttle((zoom, latLonBounds) => {
    this.update(zoom, latLonBounds);
  }, 16);

  // 更新
  // 1.瓦片序号发生改变 2.瓦片新增 3.瓦片显隐控制
  public update(zoom: number, latLonBounds: [number, number, number, number]) {
    // 校验层级，向上取整
    const verifyZoom = Math.max(0, Math.ceil(zoom));

    if (
      this.lastViewStates &&
      this.lastViewStates.zoom === verifyZoom &&
      isLatLonBoundsContains(
        this.lastViewStates.latLonBoundsBuffer,
        latLonBounds,
      )
    ) {
      return;
    }

    // 扩大缓存区的边界
    const latLonBoundsBuffer = getLatLonBoundsBuffer(
      latLonBounds,
      BOUNDS_BUFFER_SCALE,
    );

    this.lastViewStates = {
      zoom: verifyZoom,
      latLonBounds,
      latLonBoundsBuffer,
    };

    this.currentZoom = verifyZoom;
    let isAddTile = false;
    const tileIndices = this.getTileIndices(
      verifyZoom,
      latLonBoundsBuffer,
    ).filter((tile) => {
      // 处理数据 warp
      return (
        this.options.warp || (tile.x >= 0 && tile.x < Math.pow(2, verifyZoom))
      );
    });
    this.emit(TileEventType.TilesLoadStart);
    this.currentTiles = tileIndices.map(({ x, y, z }) => {
      let tile = this.getTile(x, y, z);
      if (tile) {
        const needsReload = tile?.isFailure || tile?.isCancelled;
        if (needsReload) {
          tile.loadData({
            getData: this.options.getTileData,
            onLoad: this.onTileLoad,
            onError: this.onTileError,
          });
        }
        return tile;
      }
      tile = this.createTile(x, y, z);
      isAddTile = true;
      return tile;
    });

    if (isAddTile) {
      // 更新缓存
      this.resizeCacheTiles();
    }
    // 更新瓦片显示状态
    this.updateTileVisible();
    // 取消滞留请求中的瓦片
    this.pruneRequests();
  }

  // 重新加载瓦片
  public reloadAll() {
    for (const [tileId, tile] of this.cacheTiles) {
      if (!this.currentTiles.includes(tile)) {
        this.cacheTiles.delete(tileId);
        this.onTileUnload(tile);
        return;
      }
      this.onTileUnload(tile);
      tile.loadData({
        getData: this.options.getTileData,
        onLoad: this.onTileLoad,
        onError: this.onTileError,
      });
    }
  }

  public reloadTileById(z: number, x: number, y: number) {
    const tile = this.cacheTiles.get(`${x},${y},${z}`);
    if (tile) {
      this.onTileUnload(tile);
      tile.loadData({
        getData: this.options.getTileData,
        onLoad: this.onTileLoad,
        onError: this.onTileError,
      });
    }
  }

  public reloadTileByLnglat(lng: number, lat: number, z: number) {
    const tile = this.getTileByLngLat(lng, lat, z);
    if (tile) {
      this.reloadTileById(tile.z, tile.x, tile.y);
    }
  }

  public reloadTileByExtent(extent: TileBounds, z: number) {
    const tiles = this.getTileIndices(z, extent);
    tiles.forEach((tile) => {
      this.reloadTileById(tile.z, tile.x, tile.y);
    });
  }

  // 取消滞留请求中的瓦片
  public pruneRequests() {
    const abortCandidates: SourceTile[] = [];
    for (const tile of this.cacheTiles.values()) {
      if (tile.isLoading) {
        if (!tile.isCurrent && !tile.isVisible) {
          abortCandidates.push(tile);
        }
      }
    }

    while (abortCandidates.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tile = abortCandidates.shift()!;
      tile.abortLoad();
    }
  }

  public getTileByLngLat(lng: number, lat: number, zoom: number) {
    const { zoomOffset } = this.options;
    const z = Math.ceil(zoom) + zoomOffset;
    const xy = osmLonLat2TileXY(lng, lat, z);
    const tiles = this.tiles.filter((t) => t.key === `${xy[0]}_${xy[1]}_${z}`);
    return tiles[0];
  }

  public getTileExtent(extent: TileBounds, zoom: number) {
    return this.getTileIndices(zoom, extent);
  }

  public getTileByZXY(z: number, x: number, y: number) {
    const tile = this.tiles.filter((t) => t.key === `${x}_${y}_${z}`);
    return tile[0];
  }

  // 摧毁
  public clear() {
    for (const tile of this.cacheTiles.values()) {
      if (tile.isLoading) {
        tile.abortLoad();
      } else {
        this.onTileUnload(tile);
      }
    }
    this.lastViewStates = undefined;
    this.cacheTiles.clear();
    this.currentTiles = [];
  }

  // 摧毁
  public destroy() {
    this.clear();
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
    let isVisibleChange = false;
    Array.from(this.cacheTiles.values()).forEach((tile) => {
      if (tile.isVisible !== beforeVisible.get(tile.key)) {
        tile.isVisibleChange = true;
        isVisibleChange = true;
      } else {
        tile.isVisibleChange = false;
      }
    });

    if (isVisibleChange) {
      this.emit(TileEventType.TileUpdate);
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
  private onTileLoad = (tile: SourceTile) => {
    this.emit(TileEventType.TileLoaded, tile);
    this.updateTileVisible();
    this.loadFinished();
  };

  // 瓦片加载失败回调
  private onTileError = (error: Error, tile: SourceTile) => {
    this.emit(TileEventType.TileError, { error, tile });
    this.updateTileVisible();
    this.loadFinished();
  };

  // 瓦片被删除回调
  private onTileUnload = (tile: SourceTile) => {
    this.emit(TileEventType.TileUnload, tile);
    this.loadFinished();
  };

  // 获取瓦片 ID
  private getTileId(x: number, y: number, z: number) {
    const tileId = `${x},${y},${z}`;
    return tileId;
  }

  private loadFinished() {
    const finish = !this.currentTiles.some((t: SourceTile) => !t.isDone);
    if (finish) {
      this.emit(TileEventType.TilesLoadFinished);
    }

    return finish;
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
    const tile = new SourceTile({
      x,
      y,
      z,
      tileSize: this.options.tileSize,
      warp: this.options.warp,
    });

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
    // 缓存更新重新计算瓦片树
    this.rebuildTileTree();
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
