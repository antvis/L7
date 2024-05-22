import type { TestCase } from '../types';
import * as BasemapTestCases from './basemap';
import * as PointTestCases from './point';

export { PointTestCases };

export const TestCases = new Map<string, [string, TestCase][]>([
  ['point', Object.entries(PointTestCases)],
  ['basemap', Object.entries(BasemapTestCases)],
]);
