import { inject, injectable } from 'inversify';
import ILayerStyleService, { ILayerStyleOptions } from './ILayerStyleService';

@injectable()
export default class LayerStyleService implements ILayerStyleService {
  private registry: {
    [layerName: string]: ILayerStyleOptions;
  } = {};

  public registerDefaultStyleOptions(
    layerName: string,
    options: ILayerStyleOptions,
  ) {
    if (!this.registry[layerName]) {
      this.registry[layerName] = options;
    }
  }
}
