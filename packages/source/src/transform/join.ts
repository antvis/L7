import type { IParseDataItem, IParserData, ITransform } from '@antv/l7-core';
import type { IJoinTransformCfg } from './types';

/**
 * 按字段将外部属性数据 join 到当前数据（阶段 6.1 不可变化）。
 *
 * options: { sourceField, targetField, data }
 *
 * 返回 **新对象** `{ ...geoData, dataArray: ... }`，不再原地改
 * `geoData.dataArray`，利于缓存 / diff。`executeTrans` 的
 * `Object.assign(this.data, data)` 对新对象等价（详见 `filter.ts` 分析）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 6.1
 */
export function join(geoData: IParserData, options: ITransform) {
  const { sourceField, targetField, data } = options as unknown as IJoinTransformCfg;
  const dataObj: { [key: string]: any } = {};
  data.forEach((element: { [key: string]: any }) => {
    // 属性数据
    dataObj[element[sourceField]] = element;
  });
  return {
    ...geoData,
    dataArray: geoData.dataArray.map((item: IParseDataItem) => {
      const joinName = item[targetField];
      return {
        ...item,
        ...dataObj[joinName],
      };
    }),
  };
}
