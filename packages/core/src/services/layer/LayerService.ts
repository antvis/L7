import { inject, injectable } from 'inversify';
import { ILayer, lazyMultiInject } from '../..';
import { TYPES } from '../../types';
import Clock from '../../utils/clock';
import { IGlobalConfigService } from '../config/IConfigService';
import { IRendererService } from '../renderer/IRendererService';
import { ILayerService } from './ILayerService';

@injectable()
export default class LayerService implements ILayerService {
  public clock = new Clock();

  @lazyMultiInject(TYPES.ILayer)
  private layers: ILayer[] = [];

  private layerRenderID: number;

  private animateInstanceCount: number = 0;

  @inject(TYPES.IRendererService)
  private readonly renderService: IRendererService;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  public add(layer: ILayer) {
    // this.layers.push(layer);
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

  public getLayers(): ILayer[] {
    return this.layers;
  }

  public getLayer(id: string): ILayer | undefined {
    return this.layers.find((layer) => layer.id === id);
  }

  public remove(layer: ILayer): void {
    const layerIndex = this.layers.indexOf(layer);
    if (layerIndex > -1) {
      this.layers.splice(layerIndex, 1);
    }
    layer.destroy();
    this.renderLayers();
  }

  public renderLayers() {
    // TODO：脏检查，只渲染发生改变的 Layer
    //
    this.clear();
    this.layers
      .filter((layer) => layer.isVisible())
      .forEach((layer) => {
        // trigger hooks
        layer.hooks.beforeRender.call();
        layer.render();
        layer.hooks.afterRender.call();
      });
  }

  public updateRenderOrder() {
    this.layers.sort((pre: ILayer, next: ILayer) => {
      return pre.zIndex - next.zIndex;
    });
    this.renderLayers();
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
    this.layers = [];
  }

  public startAnimate() {
    if (this.animateInstanceCount++ === 0) {
      this.runRender();
    }
  }

  public stopAnimate() {
    if (--this.animateInstanceCount === 0) {
      this.stopRender();
    }
  }

  private clear() {
    this.renderService.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      framebuffer: null,
    });
  }

  private runRender() {
    this.renderLayers();
    this.layerRenderID = requestAnimationFrame(this.renderLayers.bind(this));
  }

  private stopRender() {
    cancelAnimationFrame(this.layerRenderID);
  }
}
