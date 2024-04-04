import type { RequestParameters, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getData, getURLFromTemplate } from '@antv/l7-utils';
import type { IParserData, ITileSource, MapboxVectorTile } from '../interface';
import VtSource from '../source/geojsonvt';

import type { ITileParserCFG } from '@antv/l7-core';

const getVectorTile = async (
  url: string,
  tile: SourceTile,
  requestParameters?: Partial<RequestParameters>,
  getCustomData?: ITileParserCFG['getCustomData'],
): Promise<ITileSource> => {
  const params = { x: tile.x, y: tile.y, z: tile.z };
  const tileUrl = getURLFromTemplate(url, params);
  return new Promise((resolve) => {
    if (getCustomData) {
      getCustomData(params, (err, data) => {
        if (err || !data) {
          const vectorTile: MapboxVectorTile = {
            layers: { defaultLayer: { features: [] } },
          };
          const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
          resolve(vectorSource);
        } else {
          const vectorTile: MapboxVectorTile = {
            layers: { defaultLayer: { features: data.features } },
          };
          const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
          resolve(vectorSource);
        }
      });
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
            const json = JSON.parse(data);
            const vectorTile: MapboxVectorTile = {
              layers: {
                defaultLayer: {
                  features: json,
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
  const getTileData = (_: TileLoadParams, tile: SourceTile) => {
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
