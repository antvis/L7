import {
  getArrayBuffer,
  getURLFromTemplate,
  RequestParameters,
  SourceTile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import { Feature, Properties } from '@turf/helpers';
import { IParserData } from '../interface';
import { ITileParserCFG } from '@antv/l7-core';
import Protobuf from 'pbf';
import {
  VectorTile,
  // VectorTileFeature,
  VectorTileLayer,
} from '@mapbox/vector-tile';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
  warp: true,
};

// const TILE_SIZE = 512;

export function osmTileXY2LonLat(x: number, y: number, zoom: number) {
  const lon = (x / Math.pow(2, zoom)) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lon, lat];
}

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
};

const getVectorTile = async (
  url: string,
  tileParams: TileLoadParams,
  tile: SourceTile,
  requestParameters?: Partial<RequestParameters>,
  // coord: string,
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
          // reject(err);
          resolve({ layers: {} });
        } else {
          const vectorTile = new VectorTile(
            new Protobuf(data),
          ) as MapboxVectorTile;
          // check tile source layer
          for (const sourceLayer of Object.keys(vectorTile.layers)) {
            const features: Array<Feature<GeoJSON.Geometry, Properties>> = [];
            const vectorTileLayer = vectorTile.layers[sourceLayer];
            for (let i = 0; i < vectorTile.layers[sourceLayer].length; i++) {
              const vectorTileFeature = vectorTile.layers[sourceLayer].feature(
                i,
              );
              // let feature;
              // if (coord === 'lnglat') {
              const feature = vectorTileFeature.toGeoJSON(
                tileParams.x,
                tileParams.y,
                tileParams.z,
              );
              // TODO ID 统一编码
              features.push({
                ...feature,
                properties: {
                  id: feature.id,
                  ...feature.properties,
                },
              });
            }
            // @ts-ignore
            vectorTileLayer.features = features;
          }

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

  // const coord = cfg?.coord || 'lnglat'; // lnglat - offset
  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) =>
    getVectorTile(url, tileParams, tile, cfg?.requestParameters);
  // getVectorTile(data, tileParams, tile, coord);

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
