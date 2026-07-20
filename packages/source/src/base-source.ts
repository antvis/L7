import { SyncHook } from '@antv/async-hook';
import type {
  IClusterOptions,
  IParseDataItem,
  IParserCfg,
  IParserData,
  ISource,
  ISourceCFG,
  ITileParserCFG,
  ITransform,
} from '@antv/l7-core';
import type { SourceTile, TilesetManager } from '@antv/l7-utils';
import { extent, lodashUtil } from '@antv/l7-utils';
import type { BBox } from '@turf/helpers';
import { EventEmitter } from 'eventemitter3';
import { ClusterManager } from './cluster-manager';
import { getParser, getTransform } from './factory';
import { TilesetAdapter } from './tileset-adapter';
const { cloneDeep, mergeWith } = lodashUtil;

function mergeCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}
//
export default class Source extends EventEmitter implements ISource {
  public type: string = 'source';
  public inited: boolean = false;
  public data: IParserData;
  public center: [number, number];
  // 数据范围
  public extent: BBox;
  // 生命周期钩子
  public hooks = {
    init: new SyncHook(),
  };
  public getSourceCfg() {
    return this.cfg;
  }
  public parser: IParserCfg | ITileParserCFG = { type: 'geojson' };
  public transforms: ITransform[] = [];

  // ─── Cluster 状态机（delegate，阶段 1.1）─────────────────────────
  // cluster: boolean、clusterOptions、Supercluster 索引从 Source 类搬到
  // ClusterManager。对外通过 accessor 透明转发，满足 ISource 字段契约，
  // 行为与迁移前完全等价。
  private readonly clusterManager: ClusterManager;

  public get cluster(): boolean {
    return this.clusterManager.enabled;
  }
  public set cluster(value: boolean) {
    this.clusterManager.enabled = value;
  }
  public get clusterOptions(): Partial<IClusterOptions> {
    return this.clusterManager.options;
  }
  public set clusterOptions(value: Partial<IClusterOptions>) {
    this.clusterManager.options = value;
  }
  // ────────────────────────────────────────────────────────────────

  // 瓦片数据管理器
  // ─── 瓦片管理器（delegate，阶段 1.2）────────────────────────────
  // tileset / isTile 从 Source 字段搬到 TilesetAdapter。对外通过 getter
  // 透明转发：layers 包 `source.tileset as TilesetManager` 仍拿到同一个
  // TilesetManager 实例（adapter.manager），行为与迁移前完全等价。
  private readonly tilesetAdapter: TilesetAdapter;

  public get tileset(): TilesetManager | undefined {
    return this.tilesetAdapter.manager;
  }
  public get isTile(): boolean {
    return this.tilesetAdapter.isTile;
  }
  // ────────────────────────────────────────────────────────────────

  // 是否有效范围
  private invalidExtent: boolean = false;

  private dataArrayChanged: boolean = false;

  // 原始数据
  protected originData: any;
  protected rawData: any;
  private cfg: Partial<ISourceCFG> = {
    autoRender: true,
  };

  constructor(data: any | ISource, cfg?: ISourceCFG) {
    super();
    // this.rawData = cloneDeep(data);
    this.originData = data;
    // delegate 必须先于 initCfg 创建：initCfg 会通过 setter 写 cluster 字段
    this.clusterManager = new ClusterManager(
      () => this.extent,
      () => this.invalidExtent,
    );
    this.tilesetAdapter = new TilesetAdapter();
    this.initCfg(cfg);

    this.init().then(() => {
      this.inited = true;
      this.emit('update', {
        type: 'inited',
      });
    });
  }

  public getClusters(zoom: number): any {
    return this.clusterManager.getClusters(zoom);
  }

  public getClustersLeaves(id: number): any {
    return this.clusterManager.getClustersLeaves(id);
  }

  public getParserType() {
    return this.parser.type;
  }

  public updateClusterData(zoom: number): void {
    this.data = this.clusterManager.updateData(zoom);
    this.executeTrans();
  }

  public getFeatureById(id: number): unknown {
    const { type = 'geojson', geometry } = this.parser as IParserCfg;
    if (type === 'geojson' && !this.cluster) {
      const feature = id < this.originData.features.length ? this.originData.features[id] : 'null';
      const newFeature = cloneDeep(feature);

      if (newFeature?.properties && (this.transforms.length !== 0 || this.dataArrayChanged)) {
        // 如果数据进行了transforms 属性会发生改变 或者数据dataArray发生更新
        const item = this.data.dataArray.find((dataItem: IParseDataItem) => {
          return dataItem._id === id;
        });
        newFeature.properties = item;
      }
      return newFeature;
    } else if (type === 'json' && geometry) {
      return this.data.dataArray.find((dataItem) => dataItem._id === id);
    } else {
      return id < this.data.dataArray.length ? this.data.dataArray[id] : 'null';
    }
  }

  public updateFeaturePropertiesById(id: number, properties: Record<string, any>) {
    this.data.dataArray = this.data.dataArray.map((dataItem: IParseDataItem) => {
      if (dataItem._id === id) {
        return {
          ...dataItem,
          ...properties,
        };
      }
      return dataItem;
    });
    this.dataArrayChanged = true;
    this.emit('update', {
      type: 'update',
    });
  }

  public getFeatureId(field: string, value: any): number | undefined {
    const feature = this.data.dataArray.find((dataItem: IParseDataItem) => {
      return dataItem[field] === value;
    });
    return feature?._id;
  }

  public setData(data: any, options?: ISourceCFG) {
    this.originData = data;
    this.dataArrayChanged = false;
    this.initCfg(options);

    this.init().then(() => {
      this.emit('update', {
        type: 'update',
      });
    });
  }

  public reloadAllTile() {
    this.tilesetAdapter.reloadAllTile();
  }

  public reloadTilebyId(z: number, x: number, y: number): void {
    this.tilesetAdapter.reloadTilebyId(z, x, y);
  }

  public reloadTileByLnglat(lng: number, lat: number, z: number): void {
    this.tilesetAdapter.reloadTileByLnglat(lng, lat, z);
  }

  public getTileExtent(
    e: [number, number, number, number],
    zoom: number,
  ): Array<{ x: number; y: number; z: number }> | undefined {
    return this.tilesetAdapter.getTileExtent(e, zoom);
  }

  public getTileByZXY(z: number, x: number, y: number): SourceTile | undefined {
    return this.tilesetAdapter.getTileByZXY(z, x, y);
  }

  public reloadTileByExtent(bounds: [number, number, number, number], z: number): void {
    this.tilesetAdapter.reloadTileByExtent(bounds, z);
  }

  public destroy() {
    this.removeAllListeners();
    this.originData = null;
    this.clusterManager.destroy();
    this.tilesetAdapter.destroy();
    // @ts-ignore
    this.data = null;
  }

  private async processData() {
    return new Promise((resolve, reject) => {
      try {
        this.executeParser();
        this.clusterManager.init(this.data);
        this.executeTrans();
        resolve({});
      } catch (err) {
        reject(err);
      }
    });
  }

  private initCfg(option?: ISourceCFG) {
    if (option) {
      this.cfg = mergeWith(this.cfg, option, mergeCustomizer);
    }
    const cfg = this.cfg;
    if (cfg) {
      if (cfg.parser) {
        this.parser = cfg.parser;
      }
      if (cfg.transforms) {
        this.transforms = cfg.transforms;
      }
      this.cluster = cfg.cluster || false;
      if (cfg.clusterOptions) {
        this.cluster = true;
        this.clusterOptions = {
          ...this.clusterOptions,
          ...cfg.clusterOptions,
        };
      }
    }
  }

  private async init() {
    this.inited = false;
    await this.processData();
    this.inited = true;
  }

  /**
   * 数据解析
   */
  private executeParser(): void {
    // 耗时计算测试
    const parser = this.parser as IParserCfg;
    const type: string = parser.type || 'geojson';
    const sourceParser = getParser(type);
    this.data = sourceParser(this.originData, parser);
    // 为瓦片图层的父图层创建数据瓦片金字塔管理器
    this.tilesetAdapter.init(this.data);

    // 判断当前 source 是否需要计算范围
    if (parser.cancelExtent) {
      return;
    }

    // 计算范围
    this.extent = extent(this.data.dataArray);
    this.setCenter(this.extent);
    this.invalidExtent = this.extent[0] === this.extent[2] || this.extent[1] === this.extent[3];
  }

  private setCenter(bbox: BBox) {
    this.center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
    if (isNaN(this.center[0]) || isNaN(this.center[1])) {
      // this.center = [NaN, NaN] // Infinity - Infinity = NaN
      // 默认设置为大地原点
      this.center = [108.92361111111111, 34.54083333333333];
    }
  }

  /**
   * 数据统计
   */
  private executeTrans() {
    const trans = this.transforms;
    trans.forEach((tran: ITransform) => {
      const { type } = tran;

      const data = getTransform(type)(this.data, tran);
      Object.assign(this.data, data);
    });
  }
}
