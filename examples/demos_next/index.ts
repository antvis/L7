import type { TestCase } from '../types';
import * as BasemapTestCases from './basemap';
import * as BugfixTestCases from './bugfix';
import * as CanvasTestCases from './canvas';
import * as ComponentsTestCases from './components';
import * as ExtendTestCases from './extend';
import * as GalleryTestCases from './gallery';
import * as HeatmapTestCases from './heatmap';
import * as LineTestCases from './line';
import * as MaskTestCases from './mask';
import * as PointTestCases from './point';
import * as PolygonTestCases from './polygon';
import * as RasterTestCases from './raster';
import * as TileTestCases from './tile';
import * as WebgpuTestCases from './webgpu';

export { BasemapTestCases, CanvasTestCases, PointTestCases };

export const TestCases = new Map<string, [string, TestCase][]>([
  ['bugfix', Object.entries(BugfixTestCases)],
  ['point', Object.entries(PointTestCases)],
  ['heatmap', Object.entries(HeatmapTestCases)],
  ['line', Object.entries(LineTestCases)],
  ['polygon', Object.entries(PolygonTestCases)],
  ['raster', Object.entries(RasterTestCases)],
  ['tile', Object.entries(TileTestCases)],
  ['mask', Object.entries(MaskTestCases)],
  ['canvas', Object.entries(CanvasTestCases)],
  ['basemap', Object.entries(BasemapTestCases)],
  ['components', Object.entries(ComponentsTestCases)],
  ['gallery', Object.entries(GalleryTestCases)],
  ['webgpu', Object.entries(WebgpuTestCases)],
  ['extend', Object.entries(ExtendTestCases)],
]);
