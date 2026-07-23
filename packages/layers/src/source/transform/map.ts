import type { IParserData, ITransform } from '@antv/l7-core';
import type { IMapTransformCfg } from './types';

/**
 * 映射 transform（阶段 6.1 不可变化）。
 *
 * 返回 **新对象** `{ ...data, dataArray: data.dataArray.map(callback) }`，
 * 不再原地改 `data.dataArray`，利于缓存 / diff。`executeTrans` 的
 * `Object.assign(this.data, data)` 对新对象等价（详见 `filter.ts` 分析）。
 *
 * 无 `callback` 时为 no-op，原样返回 `data`（不复制，零行为变化）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 6.1
 */
export function map(data: IParserData, options: ITransform) {
  const { callback } = options as IMapTransformCfg;
  if (!callback) {
    return data;
  }
  return { ...data, dataArray: data.dataArray.map(callback) };
}
