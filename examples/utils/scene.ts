import { Scene } from '@antv/l7';
import type { IMapConfig } from '@antv/l7-core';
import * as Maps from '@antv/l7-maps';
import type { TestCaseOptions } from '../types';

type CaseSceneOptions = TestCaseOptions & {
  mapConfig?: Partial<IMapConfig>;
};

export const CaseScene = (options: CaseSceneOptions) => {
  const { map: basemap, animate, mapConfig } = options;

  const isMapbox = ['MapLibre', 'Mapbox'].includes(basemap);
  const isGoogleMap = basemap === 'GoogleMap';
  const isBaiduMap = basemap === 'BaiduMap';
  const isTencentMap = basemap === 'TencentMap';
  const isTdtMap = basemap === 'TMap';

  const style = isMapbox
    ? 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
    : 'light';

  const DEFAULT_TOKENS: Record<string, string> = {
    GoogleMap: 'AIzaSyA6U7oKLKbPVUicuCaGQ25_zIMep-zGBcU',
    BaiduMap: 'ShSrOHgrilK8rvaXV6kHC8vwxgnvF3CV',
    TencentMap: 'VZ2BZ-EZ7KZ-D4RXM-TZQDP-Q3PQH-TVF5L',
    TMap: 'b15e548080c79819617367d3f6095c69',
  };

  const defaultToken = DEFAULT_TOKENS[basemap];

  const mapOptions: Partial<IMapConfig> = {
    style: isGoogleMap ? undefined : style,
    center: [120.188193, 30.292542],
    rotation: 0,
    pitch: 0,
    zoom: 16,
    WebGLParams: {
      preserveDrawingBuffer: true,
    },
    ...(defaultToken ? { token: mapConfig?.token || defaultToken } : {}),
    ...mapConfig,
  };

  const map = new Maps[basemap](mapOptions);

  const scene = new Scene({
    ...options,
    map,
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
    // logoVisible: false,
  });

  return new Promise<Scene>((resolve) => {
    scene.on('loaded', () => {
      if (animate) {
        scene.startAnimate();
      }
      resolve(scene);
    });
  });
};
