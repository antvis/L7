import {
  RequestParameters,
  SourceTile,
  TileLoadParams,
  getData,
  getURLFromTemplate,
} from '@antv/l7-utils';
import {
  Feature,
} from '@turf/helpers';
import { IParserData, ITileSource } from '../interface';
import VtSource from '../source/geojsonvt';

import { ITileParserCFG } from '@antv/l7-core';

export type MapboxVectorTile = {
  layers: { [key: string]: { features: Feature[] } };
};

const getVectorTile = async (
  url: string,
  tile: SourceTile,
  requestParameters?: Partial<RequestParameters>,
  getCustomData?: ITileParserCFG['getCustomData'],
): Promise<ITileSource> => {
  const tileUrl = getURLFromTemplate(url, { x: tile.x, y: tile.y, z: tile.z });
  return new Promise((resolve) => {
    if (getCustomData) {
      getCustomData(
        {
          x: tile.x,
          y: tile.y,
          z: tile.z,
        },
        (err, data) => {
          if (err || !data) {
            const vectorTile: MapboxVectorTile = {
              layers: {
                defaultLayer: {
                  features: [],
                },
              },
            };
            const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
            resolve(vectorSource);
          } else {
            const vectorTile: MapboxVectorTile = {
              layers: {
                defaultLayer: {
                  features: data.features,
                },
              },
            };
            const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
            resolve(vectorSource);
          }
        },
      );
    } else {
      getData(
        {
          ...requestParameters,
          url: tileUrl,
        },
        (err, data) => {
          if (err || !data) {
            const vectorTile: MapboxVectorTile = {
              layers: {
                defaultLayer: {
                  features: [],
                },
              },
            };
            const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
            resolve(vectorSource);
          } else {
            const json = JSON.parse(data)
            const vectorTile: MapboxVectorTile = {
              layers: {
                defaultLayer: {
                  features: json
                },
              },
            };
            const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
            resolve(vectorSource);
          }
        },
      );
    }
  });
};

export default function jsonTile(url: string, cfg: ITileParserCFG): IParserData {
  const getTileData = (_tileParams: TileLoadParams, tile: SourceTile) => {
    return getVectorTile(url, tile, cfg?.requestParameters, cfg.getCustomData);
  };

  const tilesetOptions = {
    ...cfg,
    getTileData,
  };

  return {
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
