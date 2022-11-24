import bboxPolygon from '@turf/bbox-polygon';
import { EventEmitter } from 'eventemitter3';
import {
  LoadTileDataStatus,
  TileBounds,
  TileLoadDataOptions,
  TileOptions,
} from './types';
import { getTileWarpXY, tileToBounds } from './utils/lonlat-tile';
/**
 * 单个瓦片
 * 负责瓦片数据加载、缓存数据、缓存图层
 */
export class SourceTile extends EventEmitter {
  // 瓦片索引
  public x: number;
  public y: number;
  public z: number;
  // 循环加载瓦片
  public warp: boolean;
  // 瓦片大小
  public tileSize = 256;
  // 是否可以见
  public isVisible = false;
  // 是否是当前层级的瓦片
  public isCurrent = false;
  // 是否可以见发生变化
  public isVisibleChange = false;

  public loadedLayers: number = 0;

  public isLayerLoaded: boolean = false;
  public isLoad: boolean = false;
  public isChildLoad: boolean = false;
  // 瓦片的父级瓦片
  public parent: SourceTile | null = null;
  // 瓦片的子级瓦片
  public children: SourceTile[] = [];
  // 瓦片数据
  public data: any = null;
  // 瓦片属性
  public properties: Record<string, any> = {};
  // XMLHttpRequest cancel
  public xhrCancel?: () => void;
  // 瓦片请求状态
  private loadStatus: LoadTileDataStatus;
  // 瓦片数据 Web 请求控制器
  private abortController: AbortController;
  // 瓦片序号
  private loadDataId = 0;

  constructor(options: TileOptions) {
    super();
    const { x, y, z, tileSize, warp = true } = options;
    this.x = x;
    this.y = y;
    this.z = z;
    this.warp = warp || true;
    this.tileSize = tileSize;
  }

  // 是否正在请求瓦片
  public get isLoading() {
    return this.loadStatus === LoadTileDataStatus.Loading;
  }

  // 是否瓦片请求成功
  public get isLoaded() {
    return this.loadStatus === LoadTileDataStatus.Loaded;
  }

  // 是否瓦片请求失败
  public get isFailure() {
    return this.loadStatus === LoadTileDataStatus.Failure;
  }

  public setTileLayerLoaded() {
    this.isLayerLoaded = true;
  }

  // 是否瓦片请求被取消
  public get isCancelled() {
    return this.loadStatus === LoadTileDataStatus.Cancelled;
  }

  // 是否数据请求结束
  public get isDone() {
    return [
      LoadTileDataStatus.Loaded,
      LoadTileDataStatus.Cancelled,
      LoadTileDataStatus.Failure,
    ].includes(this.loadStatus);
  }

  // 瓦片的经纬度边界
  public get bounds() {
    return tileToBounds(this.x, this.y, this.z);
  }

  // 瓦片边界面
  public get bboxPolygon() {
    const [minLng, minLat, maxLng, maxLat] = this.bounds;
    const center = [(maxLng - minLng) / 2, (maxLat - minLat) / 2] as const;

    const polygon = bboxPolygon(this.bounds as TileBounds, {
      properties: {
        key: this.key,
        id: this.key,
        bbox: this.bounds,
        center,
        meta: `
      ${this.key}
      `,
        // ${this.bbox.slice(0, 2)}
        // ${this.bbox.slice(2)}
      },
    });
    return polygon;
  }

  // 瓦片的 key
  public get key() {
    const key = `${this.x}_${this.y}_${this.z}`;
    return key;
  }

  public layerLoad() {
    this.loadedLayers++;
    this.emit('layerLoaded');
  }
  // 请求瓦片数据
  public async loadData({ getData, onLoad, onError }: TileLoadDataOptions) {
    this.loadDataId++;
    const loadDataId = this.loadDataId;
    // 如果重复请求，执行最新请求
    if (this.isLoading) {
      this.abortLoad();
    }

    this.abortController = new AbortController();
    this.loadStatus = LoadTileDataStatus.Loading;

    let tileData = null;
    let error;
    try {
      const { x, y, z, bounds, tileSize, warp } = this;
      // wrap
      const { warpX, warpY } = getTileWarpXY(x, y, z, warp);
      const { signal } = this.abortController;
      const params = { x: warpX, y: warpY, z, bounds, tileSize, signal, warp };
      tileData = await getData(params, this);
    } catch (err) {
      error = err;
    }

    // 如果重复请求，请求序号不是最新的，丢弃旧的请求数据
    if (loadDataId !== this.loadDataId) {
      return;
    }

    // 如果请求被取消，返回数据为空时，不执行 onLoad 回调
    if (this.isCancelled && !tileData) {
      return;
    }

    // 如果请求出错或数据为空
    if (error || !tileData) {
      this.loadStatus = LoadTileDataStatus.Failure;
      onError(error as Error, this);
      return;
    }

    this.loadStatus = LoadTileDataStatus.Loaded;
    this.data = tileData;

    onLoad(this);
  }

  // 重新请求瓦片数据
  public reloadData(params: TileLoadDataOptions) {
    if (this.isLoading) {
      this.abortLoad();
    }
    this.loadData(params);
  }

  // 取消请求瓦片数据
  public abortLoad() {
    if (this.isLoaded || this.isCancelled) {
      return;
    }

    this.loadStatus = LoadTileDataStatus.Cancelled;
    this.abortController.abort();
    if (this.xhrCancel) {
      this.xhrCancel();
    }
  }
}
