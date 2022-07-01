import {
  getArrayBuffer,
  getURLFromTemplate,
  Tile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import {
  VectorTile,
  VectorTileFeature,
  VectorTileLayer,
} from '@mapbox/vector-tile';
import { Feature } from 'geojson';
import Protobuf from 'pbf';
import { IParserData, IRasterTileParserCFG } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

const TILE_SIZE = 512;

export function osmTileXY2LonLat(x: number, y: number, zoom: number) {
  const lon = (x / Math.pow(2, zoom)) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lon, lat];
}

function signedArea(ring: any[]) {
  let sum = 0;
  for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2.x - p1.x) * (p1.y + p2.y);
  }
  return sum;
}

function classifyRings(rings: any[]) {
  const len = rings.length;

  if (len <= 1) {
    return [rings];
  }

  const polygons: any = [];
  let polygon: any;
  let ccw;

  for (let i = 0; i < len; i++) {
    const area = signedArea(rings[i]);
    if (area === 0) {
      continue;
    }

    if (ccw === undefined) {
      ccw = area < 0;
    }

    if (ccw === area < 0) {
      if (polygon) {
        polygons.push(polygon);
      }
      polygon = [rings[i]];
    } else {
      polygon.push(rings[i]);
    }
  }
  if (polygon) {
    polygons.push(polygon);
  }

  return polygons;
}

const VectorTileFeatureTypes = ['Unknown', 'Point', 'LineString', 'Polygon'];
function GetGeoJSON(z: number, vectorTileFeature: VectorTileFeature) {
  const extent = vectorTileFeature.extent;
  let coords = vectorTileFeature.loadGeometry() as any;
  const currenType = vectorTileFeature.type;
  const currentProperties = vectorTileFeature.properties;
  const currentId = vectorTileFeature.id;

  const size = extent * Math.pow(2, z);

  let type = VectorTileFeatureTypes[currenType];
  let i;
  let j;

  function project(line: any[]) {
    for (let index = 0; index < line.length; index++) {
      const point = line[index];
      line[index] = [
        (point.x / size) * TILE_SIZE,
        (point.y / size) * TILE_SIZE,
      ];
    }
  }

  switch (currenType) {
    case 1:
      const points = [];
      for (i = 0; i < coords.length; i++) {
        points[i] = coords[i][0];
      }
      coords = points;
      project(coords);
      break;

    case 2:
      for (i = 0; i < coords.length; i++) {
        project(coords[i]);
      }
      break;

    case 3:
      coords = classifyRings(coords);
      for (i = 0; i < coords.length; i++) {
        for (j = 0; j < coords[i].length; j++) {
          project(coords[i][j]);
        }
      }
      break;
  }

  if (coords.length === 1) {
    coords = coords[0];
  } else {
    type = 'Multi' + type;
  }

  const result = {
    type: 'Feature',
    geometry: {
      type,
      coordinates: coords,
    },
    properties: currentProperties,
    id: currentId,
    tileOrigin: [0, 0],
    coord: '',
  };

  return result;
}

export type MapboxVectorTile = {
  layers: { [_: string]: VectorTileLayer & { features: Feature[] } };
};

const getVectorTile = async (
  url: string | string[],
  tileParams: TileLoadParams,
  tile: Tile,
  coord: string,
): Promise<MapboxVectorTile> => {
  const tileUrl = getURLFromTemplate(url, tileParams);

  return new Promise((resolve) => {
    const xhr = getArrayBuffer({ url: tileUrl }, (err, data) => {
      if (err || !data) {
        // reject(err);
        resolve({ layers: {} });
      } else {
        const vectorTile = new VectorTile(
          new Protobuf(data),
        ) as MapboxVectorTile;
        // check tile source layer
        // console.log(vectorTile)

        const tileOrigin = osmTileXY2LonLat(
          tileParams.x,
          tileParams.y,
          tileParams.z,
        );
        const zoom = tileParams.z;

        for (const sourceLayer of Object.keys(vectorTile.layers)) {
          const features = [];
          const vectorTileLayer = vectorTile.layers[sourceLayer];
          for (let i = 0; i < vectorTile.layers[sourceLayer].length; i++) {
            const vectorTileFeature = vectorTile.layers[sourceLayer].feature(i);
            let feature;
            if (coord === 'lnglat') {
              feature = vectorTileFeature.toGeoJSON(
                tileParams.x,
                tileParams.y,
                tileParams.z,
              );
            } else {
              feature = GetGeoJSON(zoom, vectorTileFeature);
              // @ts-ignore
              vectorTileLayer.l7TileOrigin = tileOrigin;
              // @ts-ignore
              vectorTileLayer.l7TileCoord = coord;
            }

            features.push(feature);
          }
          // @ts-ignore
          vectorTileLayer.features = features;
        }

        resolve(vectorTile);
      }
    });
    tile.xhrCancel = () => xhr.abort();
  });
};

export default function mapboxVectorTile(
  data: string | string[],
  cfg?: IRasterTileParserCFG,
): IParserData {
  const coord = cfg?.coord || 'lnglat'; // lnglat - offset
  const getTileData = (tileParams: TileLoadParams, tile: Tile) =>
    getVectorTile(data, tileParams, tile, coord);
  const tilesetOptions = {
    ...DEFAULT_CONFIG,
    ...cfg,
    getTileData,
  };

  return {
    data,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
