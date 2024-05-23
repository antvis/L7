import type { TestCase } from '../types';
import * as BasemapTestCases from './basemap';
import * as CanvasTestCases from './canvas';
import * as ExtendTestCases from './extend';
import * as GalleryTestCases from './gallery';
import * as HeatmapTestCases from './heatmap';
import * as LineTestCases from './line';
import * as MaskTestCases from './mask';
import * as PointTestCases from './point';
import * as PolygonTestCases from './polygon';
import * as RasterTestCases from './raster';

export { BasemapTestCases, CanvasTestCases, PointTestCases };

export const TestCases = new Map<string, [string, TestCase][]>([
  ['point', Object.entries(PointTestCases)],
  ['heatmap', Object.entries(HeatmapTestCases)],
  ['line', Object.entries(LineTestCases)],
  ['polygon', Object.entries(PolygonTestCases)],
  ['raster', Object.entries(RasterTestCases)],
  ['mask', Object.entries(MaskTestCases)],
  ['basemap', Object.entries(BasemapTestCases)],
  ['canvas', Object.entries(CanvasTestCases)],
  ['extend', Object.entries(ExtendTestCases)],
  ['gallery', Object.entries(GalleryTestCases)],
]);
