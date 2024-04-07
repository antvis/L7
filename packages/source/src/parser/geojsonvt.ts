import type { SourceTile, TileLoadParams, TilesetManagerOptions } from '@antv/l7-utils';
import type { FeatureCollection, Geometries, Properties } from '@turf/helpers';
import geojsonvt from 'geojson-vt';
import type { IParserData, ITileSource, MapboxVectorTile } from '../interface';
import VtSource from '../source/geojsonvt';

import type { IGeojsonvtOptions, ITileParserCFG } from '@antv/l7-core';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

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

function GetGeoJSON(extent: number, x: number, y: number, z: number, vectorTileFeature: any) {
  let coords = vectorTileFeature.geometry as any;
  const currenType = vectorTileFeature.type;

  const currentProperties = vectorTileFeature.tags;
  const currentId = vectorTileFeature.id;

  const size = extent * Math.pow(2, z);
  const x0 = extent * x;
  const y0 = extent * y;

  let type = VectorTileFeatureTypes[currenType];
  let i;
  let j;

  function project(line: any[]) {
    for (let index = 0; index < line.length; index++) {
      const p = line[index];
      if (p[3]) {
        // 避免重复计算
        break;
      }
      const y2 = 180 - ((p[1] + y0) * 360) / size;
      const lng = ((p[0] + x0) * 360) / size - 180;
      const lat = (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
      line[index] = [lng, lat, 0, 1];
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

const getVectorTile = async (
  tile: SourceTile,
  tileIndex: any,
  tileParams: TileLoadParams,
  extent: number,
): Promise<ITileSource> => {
  return new Promise((resolve) => {
    const tileData = tileIndex.getTile(tile.z, tile.x, tile.y);
    // tileData
    const features = tileData
      ? tileData.features.map((vectorTileFeature: any) => {
          return GetGeoJSON(extent, tileParams.x, tileParams.y, tileParams.z, vectorTileFeature);
        })
      : [];

    const vectorTile: MapboxVectorTile = {
      layers: {
        defaultLayer: {
          // @ts-ignore
          features,
        },
      },
    };
    const vectorSource = new VtSource(vectorTile, tile.x, tile.y, tile.z);
    resolve(vectorSource);
  });
};

function getOption(cfg?: ITileParserCFG) {
  const defaultOptions = {
    // geojson-vt default options
    maxZoom: 14, // max zoom to preserve detail on
    indexMaxZoom: 5, // max zoom in the tile index
    indexMaxPoints: 100000, // max number of points per tile in the tile index
    tolerance: 3, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent
    buffer: 64, // tile buffer on each side
    lineMetrics: false, // whether to calculate line metrics
    promoteId: null, // name of a feature property to be promoted to feature.id
    generateId: true, // whether to generate feature ids. Cannot be used with promoteId
    debug: 0, // logging level (0, 1 or 2)
  };

  if (cfg === undefined || typeof cfg.geojsonvtOptions === 'undefined') {
    return defaultOptions;
  } else {
    return { ...defaultOptions, ...cfg.geojsonvtOptions };
  }
}

export default function geojsonVTTile(
  data: FeatureCollection<Geometries, Properties>,
  cfg: ITileParserCFG,
): IParserData {
  const geojsonOptions = getOption(cfg) as geojsonvt.Options & IGeojsonvtOptions;

  const extent = geojsonOptions.extent || 4096;
  const tileIndex = geojsonvt(data, geojsonOptions);

  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) => {
    return getVectorTile(tile, tileIndex, tileParams, extent);
  };

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
