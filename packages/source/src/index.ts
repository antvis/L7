import { registerParser, registerTransform } from './factory';
import csv from './parser/csv';
import geojson from './parser/geojson';
import image from './parser/image';
import json from './parser/json';
import Source from './source';
export default Source;
registerParser('geojson', geojson);
registerParser('image', image);
registerParser('csv', csv);
registerParser('json', json);
export {
  getTransform,
  registerTransform,
  getParser,
  registerParser,
} from './factory';

export * from './interface';
