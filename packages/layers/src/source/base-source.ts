import { SyncHook } from '@antv/async-hook';
import type {
  IClusterOptions,
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
import { Bounds } from './bounds';
import { ClusterManager } from './cluster-manager';
import { FeatureIndex } from './feature-index';
import type { ISourceStats } from './interface';
import type { ParserRegistry } from './parser-registry';
import { defaultRegistry } from './parser-registry';
import { TilesetAdapter } from './tileset-adapter';
const { mergeWith } = lodashUtil;

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
  // ─── 数据版本计数器（阶段 4.3a，纯叠加 infra）──────────────────
  // 单调递增 generation：每次「数据可能变化」操作 +1。bump 点：setData
  // （全量 reseat）、updateFeaturePropertiesById（原地属性变更）。不 bump：
  // updateClusterData（zoom 驱动聚合视图重算，originData 未变，属派生视图）、
  // 构造期首次 parse（generation 0 = 初始数据）。
  // 对 `new Source` / `Source.create` / `setData` / `updateFeaturePropertiesById`
  // 路径**零行为变化**（仅新增只读语义字段）。未来 4.3b 用本字段做「同 schema
  // skip re-parse」优化前先补 setData 调用链 + 副作用画像 + 对照 spec。
  public dataVersion: number = 0;
  // 生命周期钩子
  public hooks = {
    init: new SyncHook(),
  };
  public getSourceCfg() {
    return this.cfg;
  }
  // ─── 异步生命周期（阶段 4.1）────────────────────────────────────
  // `initPromise` 捕获构造期 `init().then(cb)` 的结果：cb 设 `inited=true` 并
  // emit `'update' {type:'inited'}`，与迁移前等价。`new Source` 路径不 await 本
  // 字段，故 init 失败仍 fire-and-forget（unhandled rejection，保留现状）。`Source.create`
  // async 工厂 / `ready` getter 通过 await 本字段消除 layers 侧 `source.data` race
  // （PLAN 诊断 #7）：成功时 `inited===true` 且 `data` 已 parse；失败时 reject 抛错
  // （显式 surface，对比旧路径吞错）。
  private readonly initPromise: Promise<void>;

  /**
   * init 完成 Promise：resolve 时 `inited===true` 且已 emit `'update' {type:'inited'}`；
   * init 失败时 reject（parse / cluster init / transform 错）。`new Source` 消费方可
   * `await source.ready` 消除 `source.data` race；`Source.create` 内部即 `await source.initPromise`。
   * 新增 API，对 `new Source` 路径零行为变化。
   */
  public get ready(): Promise<void> {
    return this.initPromise;
  }

  /**
   * async 工厂（阶段 4.1）：返回 init 完成的 Source 实例，消除 `source.data` race。
   *
   * 与 `new Source(data, cfg)` 区别：`create` await init（parse + cluster init +
   * transforms）后再返回，消费方直接读 `source.data` / `source.inited` 无 race；
   * init 失败时 reject 抛错（旧 `new Source` 路径 init 失败为 fire-and-forget
   * unhandled rejection，`inited` 留 false、`'update' {type:'inited'}` 不 emit）。
   *
   * `new Source(data, cfg)` 路径**零行为变化**（仍 fire-and-forget init + emit）；
   * 本阶段不加 `console.warn` deprecation（推迟 4.1b 切片，待 layers 迁移后再加）。
   *
   * 与阶段 2.5 `createSource(data, cfg, registry?)`（sync 函数工厂，仍 fire-and-forget
   * init）互补：`createSource` 是同步包装，`Source.create` 是异步等 init。
   *
   * @example
   *   const source = await Source.create(data, { parser: { type: 'geojson' } });
   *   console.log(source.data); // 已 parse，无 undefined race
   */
  public static async create(
    data: any | ISource,
    cfg?: ISourceCFG,
    registry: ParserRegistry = defaultRegistry,
  ): Promise<Source> {
    const source = new Source(data, cfg, registry);
    await source.initPromise;
    return source;
  }
  // ────────────────────────────────────────────────────────────────
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

  // ─── Feature 查询/更新（delegate，阶段 1.3）─────────────────────
  // getFeatureById / getFeatureId / updateFeaturePropertiesById +
  // dataArrayChanged 状态从 Source 搬到 FeatureIndex。delegate 通过
  // 构造期注入的 5 个 getter 闭包读取 Source 状态（parser / cluster /
  // originData / transforms / data），dataArrayChanged 自持。
  private readonly featureIndex: FeatureIndex;
  // ────────────────────────────────────────────────────────────────

  // ─── 数据范围 value object（阶段 1.4）───────────────────────────
  // extent / center / invalidExtent 三态从 Source 字段搬到 Bounds。
  // 对外通过 getter 透明转发：ISource.extent / .center 仍可读，
  // ClusterManager 的 getExtent / getInvalidExtent 闭包改读 bounds。
  // 状态由 `bounds.update(bbox)` 原子写入，Source 不再分散赋值。
  private readonly bounds: Bounds = new Bounds();

  /**
   * Parser/Transform 注册表（阶段 2.5）。
   *
   * 默认 `defaultRegistry` 单例（与迁移前等价）；经 `createSource(data, cfg,
   * registry)` 工厂或 `new Source(data, cfg, registry)` 构造器注入自定义
   * `new ParserRegistry()` 可隔离注册表，支持按需子集注册 / 测试隔离。
   * `executeParser` / `executeTrans` 与 `ClusterManager` 的 parser 调用均走本字段
   * 而非旧全局 `getParser` / `getTransform` 函数。
   */
  private readonly registry: ParserRegistry = defaultRegistry;

  public get extent(): BBox {
    return this.bounds.extent;
  }
  public get center(): [number, number] {
    return this.bounds.center;
  }
  public get invalidExtent(): boolean {
    return this.bounds.invalidExtent;
  }
  // ────────────────────────────────────────────────────────────────

  // 原始数据
  protected originData: any;
  protected rawData: any;
  private cfg: Partial<ISourceCFG> = {
    autoRender: true,
  };

  constructor(data: any | ISource, cfg?: ISourceCFG, registry: ParserRegistry = defaultRegistry) {
    super();
    this.registry = registry;
    // this.rawData = cloneDeep(data);
    this.originData = data;
    // delegate 必须先于 initCfg 创建：initCfg 会通过 setter 写 cluster 字段
    this.clusterManager = new ClusterManager(
      () => this.bounds.extent,
      () => this.bounds.invalidExtent,
      registry,
    );
    this.tilesetAdapter = new TilesetAdapter();
    this.featureIndex = new FeatureIndex(
      () => this.parser,
      () => this.cluster,
      () => this.originData,
      () => this.transforms,
      () => this.data,
    );
    this.initCfg(cfg);

    this.initPromise = this.init().then(() => {
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

  /**
   * 数据只读快照（阶段 6.4）。
   *
   * 暴露 rows / bbox / parserType / tileCount / isTile / cluster / dataVersion，
   * 便于调试与 size 监控。纯只读，不变 Source 状态，对 `new Source` /
   * `Source.create` / `setData` 路径**零行为变化**（minor-safe 新增 API）。
   *
   * - `rows` = `data.dataArray.length`（init 未完成时 `data` 可能为
   *   `undefined`，`?? 0` 兜底）；瓦片源此处为子瓦片解析结果条数。
   * - `tileCount` = `tileset.currentTiles.length`（瓦片随视口动态加载，
   *   未 `tileset.update` 时为 `0`）；非瓦片源为 `0`，配合 `isTile` 区分。
   * - `bbox` 直接返回 `extent`（未计算范围时为 `Bounds.extent` 初值
   *   `undefined`，与公开 getter `extent` 一致）。
   */
  public stats(): ISourceStats {
    return {
      rows: this.data?.dataArray?.length ?? 0,
      bbox: this.extent,
      parserType: (this.parser as IParserCfg).type || 'geojson',
      tileCount: this.tileset?.currentTiles.length ?? 0,
      isTile: this.isTile,
      cluster: this.cluster,
      dataVersion: this.dataVersion,
    };
  }

  public updateClusterData(zoom: number): void {
    this.data = this.clusterManager.updateData(zoom);
    this.executeTrans();
  }

  public getFeatureById(id: number): unknown {
    return this.featureIndex.getById(id);
  }

  public updateFeaturePropertiesById(id: number, properties: Record<string, any>) {
    this.featureIndex.updateProperties(id, properties);
    this.dataVersion++; // 阶段 4.3a：原地属性变更，bump generation
    this.emit('update', {
      type: 'update',
    });
  }

  public getFeatureId(field: string, value: any): number | undefined {
    return this.featureIndex.getIdByField(field, value);
  }

  public setData(data: any, options?: ISourceCFG) {
    this.originData = data;
    this.dataVersion++; // 阶段 4.3a：数据 reseat，bump generation
    this.featureIndex.reset();
    this.initCfg(options);

    // 阶段 4.3b：setData 失败 surfacing（strictly-better，零签名变化）。
    // 旧路径 `init().then(emit 'update')` 无 catch → re-parse/cluster/transform
    // 失败时 'update' 不 fire（事件消费方 hang）+ 未捕获 rejection（fire-and-
    // forget 吞错，同 4.2 为构造期 initPromise 修的 swallow/hang 模式）。现
    // `.catch` 后 emit `'error'`：eventemitter3 无 Node 'error' 抛错语义（无监
    // 听即静默，安全）。'update' 仍仅成功时 fire（契约不变）；失败由 'error'
    // surface。注：失败时 `dataVersion` 已 bump（reseat 已发生）、`this.data`
    // 为旧 parse 结果（stale）—— recovery 不在 4.3b 范围，见 BACKLOG。
    this.init()
      .then(() => {
        this.emit('update', {
          type: 'update',
        });
      })
      .catch((err) => {
        this.emit('error', err);
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
    const sourceParser = this.registry.getParser(type);
    this.data = sourceParser(this.originData, parser);
    // 为瓦片图层的父图层创建数据瓦片金字塔管理器
    this.tilesetAdapter.init(this.data);

    // 判断当前 source 是否需要计算范围
    if (parser.cancelExtent) {
      return;
    }

    // 计算范围（extent + center + invalidExtent 一次更新，阶段 1.4）
    this.bounds.update(extent(this.data.dataArray));
  }

  /**
   * 数据统计
   */
  private executeTrans() {
    const trans = this.transforms;
    trans.forEach((tran: ITransform) => {
      const { type } = tran;

      const data = this.registry.getTransform(type)(this.data, tran);
      Object.assign(this.data, data);
    });
  }
}
