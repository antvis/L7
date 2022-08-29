// @ts-ignore
import rewind from '@mapbox/geojson-rewind';
import {
  IJsonData,
  IParseDataItem,
  IParserCfg,
  IParserData,
} from '@antv/l7-core';
import { flattenEach } from '@turf/meta';
import { getCoords } from '@turf/invariant';
import { Feature, Geometries, Properties } from '@turf/helpers';

export default function json(data: IJsonData, cfg: IParserCfg): IParserData {
  const { x, y, x1, y1, coordinates, geometry } = cfg;
  const resultData: IParseDataItem[] = [];

  if (!Array.isArray(data)) {
    return {
      dataArray: [],
    };
  }

  for (let featureIndex = 0; featureIndex < data.length; featureIndex++) {
    const col = data[featureIndex];

    // GeoJson geometry 数据
    if (geometry) {
      const _geometry = { ...col[geometry] };
      const rewindGeometry = rewind(_geometry, true);
      // multi feature 情况拆分
      flattenEach(
        rewindGeometry,
        (currentFeature: Feature<Geometries, Properties>) => {
          const coord = getCoords(currentFeature);
          const dataItem = {
            ...col,
            _id: featureIndex,
            coordinates: coord,
          };

          resultData.push(dataItem);
        },
      );
      continue;
    }

    let coords = [];

    // GeoJson coordinates 数据
    // 仅支持 Point LineString Polygon 三种 coordinates
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
  }

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
