import type {
  IParseDataItem,
  IParserCfg,
  IParserData,
  ITileParserCFG,
  ITransform,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';

const { cloneDeep } = lodashUtil;

/**
 * Feature 查询/更新 delegate（阶段 1.3）。
 *
 * 从 `base-source.ts` 抽出的 feature 索引职责 —— 封装
 * `getFeatureById` / `getFeatureId` / `updateFeaturePropertiesById`
 * + `dataArrayChanged` 状态。`Source` 通过方法转发对外保持 `ISource`
 * 三个方法完全等价。
 *
 * 与 `ClusterManager` 一样采用「构造期注入 getter 闭包」模式，不持有
 * `Source` 全部状态，避免循环引用。`getFeatureById` 依赖的 5 处 Source
 * 状态（parser / cluster / originData / transforms / data）通过闭包
 * 延迟读取，每次调用拿到最新值（originData 在 setData 后变化、data 在
 * executeParser 后重建，闭包语义与原字段直读一致）。
 *
 * 设计取舍：
 * - `emit('update')` 留在 `Source.updateFeaturePropertiesById` 转发端，
 *   delegate 不持有 EventEmitter，保持职责单一
 * - `dataArrayChanged` 由 delegate 自持；`Source.setData` 重置时调
 *   `reset()`，`getFeatureById` 内部读 delegate 自己的字段
 */
export class FeatureIndex {
  /** 数据数组是否被 `updateFeaturePropertiesById` 增量改过 */
  private dataArrayChanged: boolean = false;

  constructor(
    /** 读取当前 parser 配置（用于取 type / geometry） */
    private readonly getParser: () => IParserCfg | ITileParserCFG,
    /** 读取是否启用聚合（getFeatureById 在 cluster 模式下走 fallback 分支） */
    private readonly isClusterEnabled: () => boolean,
    /** 读取原始数据（cluster=false 且 type=geojson 时按 id 取 feature） */
    private readonly getOriginData: () => any,
    /** 读取 transforms（决定 getFeatureById 是否需要回查 dataArray 替换 properties） */
    private readonly getTransforms: () => ITransform[],
    /** 读取解析后的 IParserData（dataArray 是主要查询源） */
    private readonly getData: () => IParserData,
  ) {}

  /**
   * 按 id 取 feature（对应原 `Source.getFeatureById`）。
   *
   * 三分支语义：
   * - `geojson` 且未聚合：从 originData.features 取原始 feature，cloneDeep
   *   后按「有 transforms 或 dataArray 改过」决定是否用 dataArray 的
   *   _id 匹配项替换 properties（因 transforms 会改属性）
   * - `json` 且 cfg.geometry：在 dataArray 中按 _id 查
   * - 其它（含 cluster 模式）：按 id 索引 dataArray
   */
  public getById(id: number): unknown {
    const { type = 'geojson', geometry } = this.getParser() as IParserCfg;
    if (type === 'geojson' && !this.isClusterEnabled()) {
      const originData = this.getOriginData();
      const feature = id < originData.features.length ? originData.features[id] : 'null';
      const newFeature = cloneDeep(feature);

      if (newFeature?.properties && (this.getTransforms().length !== 0 || this.dataArrayChanged)) {
        // 如果数据进行了 transforms 属性会发生改变，或者数据 dataArray 发生更新
        const item = this.getData().dataArray.find((dataItem: IParseDataItem) => {
          return dataItem._id === id;
        });
        newFeature.properties = item;
      }
      return newFeature;
    } else if (type === 'json' && geometry) {
      return this.getData().dataArray.find((dataItem) => dataItem._id === id);
    } else {
      const { dataArray } = this.getData();
      return id < dataArray.length ? dataArray[id] : 'null';
    }
  }

  /**
   * 增量更新指定 id feature 的 properties（对应原
   * `Source.updateFeaturePropertiesById` 主体，不含 emit）。
   *
   * 返回后由 `Source` 转发端负责 `emit('update', { type: 'update' })`，
   * delegate 不持有 EventEmitter。
   */
  public updateProperties(id: number, properties: Record<string, any>): void {
    const data = this.getData();
    data.dataArray = data.dataArray.map((dataItem: IParseDataItem) => {
      if (dataItem._id === id) {
        return {
          ...dataItem,
          ...properties,
        };
      }
      return dataItem;
    });
    this.dataArrayChanged = true;
  }

  /** 按 field=value 反查 _id（对应原 `Source.getFeatureId`） */
  public getIdByField(field: string, value: any): number | undefined {
    const feature = this.getData().dataArray.find((dataItem: IParseDataItem) => {
      return dataItem[field] === value;
    });
    return feature?._id;
  }

  /** 重置增量变更标记（对应原 `Source.setData` 中的 `this.dataArrayChanged = false`） */
  public reset(): void {
    this.dataArrayChanged = false;
  }
}
