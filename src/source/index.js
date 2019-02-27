// source parser

import geojson from './parser/geojson';
import image from './parser/image';
import csv from './parser/csv';
import json from './parser/json';
import raster from './parser/raster';

import { registerTransform, registerParser } from './factory';
import { aggregatorToGrid } from './transform/grid';
import { pointToHexbin } from './transform/hexagon';
import { map } from './transform/map';

registerParser('geojson', geojson);
registerParser('image', image);
registerParser('csv', csv);
registerParser('json', json);
registerParser('raster', raster);
// 注册transform

registerTransform('grid', aggregatorToGrid);
registerTransform('hexagon', pointToHexbin);
registerTransform('map', map);

export { getTransform, registerTransform, getParser, registerParser } from './factory';
