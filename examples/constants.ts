import type { GUIOptions, TestCaseBasemap } from './types';

export const DEFAULT_GUI_OPTIONS: GUIOptions = {
  map: 'Map',
  renderer: 'device',
  animate: false,
  enableWebGPU: false,
};

export const SEARCH_PARAMS_KEYS = ['namespace', 'name', 'snapshot'].concat(
  Object.keys(DEFAULT_GUI_OPTIONS),
);

export const MAP_TYPES: TestCaseBasemap[] = [
  'Map',
  'GaodeMap',
  'Mapbox',
  'MapLibre',
  'BaiduMap',
  'TencentMap',
  'TMap',
  'GoogleMap',
] as const;
