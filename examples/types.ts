import type { ISceneConfig } from '@antv/l7-core';

export type RenderDemoMap =
  | 'Map'
  | 'GaodeMap'
  | 'GaodeMapNext'
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
