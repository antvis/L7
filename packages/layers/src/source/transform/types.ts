/**
 * Transform 严格配置接口（阶段 0.3）
 *
 * 现状：所有 transform 的 cfg 在 ITransform 下是 `[key: string]: any`，
 * 调用方与实现方都无类型推导。此处为每个内置 transform 定义严格 cfg，
 * 供 transform 实现内部 narrow 使用（`const cfg = option as IGridTransformCfg`）。
 *
 * 渐进策略：
 * - ITransform 的 index signature 保留（过渡兼容外部调用）
 * - 各 transform 函数签名仍接受 ITransform，内部用本文件类型断言
 * - 阶段 2 注册机制现代化后再让签名直接用具体 cfg
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 0.3
 */

import type { IParseDataItem } from '@antv/l7-core';

/** Satistics.statMap 支持的统计方法名（min/max/mean/sum/mode/count） */
export type StatMethod = 'min' | 'max' | 'mean' | 'sum' | 'mode' | 'count';

export interface IFilterTransformCfg {
  /** 过滤谓词，返回 true 保留 */
  callback?: (item: IParseDataItem) => boolean;
}

export interface IMapTransformCfg {
  /** 映射函数，返回新的 dataItem */
  callback?: (item: IParseDataItem, index?: number, array?: IParseDataItem[]) => IParseDataItem;
}

export interface IJoinTransformCfg {
  /** 关联数据中用于匹配的字段 */
  sourceField: string;
  /** 当前数据中用于匹配的字段 */
  targetField: string;
  /** 待关联进来的属性数据 */
  data: Record<string, unknown>[];
}

/** 网格聚合 transform 公共配置（grid / hexagon 共用） */
export interface IAggregatorTransformCfg {
  /** 网格大小（米） */
  size?: number;
  /** 聚合方法，对应 Satistics.statMap 的 key */
  method?: StatMethod;
  /** 聚合字段名 */
  field?: string;
}

export type IGridTransformCfg = IAggregatorTransformCfg;
export type IHexagonTransformCfg = IAggregatorTransformCfg;
