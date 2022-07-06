import { registerParser, registerTransform } from './factory';
import csv from './parser/csv';
import geojson from './parser/geojson';
import image from './parser/image';
import json, { defaultData, defaultParser } from './parser/json';
import mapboxVectorTile from './parser/mvt';
import raster from './parser/raster';
import rasterTile from './parser/raster-tile';
import Source from './source';
import { cluster } from './transform/cluster';
import { filter } from './transform/filter';
import { aggregatorToGrid } from './transform/grid';
import { pointToHexbin } from './transform/hexagon';
import { join } from './transform/join';
import { map } from './transform/map';

registerParser('rasterTile', rasterTile);
registerParser('mvt', mapboxVectorTile);
registerParser('geojson', geojson);
registerParser('image', image);
registerParser('csv', csv);
registerParser('json', json);
registerParser('raster', raster);
registerTransform('cluster', cluster);
registerTransform('filter', filter);
registerTransform('join', join);
registerTransform('map', map);
registerTransform('grid', aggregatorToGrid);
registerTransform('hexagon', pointToHexbin);

export {
  getTransform,
  registerTransform,
  getParser,
  registerParser,
} from './factory';

export * from './interface';

export const DEFAULT_DATA = defaultData;
export const DEFAULT_PARSER = defaultParser;

export default Source;
