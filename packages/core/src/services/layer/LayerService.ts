import { rgb2arr } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILayer } from '../..';
import { TYPES } from '../../types';
import Clock from '../../utils/clock';
import { IGlobalConfigService } from '../config/IConfigService';
import { IMapService } from '../map/IMapService';
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

  private lastRenderType: string;

  private lastPickRenderTime: number;

  @inject(TYPES.IRendererService)
  private readonly renderService: IRendererService;

  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;

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

  public remove(layer: ILayer, parentLayer?: ILayer): void {
    // Tip: layer.layerChildren 当 layer 存在子图层的情况
    if (parentLayer) {
      const layerIndex = parentLayer.layerChildren.indexOf(layer);
      if (layerIndex > -1) {
        parentLayer.layerChildren.splice(layerIndex, 1);
      }
    } else {
      const layerIndex = this.layers.indexOf(layer);
      if (layerIndex > -1) {
        this.layers.splice(layerIndex, 1);
      }
    }

    layer.emit('remove', null);
    layer.destroy();
    this.renderLayers();
  }

  public removeAllLayers() {
    this.destroy();
  }

  public renderLayers(renderType?: string) {
    // TODO: 每次渲染的时候都需要进行渲染判断，判断是否进行渲染
    // 没有传递 type 参数时默认触发的是地图事件，优先级最高，直接渲染
    if (!this.renderTest(renderType)) {
      return;
    }

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
        // Tip: 渲染 layer 的子图层 默认 layerChildren 为空数组 表示没有子图层 目前只有 ImageTileLayer 有子图层
        renderLayerEvent(layer.layerChildren);
        renderLayerEvent([layer]);
      });
    this.alreadyInRendering = false;

    function renderLayerEvent(layers: ILayer[]) {
      layers
        .filter((layer) => layer.inited)
        .filter((layer) => layer.isVisible())
        .forEach((layer) => {
          // trigger hooks
          layer.hooks.beforeRenderData.call();
          layer.hooks.beforeRender.call();
          layer.render();
          layer.hooks.afterRender.call();
        });
    }
  }

  public updateRenderOrder() {
    this.layers.sort((pre: ILayer, next: ILayer) => {
      return pre.zIndex - next.zIndex;
    });
  }

  public destroy() {
    this.layers.forEach((layer) => {
      // Tip: layer.layerChildren 当 layer 存在子图层的情况
      if (layer.layerChildren) {
        layer.layerChildren.forEach((child) => child.destroy());
        layer.layerChildren = [];
      }
      layer.destroy();
    });
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

  public getOESTextureFloat() {
    return this.renderService.extensionObject.OES_texture_float;
  }

  // TODO: 判断地图是否正在被拖动
  public isMapDragging() {
    return this.mapService.dragging;
  }

  private runRender() {
    this.renderLayers();
    this.layerRenderID = requestAnimationFrame(this.runRender.bind(this));
  }

  // 渲染检测
  private renderTest(renderType: string | undefined): boolean {
    const now = new Date().getTime();
    const betweenPickRenderTime = now - this.lastPickRenderTime;
    if (renderType === 'picking') {
      this.lastPickRenderTime = new Date().getTime();
    }

    // 继续渲染事件
    if (renderType) {
      switch (renderType) {
        case 'picking':
          // return false;
          //  TODO: picking 类型的渲染事件
          //  若是上次触发为地图触发的渲染，则认为是地图事件与拾取事件在同时触发，放弃此次渲染
          if (
            this.lastRenderType === 'mapRender' ||
            this.lastRenderType === 'animate'
          ) {
            this.lastRenderType = 'picking';
            // 如果上一次触发的事件在 48 ms 以上，则这一次不放弃触发
            if (betweenPickRenderTime > 48) {
              return true;
            } else {
              return false;
            }
          } else {
            this.lastRenderType = 'picking';
            return true;
          }
        case 'animate':
          // return false;
          if (this.lastRenderType === 'mapRender') {
            this.lastRenderType = 'animate';
            return false;
          } else {
            this.lastRenderType = 'animate';
            return true;
          }
        case 'mapRender':
          this.lastRenderType = 'mapRender';
          return true;
        default:
          return true;
      }
      // TODO: 地图触发的渲染优先级最高，动画其次，拾取最次
    }
    return true;
  }

  private clear() {
    const color = rgb2arr(this.mapService.bgColor) as [
      number,
      number,
      number,
      number,
    ];
    this.renderService.clear({
      color,
      depth: 1,
      stencil: 0,
      framebuffer: null,
    });
  }

  private stopRender() {
    cancelAnimationFrame(this.layerRenderID);
  }
}
