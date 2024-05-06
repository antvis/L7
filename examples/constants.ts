import type { RenderDemoMap, RenderDemoOptions } from './types';

export const MAP_TYPES: RenderDemoMap[] = [
  'Map',
  'GaodeMap',
  'Mapbox',
  'MapLibre',
  'BaiduMap',
  'TencentMap',
  'TMap',
  'GoogleMap',
] as const;

export const DEFAULT_RENDER_OPTIONS: RenderDemoOptions = {
  map: 'Map',
  renderer: 'device',
  animate: false,
};
