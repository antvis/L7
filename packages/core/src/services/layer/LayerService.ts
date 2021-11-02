import { $window, rgb2arr } from '@antv/l7-utils';
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

  private layerList: ILayer[] = [];

  private layerRenderID: number;

  private sceneInited: boolean = false;

  private animateInstanceCount: number = 0;

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
    this.updateLayerRenderList();
  }

  public initLayers() {
    this.sceneInited = true;
    this.layers.forEach((layer) => {
      if (!layer.inited) {
        layer.init();
      }
    });
    this.updateLayerRenderList();
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
    this.updateLayerRenderList();
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

    this.layerList.forEach((layer) => {
      layer.hooks.beforeRenderData.call();
      layer.hooks.beforeRender.call();
      layer.render();
      layer.hooks.afterRender.call();
    })
    this.alreadyInRendering = false;
  }

  public updateLayerRenderList() {
    // TODO: 每次更新都是从 layers 重新构建
    this.layerList = [];
    this.layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .forEach((layer) => {
        this.layerList.push(layer)

        // Tip: 渲染 layer 的子图层 默认 layerChildren 为空数组 表示没有子图层 目前只有 ImageTileLayer 有子图层
        layer.layerChildren.filter((childlayer) => childlayer.inited)
        .filter((childlayer) => childlayer.isVisible())
        .forEach((childlayer) => {
          this.layerList.push(childlayer)
        })
      })

    // 根据 zIndex 对渲染顺序进行排序
    this.layerList.sort((pre: ILayer, next: ILayer) => {
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
    this.layerList = [];
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
    $window.cancelAnimationFrame(this.layerRenderID);
  }
}
