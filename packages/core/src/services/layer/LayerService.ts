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
    // TODO：脏检查，只渲染发生改变的 Layer
    this.layers
      // .filter((layer) => layer.isDirty())
      .forEach((layer) => {
        // trigger hooks
        layer.hooks.beforeRender.call();
        layer.render();
        layer.hooks.afterRender.call();
      });
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
    this.layers = [];
  }
}
