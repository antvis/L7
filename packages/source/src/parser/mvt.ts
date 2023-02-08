import { ITileParserCFG } from '@antv/l7-core';
import {
  getArrayBuffer,
  getURLFromTemplate,
  RequestParameters,
  SourceTile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import { VectorTileLayer } from '@mapbox/vector-tile';
import { Feature } from '@turf/helpers';
import { IParserData, ITileSource } from '../interface';
import VectorSource from '../source/vector';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
  warp: true,
};

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
};

const getVectorTile = async (
  url: string,
  tileParams: TileLoadParams,
  tile: SourceTile,
  requestParameters?: Partial<RequestParameters>,
  getCustomData?: ITileParserCFG['getCustomData'],
): Promise<ITileSource | undefined> => {
  const tileUrl = getURLFromTemplate(url, tileParams);
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
            resolve(undefined);
          } else {
            const vectorSource = new VectorSource(data, tile.x, tile.y, tile.z);
            resolve(vectorSource);
          }
        },
      );
    } else {
      const xhr = getArrayBuffer(
        {
          ...requestParameters,
          url: tileUrl,
        },
        (err, data) => {
          if (err || !data) {
            resolve(undefined);
          } else {
            const vectorSource = new VectorSource(data, tile.x, tile.y, tile.z);
            resolve(vectorSource);
          }
        },
      );
      tile.xhrCancel = () => xhr.abort();
    }
  });
};

export default function mapboxVectorTile(
  data: string | string[],
  cfg?: ITileParserCFG,
): IParserData {
  // TODO: 后续考虑支持多服务
  const url = Array.isArray(data) ? data[0] : data;
  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) =>
    getVectorTile(
      url,
      tileParams,
      tile,
      cfg?.requestParameters,
      cfg?.getCustomData,
    );

  const tilesetOptions = {
    ...DEFAULT_CONFIG,
    ...cfg,
    getTileData,
  };

  return {
    data: url,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
