import type { IParseDataItem, IParserData, ITransform } from '@antv/l7-core';
import type { IJoinTransformCfg } from './types';

/**
 * 按字段将外部属性数据 join 到当前数据
 * options: { sourceField, targetField, data }
 */
export function join(geoData: IParserData, options: ITransform) {
  const { sourceField, targetField, data } = options as unknown as IJoinTransformCfg;
  const dataObj: { [key: string]: any } = {};
  data.forEach((element: { [key: string]: any }) => {
    // 属性数据
    dataObj[element[sourceField]] = element;
  });
  geoData.dataArray = geoData.dataArray.map((item: IParseDataItem) => {
    const joinName = item[targetField];
    return {
      ...item,
      ...dataObj[joinName],
    };
  });
  return geoData;
}
