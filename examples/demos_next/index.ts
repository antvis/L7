import type { TestCase } from '../types';
import * as BasemapTestCases from './basemap';
import * as CanvasTestCases from './canvas';
import * as PointTestCases from './point';

export { BasemapTestCases, CanvasTestCases, PointTestCases };

export const TestCases = new Map<string, [string, TestCase][]>([
  ['point', Object.entries(PointTestCases)],
  ['basemap', Object.entries(BasemapTestCases)],
  ['canvas', Object.entries(CanvasTestCases)],
]);
