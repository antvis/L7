import type { Scene } from '@antv/l7';
import type { Controller, GUI } from 'lil-gui';

export type GUIOptions = {
  map: TestCaseBasemap;
  animate: boolean;
  enableWebGPU: boolean;
  [keys: string]: any;
};

export type TestCaseBasemap =
  | 'Map'
  | 'GaodeMap'
  | 'BaiduMap'
  | 'MapLibre'
  | 'TencentMap'
  | 'Mapbox'
  | 'TdtMap'
  | 'GoogleMap';

export type TestCaseOptions = GUIOptions & {
  id: string | HTMLDivElement;
};

export type TestCase = {
  (options: TestCaseOptions): Promise<Scene>;
  extendGUI?: (gui: GUI) => Controller[] | GUI[];
};
