// @ts-ignore
import {
  IJsonData,
  IJsonItem,
  IParseDataItem,
  IParserCfg,
  IParserData,
} from '@antv/l7-core';
// @ts-ignore
import rewind from '@mapbox/geojson-rewind';
export default function json(data: IJsonData, cfg: IParserCfg): IParserData {
  const { x, y, x1, y1, coordinates } = cfg;
  const resultData: IParseDataItem[] = [];
  data.forEach((col: IJsonItem, featureIndex: number) => {
    let coords = [];
    if (x && y) {
      coords = [parseFloat(col[x]), parseFloat(col[y])];
    } // 点数据
    if (x && y && x1 && y1) {
      // 弧线 或者线段
      // const prevLng = col[x];
      // let lng = col[x1];
      // lng += lng - prevLng > 180 ? -360 : 
      //  prevLng - lng > 180 ? 360 : 0;
      coords = [
        [parseFloat(col[x]), parseFloat(col[y])],
        [parseFloat(col[x1]), parseFloat(col[y1])],
      ];
    }
    if (coordinates) {
      let type = 'Polygon';
      if (!Array.isArray(coordinates[0])) {
        type = 'Point';
      }
      if (Array.isArray(coordinates[0]) && !Array.isArray(coordinates[0][0])) {
        type = 'LineString';
      }
      const geometry = {
        type,
        coordinates: [...col[coordinates]],
      };
      rewind(geometry, true);
      coords = geometry.coordinates;
    }
    const dataItem = {
      ...col,
      _id: featureIndex,
      coordinates: coords,
    };
    resultData.push(dataItem);
  });
  return {
    dataArray: resultData,
  };
}
