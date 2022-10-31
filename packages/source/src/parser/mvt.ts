import { ITileParserCFG } from '@antv/l7-core';
import {
  getArrayBuffer,
  getURLFromTemplate,
  RequestParameters,
  SourceTile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import { VectorTile, VectorTileLayer } from '@mapbox/vector-tile';
import { Feature } from '@turf/helpers';
import Protobuf from 'pbf';
import { IParserData } from '../interface';

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
): Promise<MapboxVectorTile> => {
  const tileUrl = getURLFromTemplate(url, tileParams);
  return new Promise((resolve) => {
    const xhr = getArrayBuffer(
      {
        ...requestParameters,
        url: tileUrl,
      },
      (err, data) => {
        if (err || !data) {
          resolve({ layers: {} });
        } else {
          const vectorTile = new VectorTile(
            new Protobuf(data),
          ) as MapboxVectorTile;
          resolve(vectorTile);
        }
      },
    );
    tile.xhrCancel = () => xhr.abort();
  });
};

export default function mapboxVectorTile(
  data: string | string[],
  cfg?: ITileParserCFG,
): IParserData {
  // TODO: 后续考虑支持多服务
  const url = Array.isArray(data) ? data[0] : data;

  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) =>
    getVectorTile(url, tileParams, tile, cfg?.requestParameters);

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
