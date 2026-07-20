import type { IClusterOptions, IParserData } from '@antv/l7-core';
import { bBoxToBounds, lodashUtil, padBounds } from '@antv/l7-utils';
import type { BBox } from '@turf/helpers';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import type Supercluster from 'supercluster/dist/supercluster';
import { getParser } from './factory';
import { cluster } from './transform/cluster';
import { statMap } from './utils/statistics';
import { getColumn } from './utils/util';

const { isFunction, isString } = lodashUtil;

/**
 * Cluster 状态机 delegate（阶段 1.1）。
 *
 * 从 `base-source.ts` 抽出的聚合计算职责 —— 封装 Supercluster 索引、聚合配置、
 * 按当前 zoom 重算聚合数据。`Source` 通过 getter/setter 与方法转发对外保持
 * `ISource.cluster` / `clusterOptions` / `getClusters` / `getClustersLeaves` /
 * `updateClusterData` 完全等价。
 *
 * extent / invalidExtent 不归属本 delegate（留待阶段 1.4 抽 Bounds value object），
 * 通过构造期注入的 getter 闭包从 `Source` 读取，保证每次取到最新值（索引在
 * executeParser 之后才建，extent 也在那时才确定）。
 *
 * 行为兼容：未启用（`enabled = false`）时 `init()` 不创建索引，`index` 保持
 * `null`，与迁移前 `initCluster` 早返回、后续 `getClusters`/`updateClusterData`
 * 在 null 上抛 TypeError 的语义一致（不新增额外 guard，避免改变错误时机）。
 */
export class ClusterManager {
  /** 是否启用聚合（对应 ISource.cluster） */
  public enabled: boolean = false;

  /** 聚合配置（对应 ISource.clusterOptions，含运行时 zoom 字段） */
  public options: Partial<IClusterOptions> = {
    enable: false,
    radius: 40,
    maxZoom: 20,
    zoom: -99,
    method: 'count',
  };

  /** Supercluster 索引；仅在 `init()` 成功后非空 */
  private index: Supercluster | null = null;

  constructor(
    /** 读取当前数据范围（执行 executeParser 之后才有效） */
    private readonly getExtent: () => BBox,
    /** 读取范围是否失效（单点 / 退化数据） */
    private readonly getInvalidExtent: () => boolean,
  ) {}

  /**
   * 构建聚合索引。对应原 `Source.initCluster`：
   * 未启用时早返回，保留 `index = null` 语义。
   */
  public init(data: IParserData): void {
    if (!this.enabled) {
      return;
    }
    const options = this.options || {};
    this.index = cluster(data, options);
  }

  /**
   * 按当前 zoom 重新计算聚合数据。
   *
   * 对应原 `Source.updateClusterData` 主体逻辑，但不直接回写 `Source.data`，
   * 而是把组装好的 `IParserData` 返回，由 `Source` 转发方法负责赋值并触发
   * `executeTrans()`，保持 ClusterManager 与 transform 链解耦。
   */
  public updateData(zoom: number): IParserData {
    const { method = 'sum', field } = this.options;
    let data = this.index.getClusters(this.calcExtent(2), Math.floor(zoom));
    this.options.zoom = zoom;
    data.forEach((p: any) => {
      if (!p.id) {
        p.properties.point_count = 1;
      }
    });
    if (field || isFunction(method)) {
      data = data.map((item: any) => {
        const id = item.id as number;
        if (id) {
          const points = this.index.getLeaves(id, Infinity);
          const properties = points.map((d: any) => d.properties);
          let statNum;
          if (isString(method) && field) {
            const column = getColumn(properties, field);
            statNum = statMap[method](column);
          }
          if (isFunction(method)) {
            statNum = method(properties);
          }
          item.properties.stat = statNum;
        } else {
          item.properties.point_count = 1;
        }
        return item;
      });
    }
    return getParser('geojson')({
      type: 'FeatureCollection',
      features: data,
    });
  }

  /** 获取指定 zoom 下的聚合点（对应原 `Source.getClusters`） */
  public getClusters(zoom: number): any {
    return this.index.getClusters(this.calcExtent(2), zoom);
  }

  /** 获取聚合点的叶子成员（对应原 `Source.getClustersLeaves`） */
  public getClustersLeaves(id: number): any {
    return this.index.getLeaves(id, Infinity);
  }

  /** 释放索引（对应原 `Source.destroy` 中的 `this.clusterIndex = null`） */
  public destroy(): void {
    this.index = null;
  }

  /**
   * 计算聚合查询范围（对应原 `Source.calcClusterExtent`）。
   * extent 失效时不做 padding，返回全球范围。
   */
  private calcExtent(bufferRatio: number): any {
    let newBounds = [
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ];

    if (!this.getInvalidExtent()) {
      newBounds = padBounds(bBoxToBounds(this.getExtent()), bufferRatio);
    }
    return newBounds[0].concat(newBounds[1]);
  }
}
