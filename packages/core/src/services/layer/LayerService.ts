import { inject, injectable } from 'inversify';
import { ILayer } from '../..';
import { TYPES } from '../../types';
import Clock from '../../utils/clock';
import { IGlobalConfigService } from '../config/IConfigService';
import { IRendererService } from '../renderer/IRendererService';
import { ILayerModel, ILayerService } from './ILayerService';

@injectable()
export default class LayerService implements ILayerService {
  public clock = new Clock();

  public alreadyInRendering: boolean = false;

  private layers: ILayer[] = [];

  private layerRenderID: number;

  private sceneInited: boolean = false;

  private animateInstanceCount: number = 0;

  @inject(TYPES.IRendererService)
  private readonly renderService: IRendererService;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  public add(layer: ILayer) {
    if (this.sceneInited) {
      layer.init();
    }
    this.layers.push(layer);
  }

  public initLayers() {
    this.sceneInited = true;
    this.layers.forEach((layer) => {
      if (!layer.inited) {
        layer.init();
      }
    });
  }

  public getLayers(): ILayer[] {
    return this.layers;
  }

  public getLayer(id: string): ILayer | undefined {
    return this.layers.find((layer) => layer.id === id);
  }

  public getLayerByName(name: string): ILayer | undefined {
    return this.layers.find((layer) => layer.name === name);
  }

  public remove(layer: ILayer): void {
    const layerIndex = this.layers.indexOf(layer);
    if (layerIndex > -1) {
      this.layers.splice(layerIndex, 1);
    }
    layer.emit('remove', null);
    layer.destroy();
    this.renderLayers();
  }

  public removeAllLayers() {
    this.destroy();
  }

  public renderLayers() {
    if (this.alreadyInRendering) {
      return;
    }
    this.alreadyInRendering = true;
    this.clear();
    this.updateRenderOrder();
    this.layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .forEach((layer) => {
        // trigger hooks
        layer.hooks.beforeRenderData.call();
        layer.hooks.beforeRender.call();
        layer.render();
        layer.hooks.afterRender.call();
      });
    this.alreadyInRendering = false;
  }

  public updateRenderOrder() {
    this.layers.sort((pre: ILayer, next: ILayer) => {
      return pre.zIndex - next.zIndex;
    });
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
    this.layers = [];
    this.renderLayers();
  }

  public startAnimate() {
    if (this.animateInstanceCount++ === 0) {
      this.clock.start();
      this.runRender();
    }
  }

  public stopAnimate() {
    if (--this.animateInstanceCount === 0) {
      this.stopRender();
      this.clock.stop();
    }
  }

  private clear() {
    this.renderService.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      stencil: 0,
      framebuffer: null,
    });
  }

  private runRender() {
    this.renderLayers();
    this.layerRenderID = requestAnimationFrame(this.runRender.bind(this));
  }

  private stopRender() {
    cancelAnimationFrame(this.layerRenderID);
  }
}
