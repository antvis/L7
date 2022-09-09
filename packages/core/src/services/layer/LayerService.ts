import { $window, rgb2arr } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILayer } from '../..';
import { TYPES } from '../../types';
import Clock from '../../utils/clock';
import { IMapService } from '../map/IMapService';
import { IRendererService } from '../renderer/IRendererService';
import { ILayerService, RenderType } from './ILayerService';
import { throttle } from 'lodash';

@injectable()
export default class LayerService implements ILayerService {
  // pickedLayerId 参数用于指定当前存在被选中的 layer
  public pickedLayerId: number = -1;
  public clock = new Clock();

  public alreadyInRendering: boolean = false;

  private layers: ILayer[] = [];

  private layerList: ILayer[] = [];

  private layerRenderID: number;

  private sceneInited: boolean = false;

  private animateInstanceCount: number = 0;

  // TODO: 是否开启 shader 中的颜色拾取计算
  private shaderPicking: boolean = true;

  private enableRender: boolean = true;

  @inject(TYPES.IRendererService)
  private readonly renderService: IRendererService;

  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;

  public reRender = throttle(() => {
    this.updateLayerRenderList();
    this.renderLayers();
  }, 32)

  public throttleRenderLayers = throttle(() => {
    this.renderLayers();
  }, 16)
  

  public add(layer: ILayer) {
    if (this.sceneInited) {
      layer.init();
    }

    this.layers.push(layer);
    this.updateLayerRenderList();
  }

  public addMask(mask: ILayer) {
    if (this.sceneInited) {
      mask.init();
    }
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

  public getSceneInited() {
    return this.sceneInited;
  }

  public getRenderList(): ILayer[] {
    return this.layerList;
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

  public cleanRemove(layer: ILayer, refresh = true) {
    const layerIndex = this.layers.indexOf(layer);
    if (layerIndex > -1) {
      this.layers.splice(layerIndex, 1);
    }
    if (refresh) {
      this.throttleRenderLayers();
    }
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
    layer.destroy();
  }

  public removeAllLayers() {
    this.destroy();
  }

  public setEnableRender(flag: boolean) {
    this.enableRender = flag;
  }

  private getRenderLayerList(type?: RenderType) {
    switch(type) {
      case RenderType.PickingAllLayer:
        return this.layerList.filter(layer => layer.getLayerConfig().usage !== 'basemap');
      default: 
        return this.layerList;
    }
  }

  public async renderLayers(type?: RenderType) {
    const renderLayerList = this.getRenderLayerList(type);
    
    if (this.alreadyInRendering || renderLayerList.length === 0 || !this.enableRender) {
      return;
    }
    this.alreadyInRendering = true;
    this.clear();

    for (const layer of renderLayerList) {
      layer.hooks.beforeRenderData.call();
      layer.hooks.beforeRender.call();

      if (layer.masks.length > 0) {
        // 清除上一次的模版缓存
        this.renderService.clear({
          stencil: 0,
          depth: 1,
          framebuffer: null,
        });
        layer.masks.map((m: ILayer) => {
          m.hooks.beforeRenderData.call();
          m.hooks.beforeRender.call();
          m.render();
          m.hooks.afterRender.call();
        });
      }

      if (layer.getLayerConfig().enableMultiPassRenderer) {
        // multiPassRender 不是同步渲染完成的
        await layer.renderMultiPass();
      } else {
        layer.render();
      }
      layer.hooks.afterRender.call();
    }
    this.alreadyInRendering = false;
  }

  public updateLayerRenderList() {
    // Tip: 每次更新都是从 layers 重新构建
    this.layerList = [];
    this.layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .sort((pre: ILayer, next: ILayer) => {
        // 根据 zIndex 对渲染顺序进行排序
        return pre.zIndex - next.zIndex;
      })
      .forEach((layer) => {
        this.layerList.push(layer);
      });
  }

  public destroy() {
    this.layers.forEach((layer) => {
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

  // 控制着色器颜色拾取计算
  public enableShaderPick() {
    this.shaderPicking = true;
  }

  public disableShaderPick() {
    this.shaderPicking = false;
  }

  public getShaderPickStat() {
    return this.shaderPicking;
  }

  public clear() {
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

  private runRender() {
    this.renderLayers();
    this.layerRenderID = $window.requestAnimationFrame(
      this.runRender.bind(this),
    );
  }

  private stopRender() {
    $window.cancelAnimationFrame(this.layerRenderID);
  }
}
