import { IParseDataItem, IParserData } from '@antv/l7-core';

interface IJoinOption {
  field: 'string';
  data: any[];
}

/**
 *
 * @param data
 * @param options
 */
export function join(geoData: IParserData, options: { [key: string]: any }) {
  const { field, data } = options;
  const dataObj: { [key: string]: any } = {};
  data.forEach((element: { [key: string]: any }) => {
    dataObj[element.field] = element;
  });
  geoData.dataArray = data.dataArray.map((item: IParseDataItem) => {
    const joinName = item[field];
    return {
      ...dataObj[joinName],
      ...item,
    };
  });

  return data;
}
