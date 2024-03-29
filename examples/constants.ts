import type { RenderDemoMap, RenderDemoOptions } from './types';

export const MAP_TYPES: RenderDemoMap[] = [
  'Map',
  'GaodeMap',
  'BaiduMap',
  'MapLibre',
  'TencentMap',
  'Mapbox',
  'TMap',
  'GoogleMap',
] as const;

export const DEFAULT_RENDER_OPTIONS: RenderDemoOptions = {
  map: 'Map',
  renderer: 'device',
  animate: false,
};
