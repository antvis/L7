import type { IParserData, ITransform } from '@antv/l7-core';
import type { IFilterTransformCfg } from './types';

/**
 * 过滤 transform（阶段 6.1 不可变化）。
 *
 * 返回 **新对象** `{ ...data, dataArray: data.dataArray.filter(callback) }`，
 * 不再原地改 `data.dataArray`，利于缓存 / diff。`base-source.executeTrans` 的
 * `Object.assign(this.data, data)` 对新对象仍等价：`{...A, dataArray}` 的各字段
 * 经 `Object.assign` 回写 `this.data`（= A）后，`A.dataArray` 被覆盖为过滤后数组、
 * 其余字段值不变（`{...A}` 的拷贝值与 `A[p]` 全等），最终态与原地改一致。
 *
 * 无 `callback` 时为 no-op，原样返回 `data`（不复制，零行为变化）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 6.1
 */
export function filter(data: IParserData, options: ITransform) {
  const { callback } = options as IFilterTransformCfg;
  if (!callback) {
    return data;
  }
  return { ...data, dataArray: data.dataArray.filter(callback) };
}
