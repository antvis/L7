import { registerParser, registerTransform } from './factory';
import csv from './parser/csv';
import geojson from './parser/geojson';
import image from './parser/image';
import json from './parser/json';
import raster from './parser/raster';
import Source from './source';
import { cluster } from './transform/cluster';
import { aggregatorToGrid } from './transform/grid';
import { pointToHexbin } from './transform/hexagon';
export default Source;
registerParser('geojson', geojson);
registerParser('image', image);
registerParser('csv', csv);
registerParser('json', json);
registerParser('raster', raster);
registerTransform('cluster', cluster);
registerTransform('grid', aggregatorToGrid);
registerTransform('hexagon', pointToHexbin);
export {
  getTransform,
  registerTransform,
  getParser,
  registerParser,
} from './factory';

export * from './interface';
