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

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

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

  public cleanRemove(layer: ILayer, parentLayer?: ILayer) {
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
    this.renderLayers();
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
    this.renderLayers();
  }

  public removeAllLayers() {
    this.destroy();
  }

  public setEnableRender(flag: boolean) {
    this.enableRender = flag;
  }

  public async renderLayers() {
    if (this.alreadyInRendering || !this.enableRender) {
      return;
    }
    this.alreadyInRendering = true;
    this.clear();

    for (const layer of this.layerList) {
      layer.hooks.beforeRenderData.call();
      layer.hooks.beforeRender.call();

      // layerGroup 不支持 Mask
      if (!layer.isLayerGroup && layer.masks.length > 0) {
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

    // this.layerList.forEach((layer) => {
    //   layer.hooks.beforeRenderData.call();
    //   layer.hooks.beforeRender.call();
    //   layer.render();
    //   layer.hooks.afterRender.call();
    // });
    this.alreadyInRendering = false;
  }

  public updateLayerRenderList() {
    // TODO: 每次更新都是从 layers 重新构建
    this.layerList = [];
    this.layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .sort((pre: ILayer, next: ILayer) => {
        // 根据 zIndex 对渲染顺序进行排序
        return pre.zIndex - next.zIndex;
      })
      .forEach((layer) => {
        if (layer.isLayerGroup) {
          // layerGroup
          // Tip: 渲染 layer 的子图层 默认 layerChildren 为空数组 表示没有子图层 目前只有 ImageTileLayer 有子图层
          layer.layerChildren
            .filter((childlayer) => childlayer.inited)
            .filter((childlayer) => childlayer.isVisible())
            .sort((pre: ILayer, next: ILayer) => {
              // 根据 zIndex 对渲染顺序进行排序
              return pre.zIndex - next.zIndex;
            })
            .forEach((childlayer) => {
              this.layerList.push(childlayer);
            });
        } else {
          // baseLayer
          this.layerList.push(layer);
        }
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
