import { inject, injectable } from 'inversify';
import { ILayer, lazyMultiInject } from '../..';
import { TYPES } from '../../types';
import { ILayerService } from './ILayerService';

@injectable()
export default class LayerService implements ILayerService {
  @lazyMultiInject(TYPES.ILayer)
  private layers: ILayer[] = [];

  public add(layer: ILayer) {
    // this.layers.push(layer);
  }

  public initLayers() {
    console.log(this.layers);
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
