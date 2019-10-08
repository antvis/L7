import { inject, injectable } from 'inversify';
import { container, ILayer } from '../..';
import { TYPES } from '../../types';
import { IGlobalConfigService } from '../config/IConfigService';
import { IRendererService } from '../renderer/IRendererService';
import { ILayerService } from './ILayerService';

@injectable()
export default class LayerService implements ILayerService {
  private layers: ILayer[] = [];

  @inject(TYPES.IRendererService)
  private readonly renderService: IRendererService;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  public add(layer: ILayer) {
    this.layers.push(layer);
  }

  public initLayers() {
    this.layers.forEach((layer) => {
      // register plugins in every layer
      for (const plugin of layer.plugins) {
        plugin.apply(layer);
      }
      layer.init();
    });
  }

  public renderLayers() {
    this.layers.forEach((layer) => {
      // trigger hooks
      layer.hooks.beforeRender.call(layer);
      layer.render();
      layer.hooks.afterRender.call(layer);
    });
  }

  public clean() {
    // TODO: destroy every layer first
    this.layers = [];
  }
}
