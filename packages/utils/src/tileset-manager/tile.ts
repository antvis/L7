import { tileToBoundingBox } from './utils/lonlat-tile';

type TileOptions = { x: number; y: number; z: number; tileSize: number };

type LoadTileDataOptions = {
  getData: (tile: Tile) => Promise<any>;
  onLoad: (tile: Tile) => void;
  onError: (error: Error, tile: Tile) => void;
};

enum LoadTileDataStatus {
  Loading = 'Loading',
  Loaded = 'Loaded',
  Cancelled = 'Cancelled',
}

/**
 * 单个瓦片
 * 负责瓦片数据加载、缓存数据、缓存图层
 */
export class Tile {
  // 瓦片索引
  public x: number;
  public y: number;
  public z: number;
  // 瓦片大小
  public tileSize = 256;
  // 是否可以见
  public isVisible = false;
  // 是否是当前层级的瓦片
  public isCurrent = false;
  // 瓦片挂载的图层
  public layer: any = null;
  // 瓦片挂载的图层组
  public layers = [];
  // 瓦片的父级瓦片
  public parent: Tile | null = null;
  // 瓦片的子级瓦片
  public children: Tile[] = [];
  // 瓦片数据
  public data: any = null;
  // 瓦片属性
  public properties: Record<string, any> = {};
  // 瓦片请求状态
  private loadStatus: LoadTileDataStatus;
  // 是否需要重新请求瓦片
  // private needsReload = false;
  // 瓦片数据 Web 请求控制器
  private abortController: AbortController;
  // 瓦片序号
  private loadDataId = 0;

  constructor(options: TileOptions) {
    const { x, y, z, tileSize } = options;
    this.x = x;
    this.y = y;
    this.z = z;
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

  // 是否瓦片请求被取消
  public get isCancelled() {
    return this.loadStatus === LoadTileDataStatus.Cancelled;
  }

  // 瓦片的经纬度边界
  public get bbox() {
    return tileToBoundingBox(this.x, this.y, this.z);
  }

  // 瓦片的 key
  public get key() {
    const key = `${this.x},${this.y},${this.z}`;
    return key;
  }

  // 瓦片数据 Web 请求控制器实例
  public get signal() {
    return this.abortController?.signal;
  }

  // 请求瓦片数据
  public async loadData({ getData, onLoad, onError }: LoadTileDataOptions) {
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
      tileData = await getData(this);
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

    this.loadStatus = LoadTileDataStatus.Loaded;
    this.data = tileData;

    // reloadData 加载场景，加载成功与失败都清空挂载的图层
    this.layer = null;
    this.layers = [];

    if (error) {
      onError(error, this);
    } else {
      onLoad(this);
    }
  }

  // 重新请求瓦片数据
  public reloadData() {
    if (this.isLoading) {
      this.abortLoad();
    }
    // this.loadData();
  }

  // 取消请求瓦片数据
  public abortLoad() {
    if (this.isLoaded || this.isCancelled) {
      return;
    }

    this.loadStatus = LoadTileDataStatus.Cancelled;
    this.abortController.abort();
  }
}
