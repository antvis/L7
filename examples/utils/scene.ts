import { Scene } from '@antv/l7';
import type { IMapConfig } from '@antv/l7-core';
import {
  BaiduMap,
  GaodeMap,
  GoogleMap,
  MapLibre,
  Mapbox,
  TdtMap,
  TencentMap,
} from '@antv/l7-extension-maps';
import { Map } from '@antv/l7-maps';
import type { TestCaseOptions } from '../types';

const Maps = {
  Map,
  BaiduMap,
  GaodeMap,
  GoogleMap,
  MapLibre,
  Mapbox,
  TdtMap,
  TencentMap,
};

type CaseSceneOptions = TestCaseOptions & {
  mapConfig?: Partial<IMapConfig>;
};

export const CaseScene = (options: CaseSceneOptions) => {
  const { map: basemap, animate, mapConfig } = options;

  const isMapbox = ['MapLibre', 'Mapbox'].includes(basemap);

  const style = isMapbox
    ? 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
    : 'light';

  const map = new Maps[basemap]({
    style,
    center: [120.188193, 30.292542],
    rotation: 0,
    pitch: 0,
    zoom: 16,
    ...mapConfig,
  });

  const scene = new Scene({
    ...options,
    map,
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
    logoVisible: false,
  });

  return new Promise<Scene>((resolve) => {
    scene.on('loaded', () => {
      animate && scene.startAnimate();
      resolve(scene);
    });
  });
};
