// @ts-ignore
import type { IJsonData, IParseDataItem, IParserCfg, IParserData } from '@antv/l7-core';
// @ts-ignore
import type { Feature, Geometries, Properties } from '@turf/helpers';
import { getCoords } from '@turf/invariant';
import { flattenEach } from '@turf/meta';
import { geojsonRewind } from '../utils/util';

export default function json(data: IJsonData, cfg: IParserCfg): IParserData {
  const { x, y, x1, y1, coordinates, geometry } = cfg;
  const resultData: IParseDataItem[] = [];

  if (!Array.isArray(data)) {
    return {
      dataArray: [],
    };
  }

  // GeoJson geometry 数据
  if (geometry) {
    data
      .filter((item: Record<string, any>) => {
        return (
          item[geometry] &&
          item[geometry].type &&
          item[geometry].coordinates &&
          item[geometry].coordinates.length > 0
        );
      })
      .forEach((col, index) => {
        const rewindGeometry = geojsonRewind(col[geometry]);
        // multi feature 情况拆分
        flattenEach(rewindGeometry, (currentFeature: Feature<Geometries, Properties>) => {
          const coord = getCoords(currentFeature);
          const dataItem = {
            ...col,
            _id: index,
            coordinates: coord,
          };

          resultData.push(dataItem);
        });
      });

    return {
      dataArray: resultData,
    };
  }

  for (let featureIndex = 0; featureIndex < data.length; featureIndex++) {
    const col = data[featureIndex];
    let coords = [];

    // GeoJson coordinates 数据
    // 仅支持 Point LineString Polygon 三种 coordinates
    if (coordinates) {
      let type: 'Point' | 'LineString' | 'Polygon' = 'Polygon';
      if (!Array.isArray(coordinates[0])) {
        type = 'Point';
      }
      if (Array.isArray(coordinates[0]) && !Array.isArray(coordinates[0][0])) {
        type = 'LineString';
      }
      const rewindGeometry = geojsonRewind({
        type,
        coordinates: col[coordinates as string],
      });
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
