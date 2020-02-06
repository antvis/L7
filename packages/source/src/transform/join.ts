import { IParseDataItem, IParserData } from '@antv/l7-core';

interface IJoinOption {
  sourceField: string;
  targetField: string;
  data: any[];
}

/**
 *
 * @param data
 * @param options
 */
export function join(geoData: IParserData, options: IJoinOption) {
  const { sourceField, targetField, data } = options;
  const dataObj: { [key: string]: any } = {};
  data.forEach((element: { [key: string]: any }) => {
    dataObj[element[sourceField]] = element;
  });
  geoData.dataArray = geoData.dataArray.map((item: IParseDataItem) => {
    const joinName = item[targetField];
    return {
      ...dataObj[joinName],
      ...item,
    };
  });

  return geoData;
}
