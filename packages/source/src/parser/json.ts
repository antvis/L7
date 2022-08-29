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
  const { x, y, x1, y1, coordinates, geometry } = cfg;
  const resultData: IParseDataItem[] = [];
  if (!Array.isArray(data)) {
    return {
      dataArray: [],
    };
  }
  data.forEach((col: IJsonItem, featureIndex: number) => {
    let coords = [];

    if (geometry) {
      // GeoJson geometry 数据
      const rewindGeometry = rewind({ ...col[geometry] }, true);
      coords = rewindGeometry.coordinates;
    } else if (coordinates) {
      // GeoJson coordinates 数据
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
      const rewindGeometry = rewind(geometry, true);
      coords = rewindGeometry.coordinates;
    } else if (x && y && x1 && y1) {
      // 起终点数据
      const from = [parseFloat(col[x]), parseFloat(col[y])];
      const to = [parseFloat(col[x1]), parseFloat(col[y1])];
      coords = [from, to];
    } else if (x && y) {
      // 点数据
      coords = [parseFloat(col[x]), parseFloat(col[y])];
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

export const defaultSource = {
  PointLayer: {
    data: [],
    options: {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    },
  },
  LineLayer: {
    data: [
      {
        lng1: 100,
        lat1: 30.0,
        lng2: 130,
        lat2: 30,
      },
    ],
    options: {
      parser: {
        type: 'json',
        x: 'lng1',
        y: 'lat1',
        x1: 'lng2',
        y1: 'lat2',
      },
    },
  },
};

// TODO: 提供默认数据和解析器
export const defaultData = [
  {
    lng1: 100,
    lat1: 30.0,
    lng2: 130,
    lat2: 30,
  },
];

export const defaultParser = {
  parser: {
    type: 'json',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
};
