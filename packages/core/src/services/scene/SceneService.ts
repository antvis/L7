import { DOM } from '@antv/l7-utils';
import elementResizeEvent, { unbind } from 'element-resize-event';
import { EventEmitter } from 'eventemitter3';
import { inject, injectable } from 'inversify';
import { AsyncParallelHook } from 'tapable';
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
import { IInteractionService } from '../interaction/IInteractionService';
import { ILayer, ILayerService } from '../layer/ILayerService';
import { ILogService } from '../log/ILogService';
import { IMapCamera, IMapService } from '../map/IMapService';
import { IRendererService } from '../renderer/IRendererService';
import { IShaderModuleService } from '../shader/IShaderModuleService';
import { ISceneService } from './ISceneService';

/**
 * will emit `loaded` `resize` `destroy` event
 */
@injectable()
export default class Scene extends EventEmitter implements ISceneService {
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

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

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

  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.IInteractionService)
  private readonly interactionService: IInteractionService;

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
  private $container: HTMLDivElement | null;

  private hooks: {
    init: AsyncParallelHook<unknown>;
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
      init: new AsyncParallelHook(['config']),
    };
  }

  public init(sceneConfig: ISceneConfig) {
    // 设置场景配置项
    this.configService.setSceneConfig(this.id, sceneConfig);

    // 校验场景配置项，失败则终止初始化过程
    const { valid, errorText } = this.configService.validateSceneConfig(
      this.configService.getSceneConfig(this.id),
    );
    if (!valid) {
      this.logger.error(errorText || '');
      return;
    }

    // 初始化 ShaderModule
    this.shaderModuleService.registerBuiltinModules();

    // 初始化资源管理 图片
    this.iconService.init();
    // 字体资源
    this.fontService.init();

    /**
     * 初始化底图
     */
    this.hooks.init.tapPromise('initMap', async () => {
      // 等待首次相机同步
      await new Promise((resolve) => {
        this.map.onCameraChanged((viewport: IViewport) => {
          this.cameraService.init();
          this.cameraService.update(viewport);
          resolve();
        });
        this.map.init();
      });
      // this.controlService.addControls();
      // 重新绑定非首次相机更新事件
      this.map.onCameraChanged(this.handleMapCameraChanged);
      this.map.addMarkerContainer();

      // 初始化未加载的marker;
      this.markerService.addMarkers();
      this.markerService.addMarkerLayers();
      this.popupService.initPopup();
      // 地图初始化之后 才能初始化 container 上的交互
      this.interactionService.init();
      this.logger.debug(`map ${this.id} loaded`);
    });

    /**
     * 初始化渲染引擎
     */
    this.hooks.init.tapPromise('initRenderer', async () => {
      // 创建底图之上的 container
      const $container = createRendererContainer(
        this.configService.getSceneConfig(this.id).id || '',
      );
      this.$container = $container;
      if ($container) {
        await this.rendererService.init($container);
        elementResizeEvent(
          this.$container as HTMLDivElement,
          this.handleWindowResized,
        );
        window
          .matchMedia('screen and (-webkit-min-device-pixel-ratio: 1.5)')
          .addListener(this.handleWindowResized);
      } else {
        this.logger.error('容器 id 不存在');
      }

      this.logger.debug(`scene ${this.id} renderer loaded`);
    });
    // TODO：init worker, fontAtlas...

    // 执行异步并行初始化任务
    this.initPromise = this.hooks.init.promise(
      this.configService.getSceneConfig(this.id),
    );

    this.render();
  }

  public addLayer(layer: ILayer) {
    this.logger.debug(`add layer ${layer.name} to scene ${this.id}`);
    this.layerService.add(layer);
    this.render();
  }

  public async render() {
    if (this.rendering) {
      return;
    }

    this.rendering = true;
    // 首次初始化，或者地图的容器被强制销毁的需要重新初始化
    if (!this.inited) {
      // 还未初始化完成需要等待

      await this.initPromise;
      // FIXME: 初始化 marker 容器，可以放到 map 初始化方法中？

      this.logger.info(' render inited');
      this.layerService.initLayers();
      this.controlService.addControls();
      this.emit('loaded');
      this.inited = true;
    }

    // 尝试初始化未初始化的图层
    this.layerService.renderLayers();
    // 组件需要等待layer 初始化完成之后添加

    this.logger.debug(`scene ${this.id} render`);

    this.rendering = false;
  }

  public getSceneContainer(): HTMLDivElement {
    return this.$container as HTMLDivElement;
  }

  public exportPng(): string {
    const renderCanvas = this.$container?.getElementsByTagName('canvas')[0];
    // this.render();
    DOM.printCanvas(renderCanvas as HTMLCanvasElement);
    const layersPng = renderCanvas?.toDataURL('image/png') as string;
    return layersPng;
  }

  public destroy() {
    this.emit('destroy');
    this.inited = false;
    this.layerService.destroy();
    this.rendererService.destroy();
    this.interactionService.destroy();
    this.controlService.destroy();
    this.markerService.destroy();
    this.removeAllListeners();
    this.map.destroy();
    unbind(this.$container as HTMLDivElement, this.handleWindowResized);
    window
      .matchMedia('screen and (min-resolution: 2dppx)')
      .removeListener(this.handleWindowResized);
  }

  private handleWindowResized = () => {
    this.emit('resize');
    // @ts-check
    if (this.$container) {
      // recalculate the viewport's size and call gl.viewport
      // @see https://github.com/regl-project/regl/blob/master/lib/webgl.js#L24-L38
      const pixelRatio = window.devicePixelRatio;
      let w = window.innerWidth;
      let h = window.innerHeight;
      if (this.$container !== document.body) {
        const bounds = this.$container.getBoundingClientRect();
        w = bounds.right - bounds.left;
        h = bounds.bottom - bounds.top;
      }

      this.rendererService.viewport({
        x: 0,
        y: 0,
        width: pixelRatio * w,
        height: pixelRatio * h,
      });
      // 触发 Map， canvas
      DOM.triggerResize();
      this.coordinateSystemService.needRefresh = true;
      //  repaint layers
      this.render();
    }
  };

  private handleMapCameraChanged = (viewport: IViewport) => {
    this.cameraService.update(viewport);
    this.render();
  };
}
