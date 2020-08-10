import { ILayer } from '@antv/l7-core';

export default interface ILayerManager {
  addLayer(layer: ILayer): void;

  getLayers(): ILayer[];

  getLayer(id: string): ILayer | undefined;

  removeLayer(layer: ILayer): void;
}
