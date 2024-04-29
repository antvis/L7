import type { ISceneConfig } from '@antv/l7-core';

export type RenderDemoMap =
  | 'Map'
  | 'GaodeMap'
  | 'BaiduMap'
  | 'MapLibre'
  | 'TencentMap'
  | 'Mapbox'
  | 'TMap'
  | 'GoogleMap';

export type RenderDemoOptions = {
  map: RenderDemoMap;
  renderer: ISceneConfig['renderer'];
  animate: boolean;
};
