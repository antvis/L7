// @ts-ignore
import { AsyncSeriesHook } from '@antv/async-hook';
import { $window, DOM } from '@antv/l7-utils';
import elementResizeEvent, { unbind } from 'element-resize-event';
import { EventEmitter } from 'eventemitter3';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { createRendererContainer } from '../../utils/dom';
import { IFontService } from '../asset/IFontService';
import { IIconService } from '../asset/IIconService';
import { ICameraService, IViewport } from '../camera/ICameraService';
import { IControlService } from '../component/IControlService';
import { IMarkerService } from '../component/IMarkerService';
import { IPopupService } from '../component/IPopupService';
import { IGlobalConfigService, ISceneConfig } from '../config/IConfigService';
import { ICoordinateSystemService } from '../coordinate/ICoordinateSystemService';
import { IDebugService } from '../debug/IDebugService';
import {
  IInteractionService,
  IInteractionTarget,
  InteractionEvent,
} from '../interaction/IInteractionService';
import { IPickingService } from '../interaction/IPickingService';
import { ILayer, ILayerService } from '../layer/ILayerService';
import { IMapService } from '../map/IMapService';
import { IRenderConfig, IRendererService } from '../renderer/IRendererService';
import { IShaderModuleService } from '../shader/IShaderModuleService';
import { ISceneService } from './ISceneService';

/**
 * will emit `loaded` `resize` `destroy` event panstart panmove panend
 */
@injectable()
export default class Scene extends EventEmitter implements ISceneService {
  public destroyed: boolean = false;

  public loaded: boolean = false;

  @inject(TYPES.SceneID)
  private readonly id: string;
  /**
   * 使用各种 Service
   */
  @inject(TYPES.IIconService)
  private readonly iconService: IIconService;

  @inject(TYPES.IFontService)
  private readonly fontService: IFontService;

  @inject(TYPES.IControlService)
  private readonly controlService: IControlService;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.IMapService)
  private readonly map: IMapService;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @inject(TYPES.ILayerService)
  private readonly layerService: ILayerService;

  @inject(TYPES.IDebugService)
  private readonly debugService: IDebugService;

  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.IInteractionService)
  private readonly interactionService: IInteractionService;

  @inject(TYPES.IPickingService)
  private readonly pickingService: IPickingService;

  @inject(TYPES.IShaderModuleService)
  private readonly shaderModuleService: IShaderModuleService;

  @inject(TYPES.IMarkerService)
  private readonly markerService: IMarkerService;

  @inject(TYPES.IPopupService)
  private readonly popupService: IPopupService;

  /**
   * 是否首次渲染
   */
  private inited: boolean = false;
  private initPromise: Promise<void>;

  // TODO: 改成状态机
  private rendering: boolean = false;

  /**
   * canvas 容器
   */
  private $container: HTMLDivElement | null | HTMLCanvasElement;

  private canvas: HTMLCanvasElement;

  private markerContainer: HTMLElement;

  private hooks: {
    init: AsyncSeriesHook;
  };

  public constructor() {
    super();
    // @see https://github.com/webpack/tapable#usage
    this.hooks = {
      /**
       * 初始化异步任务，可并行：
       * 1. initMap：初始化地图底图、相机
       * 2. initRenderer：初始化渲染引擎
       * 3. initWorker：初始化 Worker
       */
      init: new AsyncSeriesHook(),
    };
  }

  public init(sceneConfig: ISceneConfig) {
    // 设置场景配置项
    this.configService.setSceneConfig(this.id, sceneConfig);
    // 初始化 ShaderModule
    this.shaderModuleService.registerBuiltinModules();

    // 初始化资源管理 图片
    this.iconService.init();
    this.iconService.on('imageUpdate', () => this.render());
    // 字体资源
    this.fontService.init();
    /**
     * 初始化底图
     */
    this.hooks.init.tapPromise('initMap', async () => {
      this.debugService.log('map.mapInitStart', {
        type: this.map.version,
      });
      // 等待首次相机同步
      await new Promise<void>((resolve) => {
        this.map.onCameraChanged((viewport: IViewport) => {
          this.cameraService.init();
          this.cameraService.update(viewport);
          resolve();
        });
        this.map.init();
      });

      // 重新绑定非首次相机更新事件
      this.map.onCameraChanged(this.handleMapCameraChanged);
      this.map.addMarkerContainer();
      // 初始化未加载的marker;
      this.markerService.addMarkers();
      this.markerService.addMarkerLayers();
      this.popupService.initPopup();
      // 地图初始化之后 才能初始化 container 上的交互
      this.interactionService.init();
      this.interactionService.on(
        InteractionEvent.Drag,
        this.addSceneEvent.bind(this),
      );
    });

    /**
     * 初始化渲染引擎
     */
    this.hooks.init.tapPromise('initRenderer', async () => {
      const renderContainer = this.map.getOverlayContainer();

      if (renderContainer) {
        this.$container = renderContainer as HTMLDivElement;
      } else {
        this.$container = createRendererContainer(
          this.configService.getSceneConfig(this.id).id || '',
        );
      }

      // 创建底图之上的 container
      if (this.$container) {
        this.canvas = DOM.create(
          'canvas',
          '',
          this.$container,
        ) as HTMLCanvasElement;
        this.setCanvas();
        await this.rendererService.init(
          // @ts-ignore
          this.canvas,
          this.configService.getSceneConfig(this.id) as IRenderConfig,
          sceneConfig.gl,
        );
        this.registerContextLost();
        this.initContainer();

        elementResizeEvent(
          this.$container as HTMLDivElement,
          this.handleWindowResized,
        );
        if ($window.matchMedia) {
          $window
            .matchMedia('screen and (-webkit-min-device-pixel-ratio: 1.5)')
            ?.addListener(this.handleWindowResized);
        }
      } else {
        console.error('容器 id 不存在');
      }
      this.pickingService.init(this.id);
    });

    this.render();
  }

  private registerContextLost() {
    const canvas = this.rendererService.getCanvas();
    if (canvas) {
      canvas.addEventListener('webglcontextlost', () =>
        this.emit('webglcontextlost'),
      );
    }
  }

  /**
   * 小程序环境下初始化 Scene
   * @param sceneConfig
   */
  public initMiniScene(sceneConfig: ISceneConfig) {
    // 设置场景配置项
    this.configService.setSceneConfig(this.id, sceneConfig);

    // 初始化 ShaderModule
    this.shaderModuleService.registerBuiltinModules();

    // 初始化资源管理 图片
    this.iconService.init();
    this.iconService.on('imageUpdate', () => this.render());
    // 字体资源
    this.fontService.init();

    /**
     * 初始化底图
     */
    this.hooks.init.tapPromise('initMap', async () => {
      // 等待首次相机同步
      await new Promise<void>((resolve) => {
        this.map.onCameraChanged((viewport: IViewport) => {
          this.cameraService.init();
          this.cameraService.update(viewport);
          if (this.map.version !== 'GAODE2.x') {
            // not amap2
            resolve();
          }
        });
        // @ts-ignore
        this.map.initMiniMap();
      });

      // 重新绑定非首次相机更新事件
      this.map.onCameraChanged(this.handleMapCameraChanged);

      // 地图初始化之后 才能初始化 container 上的交互
      this.interactionService.init();
      this.interactionService.on(
        InteractionEvent.Drag,
        this.addSceneEvent.bind(this),
      );
    });

    /**
     * 初始化渲染引擎
     */
    this.hooks.init.tapPromise('initRenderer', async () => {
      // 创建底图之上的 container
      const $container = sceneConfig.canvas;

      // 添加marker container;
      this.$container = $container ? $container : null;
      if (this.$container) {
        await this.rendererService.init(
          // @ts-ignore
          sceneConfig.canvas,
          this.configService.getSceneConfig(this.id) as IRenderConfig,
          undefined,
        );
      } else {
        console.error('容器 id 不存在');
      }

      this.pickingService.init(this.id);
    });
    // TODO：init worker, fontAtlas...

    // 执行异步并行初始化任务
    // @ts-ignore
    this.initPromise = this.hooks.init.promise();
    this.render();
  }

  public addLayer(layer: ILayer) {
    this.layerService.sceneService = this;
    this.layerService.add(layer);
  }

  public addMask(mask: ILayer) {
    this.layerService.sceneService = this;
    this.layerService.addMask(mask);
  }

  public async render() {
    if (this.rendering || this.destroyed) {
      return;
    }
    this.rendering = true;
    // 首次初始化，或者地图的容器被强制销毁的需要重新初始化
    if (!this.inited) {
      // 还未初始化完成需要等待

      await this.hooks.init.promise(); // 初始化地图和渲染
      if (this.destroyed) {
        this.destroy();
      }
      // FIXME: 初始化 marker 容器，可以放到 map 初始化方法中？
      await this.layerService.initLayers();

      this.layerService.renderLayers();
      this.controlService.addControls();
      this.loaded = true;
      this.emit('loaded');
      this.inited = true;
    } else {
      // 尝试初始化未初始化的图层
      await this.layerService.initLayers();
      await this.layerService.renderLayers();
    }

    // 组件需要等待layer 初始化完成之后添加
    this.rendering = false;
  }

  /**
   * 用户自定义添加第三方字体 （用户使用 layer/point/text/iconfont 的前提需要加载第三方字体文件）
   * @param fontFamily
   * @param fontPath
   */
  public addFontFace(fontFamily: string, fontPath: string): void {
    this.fontService.addFontFace(fontFamily, fontPath);
  }

  public getSceneContainer(): HTMLDivElement {
    return this.$container as HTMLDivElement;
  }

  public async exportPng(type?: 'png' | 'jpg'): Promise<string> {
    const renderCanvas = this.$container?.getElementsByTagName('canvas')[0];
    await this.render();

    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  public getSceneConfig(): Partial<ISceneConfig> {
    return this.configService.getSceneConfig(this.id as string);
  }

  // get point size info
  public getPointSizeRange() {
    return this.rendererService.getPointSizeRange();
  }

  public addMarkerContainer(): void {
    // @ts-ignore
    const mapContainer = this.$container.parentElement as HTMLElement;
    if (mapContainer !== null) {
      this.markerContainer = DOM.create(
        'div',
        'l7-marker-container',
        mapContainer,
      );
    }
  }

  public getMarkerContainer() {
    return this.markerContainer;
  }

  public destroy() {
    if (!this.inited) {
      this.destroyed = true;
      return;
    }
    unbind(this.$container as HTMLDivElement, this.handleWindowResized);
    if ($window.matchMedia) {
      $window
        .matchMedia('screen and (min-resolution: 2dppx)')
        ?.removeListener(this.handleWindowResized);
    }

    this.pickingService.destroy();
    this.layerService.destroy();

    // this.rendererService.destroy();

    this.interactionService.destroy();
    this.controlService.destroy();
    this.markerService.destroy();
    this.fontService.destroy();
    this.iconService.destroy();

    this.removeAllListeners();
    this.inited = false;

    this.map.destroy();
    setTimeout(() => {
      this.$container?.removeChild(this.canvas);
      // this.canvas = null 清除对 webgl 实例的引用
      // @ts-ignore
      this.canvas = null;
      // Tip: 把这一部分销毁放到写下一个事件循环中执行，兼容 L7React 中 scene 和 layer 同时销毁的情况
      this.rendererService.destroy();
    });
    // 销毁 container 容器
    this.$container?.parentNode?.removeChild(this.$container);
    this.emit('destroy');
  }

  private handleWindowResized = () => {
    this.emit('resize');
    // @ts-check
    if (this.$container) {
      this.initContainer();
      DOM.triggerResize();
      this.coordinateSystemService.needRefresh = true;

      //  repaint layers
      this.render();
    }
  };
  private initContainer() {
    const pixelRatio = DOM.DPR;
    const w = this.$container?.clientWidth || 400;
    const h = this.$container?.clientHeight || 300;
    const canvas = this.canvas;
    if (canvas) {
      canvas.width = w * pixelRatio;
      canvas.height = h * pixelRatio;
      // canvas.style.width = `${w}px`;
      // canvas.style.height = `${h}px`;
    }
    this.rendererService.viewport({
      x: 0,
      y: 0,
      width: pixelRatio * w,
      height: pixelRatio * h,
    });
  }

  private setCanvas() {
    const pixelRatio = DOM.DPR;
    const w = this.$container?.clientWidth || 400;
    const h = this.$container?.clientHeight || 300;
    const canvas = this.canvas;
    canvas.width = w * pixelRatio;
    canvas.height = h * pixelRatio;
    // canvas.style.width = `${w}px`;
    // canvas.style.height = `${h}px`;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }

  private handleMapCameraChanged = (viewport: IViewport) => {
    this.cameraService.update(viewport);
    this.render();
  };

  private addSceneEvent(target: IInteractionTarget) {
    this.emit(target.type, target);
  }
}
