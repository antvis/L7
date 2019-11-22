import { EventEmitter } from 'eventemitter3';
import { inject, injectable } from 'inversify';
import { AsyncParallelHook } from 'tapable';
import { TYPES } from '../../types';
import { createRendererContainer } from '../../utils/dom';
import { IFontService } from '../asset/IFontService';
import { IIconService } from '../asset/IIconService';
import { ICameraService, IViewport } from '../camera/ICameraService';
import { IControlService } from '../component/IControlService';
import { IGlobalConfigService, ISceneConfig } from '../config/IConfigService';
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

    this.controlService.init({
      container: document.getElementById(
        this.configService.getSceneConfig(this.id).id || 'map',
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
      this.logger.debug('map loaded');
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
        window.addEventListener('resize', this.handleWindowResized, false);
      } else {
        this.logger.error('容器 id 不存在');
      }

      // 初始化 container 上的交互
      this.interactionService.init();

      this.logger.debug(`scene ${this.id} renderer loaded`);
    });

    // TODO：init worker, fontAtlas...

    // 执行异步并行初始化任务
    this.initPromise = this.hooks.init.promise(
      this.configService.getSceneConfig(this.id),
    );
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
      this.map.addMarkerContainer();
      this.inited = true;
      this.emit('loaded');
    }

    // 尝试初始化未初始化的图层
    this.layerService.initLayers();
    this.layerService.renderLayers();
    this.logger.debug(`scene ${this.id} render`);

    this.rendering = false;
  }

  public destroy() {
    this.emit('destroy');
    this.inited = false;
    this.layerService.destroy();
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
}
