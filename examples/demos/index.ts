import type { TestCase } from '../types';
import * as BasemapTestCases from './basemap';
import * as BugfixTestCases from './bugfix';
import * as CanvasTestCases from './canvas';
import * as ComponentsTestCases from './components';
import * as ExtendTestCases from './extend';
import * as GalleryTestCases from './gallery';
import * as GeometryTestCases from './geometry';
import * as HeatmapTestCases from './heatmap';
import * as LineTestCases from './line';
import * as MaskTestCases from './mask';
import * as PointTestCases from './point';
import * as PolygonTestCases from './polygon';
import * as RasterTestCases from './raster';
import * as TileTestCases from './tile';
import * as WebgpuTestCases from './webgpu';

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
  ['geometry', Object.entries(GeometryTestCases)],
  ['gallery', Object.entries(GalleryTestCases)],
  ['webgpu', Object.entries(WebgpuTestCases)],
  ['extend', Object.entries(ExtendTestCases)],
]);

/**
 * ge SnapshotTests from namespace
 */
// export function geSnapshotTestsFromNamespace(namespace: string) {
//   const testcases = TestCases.get(namespace);
//   if (!testcases) return [];
//   const demo = testcases
//     .filter(([, demo]) => Boolean(demo.snapshot))
//     .map(([name, demo]) => ({
//       name,
//       snapshot: Boolean(demo.snapshot),
//       sleepTime: typeof demo?.snapshot === 'object' ? demo.snapshot?.sleepTime : undefined,
//     }));
//   return demo;
// }
