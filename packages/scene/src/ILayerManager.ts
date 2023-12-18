import type { ILayer } from '@antv/l7-core';

export default interface ILayerManager {
  enableShaderPick: () => void;
  diasbleShaderPick: () => void;
  addLayer(layer: ILayer): void;

  getLayers(): ILayer[];

  getLayer(id: string): ILayer | undefined;

  removeLayer(layer: ILayer): void;
}
