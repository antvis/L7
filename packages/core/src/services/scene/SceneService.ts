import { EventEmitter } from 'eventemitter3';
import { inject, injectable } from 'inversify';
import { AsyncParallelHook, AsyncSeriesHook } from 'tapable';
import { TYPES } from '../../types';
import { createRendererContainer } from '../../utils/dom';
import { IFontService } from '../asset/IFontService';
import { IIconService, IImage } from '../asset/IIconService';
import { ICameraService, IViewport } from '../camera/ICameraService';
import { IControlService } from '../component/IControlService';
import { IGlobalConfig, IGlobalConfigService } from '../config/IConfigService';
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

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @inject(TYPES.ILayerService)
  private readonly layerService: ILayerService;

  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.IInteractionService)
  private readonly interactionService: IInteractionService;

  @inject(TYPES.IShaderModuleService)
  private readonly shaderModule: IShaderModuleService;

  /**
   * 是否首次渲染
   */
  private inited: boolean = false;
  private initPromise: Promise<void>;

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

  public init(globalConfig: IGlobalConfig) {
    this.initClear();
    this.configService.setAndCheckConfig(globalConfig);
    // 初始化 ShaderModule
    this.shaderModule.registerBuiltinModules();

    // 初始化资源管理 图片
    this.iconService.init();
    // 字体资源
    this.fontService.init();

    this.controlService.init({
      container: document.getElementById(
        this.configService.getConfig().id || 'map',
      ) as HTMLElement,
    });

    /**
     * 初始化底图
     */
    this.hooks.init.tapPromise('initMap', async (config: unknown) => {
      // 等待首次相机同步
      await new Promise((resolve) => {
        this.map.onCameraChanged((viewport: IViewport) => {
          this.cameraService.init();
          this.cameraService.update(viewport);
          resolve();
        });
        this.map.init(config as Partial<IMapCamera>);
      });

      // 重新绑定非首次相机更新事件
      this.map.onCameraChanged(this.handleMapCameraChanged);
      this.logger.info('map loaded');
    });

    /**
     * 初始化渲染引擎
     */
    this.hooks.init.tapPromise('initRenderer', async () => {
      // 创建底图之上的 container
      const $container = createRendererContainer(
        this.configService.getConfig().id || '',
      );
      this.$container = $container;
      if ($container) {
        await this.rendererService.init($container);
        window.addEventListener('resize', this.handleWindowResized, false);
      } else {
        this.logger.error('容器 id 不存在');
      }

      // 初始化 container 上的交互
      this.interactionService.init();

      this.logger.info('renderer loaded');
    });

    // TODO：init worker, fontAtlas...

    // 执行异步并行初始化任务
    this.initPromise = this.hooks.init.promise(this.configService.getConfig());
  }

  public addLayer(layer: ILayer) {
    this.logger.info(`add layer ${layer.name}`);
    this.layerService.add(layer);
    // scene 创建完成自动调用render 方法
    this.render();
  }

  public async render() {
    // 首次初始化，或者地图的容器被强制销毁的需要重新初始化
    if (!this.inited) {
      // 还未初始化完成需要等待
      await this.initPromise;
      // 初始化 marker 容器 TODO: 可以放到 map 初始化方法中？
      this.map.addMarkerContainer();
      this.logger.info(' render inited');
      this.inited = true;
      this.emit('loaded');
    }

    // 尝试初始化未初始化的图层
    this.layerService.initLayers();
    this.layerService.renderLayers();
    this.logger.info('render');
  }

  public destroy() {
    this.emit('destroy');
    this.inited = false;
    this.layerService.destroy();
    this.configService.reset();
    this.interactionService.destroy();
    this.controlService.destroy();
    this.removeAllListeners();
    this.rendererService.destroy();
    this.map.destroy();
    window.removeEventListener('resize', this.handleWindowResized, false);
  }
  private handleWindowResized = () => {
    this.emit('resize');
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
      //  repaint layers
      this.render();
    }
  };
  private handleMapCameraChanged = (viewport: IViewport) => {
    this.cameraService.update(viewport);
    this.render();
  };
  private initClear() {
    this.inited = false;
    this.layerService.destroy();
    this.configService.reset();
    this.interactionService.destroy();
    this.controlService.destroy();
    this.removeAllListeners();
    this.map.destroy();
    window.removeEventListener('resize', this.handleWindowResized, false);
  }
}
