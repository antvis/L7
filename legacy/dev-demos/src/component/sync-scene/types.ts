import type { Scene } from '@antv/l7';

export interface ISyncSceneOptions {
  zoomGap?: number;
  mainIndex?: number;
}
export interface SyncSceneProps {
  scenes: Scene[];
  options?: ISyncSceneOptions;
}
