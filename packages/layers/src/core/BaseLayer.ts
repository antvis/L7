// @ts-ignore
import { AsyncSeriesBailHook, AsyncWaterfallHook, SyncBailHook, SyncHook } from '@antv/async-hook';
import type {
  IActiveOption,
  IAnimateOption,
  IAttributeAndElements,
  IBuffer,
  IDataState,
  IDefaultSourceConfig,
  IEncodeFeature,
  IGlobalConfigService,
  ILayer,
  ILayerAttributesOption,
  ILayerConfig,
  ILayerModel,
  ILayerModelInitializationOptions,
  ILayerPickService,
  ILayerPlugin,
  ILegend,
  IModel,
  IModelInitializationOptions,
  IMultiPassRenderer,
  IParseDataItem,
  IPostProcessingPass,
  IRenderOptions,
  IScale,
  IScaleOptions,
  IShapeOption,
  ISourceCFG,
  ISourceOption,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  ITextureService,
  L7Container,
  LayerEventType,
  LegendItems,
  StyleAttributeField,
  StyleAttributeOption,
  Triangulation,
} from '@antv/l7-core';
import { BlendType, IDebugLog, ILayerStage, globalConfigService } from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { createPlugins } from '../plugins';
import type Source from '../source';
import { BlendTypes } from '../utils/blend';
import { createMultiPassRenderer, normalizePasses } from '../utils/multiPassRender';
import LayerAnimateState from './LayerAnimateState';
import LayerMaskManager from './LayerMaskManager';
import LayerPickingManager from './LayerPickingManager';
import LayerPickService from './LayerPickService';
import LayerRelativeCoords from './LayerRelativeCoords';
import LayerScaleLegend from './LayerScaleLegend';
import LayerVisibilityZoom from './LayerVisibilityZoom';
import TextureService from './TextureService';
const { isEqual, isFunction, isNumber, isObject, isPlainObject } = lodashUtil;
/**
 * 分配 layer id
 */
let layerIdCounter = 0;

export default class BaseLayer<ChildLayerStyleOptions = {}>
  extends EventEmitter<LayerEventType>
  implements ILayer
{
  public id: string = `${layerIdCounter++}`;
  public name: string = `${layerIdCounter}`;
  public parent: ILayer;
  public coordCenter: number[];
  public type: string;
  public visible: boolean = true;
  public zIndex: number = 0;
  public minZoom: number;
  public maxZoom: number;
  public inited: boolean = false;
  public layerModelNeedUpdate: boolean = false;
  public pickedFeatureID: number | null = null;
  public styleNeedUpdate: boolean = false;
  public rendering: boolean;
  public forceRender: boolean = false;
  public clusterZoom: number = 0; // 聚合等级标记
  public layerType?: string | undefined;
  public triangulation?: Triangulation | undefined;
  public layerPickService: ILayerPickService;

  /**
   * 拾取状态与查询 delegate（阶段 1.3a）。外部经 ILayer 方法访问。
   * 编排（active/setActive/select/setSelect）暂留本类，1.3b 搬入。
   */
  public pickingManager: LayerPickingManager = new LayerPickingManager(this, () => this.reRender());
  public textureService: ITextureService;

  public defaultSourceConfig: IDefaultSourceConfig = {
    data: [],
    options: {
      parser: {
        type: 'json',
      },
    },
  };

  public dataState: IDataState = {
    dataSourceNeedUpdate: false,
    dataMappingNeedUpdate: false,
    filterNeedUpdate: false,
    featureScaleNeedUpdate: false,
    StyleAttrNeedUpdate: false,
  };
  // 生命周期钩子
  public hooks = {
    init: new AsyncSeriesBailHook(),
    afterInit: new SyncBailHook(),
    beforeRender: new SyncBailHook(),
    beforeRenderData: new AsyncWaterfallHook(),
    afterRender: new SyncHook(),
    beforePickingEncode: new SyncHook(),
    afterPickingEncode: new SyncHook(),
    beforeHighlight: new SyncHook(['pickedColor']),
    afterHighlight: new SyncHook(),
    beforeSelect: new SyncHook(['pickedColor']),
    afterSelect: new SyncHook(),
    beforeDestroy: new SyncHook(),
    afterDestroy: new SyncHook(),
  };

  // 待渲染 model 列表
  public models: IModel[] = [];

  // 每个 Layer 都有一个
  public multiPassRenderer: IMultiPassRenderer;

  // 注入插件
  public plugins: ILayerPlugin[];

  public startInit: boolean = false;

  public sourceOption: ISourceOption;

  public layerModel: ILayerModel;

  public shapeOption: IShapeOption;

  public tileLayer: any | undefined;
  // 用于保存子图层对象
  public layerChildren: ILayer[] = [];
  public masks: ILayer[] = [];

  /**
   * 遮罩管理 delegate（阶段 1.7）。`masks[]` 保持公开字段供外部
   * （`LayerService`/`BaseModel`）直接读取；delegate 持数组引用就地 mutate。
   * 在 ctor 内 `this.masks` 赋值后实例化，以保证引用指向正确数组。
   */
  public maskManager!: LayerMaskManager;

  /**
   * 可见性/缩放管理 delegate（阶段 1.8）。`reRender`（protected）经
   * ctor 注入 `rerender` 回调桥接（同 `LayerPickingManager` 1.3b 先例）。
   */
  public visibilityZoomManager: LayerVisibilityZoom = new LayerVisibilityZoom(this, () =>
    this.reRender(),
  );

  protected readonly configService: IGlobalConfigService = globalConfigService;

  protected get shaderModuleService() {
    return this.container.shaderModuleService;
  }
  protected get cameraService() {
    return this.container.cameraService;
  }

  protected get coordinateService() {
    return this.container.coordinateSystemService;
  }

  protected get iconService() {
    return this.container.iconService;
  }

  protected get fontService() {
    return this.container.fontService;
  }

  protected get pickingService() {
    return this.container.pickingService;
  }

  protected get rendererService() {
    return this.container.rendererService;
  }

  protected get layerService() {
    return this.container.layerService;
  }

  protected get debugService() {
    return this.container.debugService;
  }

  protected get interactionService() {
    return this.container.interactionService;
  }

  protected get mapService() {
    return this.container?.mapService;
  }

  public styleAttributeService: IStyleAttributeService;

  protected layerSource: Source;

  public postProcessingPassFactory: (name: string) => IPostProcessingPass<unknown>;

  public get normalPassFactory() {
    return this.container.normalPassFactory;
  }

  /**
   * 动画运行态 delegate（阶段 1.5）。原 private `animateStartTime` /
   * `animateStatus` 字段搬入；`animateStatus` 经 public getter 桥接，
   * 保留 `LayerAnimateStylePlugin` 经 `@ts-ignore` 的 `layer.animateStatus` 读取。
   */
  protected animateState: LayerAnimateState = new LayerAnimateState(this);

  // 相对坐标系支持
  /**
   * 相对坐标状态与转换 delegate（阶段 1.4）。原 protected 字段搬入；
   * 外部经 ILayer getter 访问，`processRelativeCoordinates` 经 protected 薄转发。
   */
  protected relativeCoordsManager: LayerRelativeCoords = new LayerRelativeCoords(this);

  /**
   * 图层容器
   */
  container: L7Container;

  private encodedData: IEncodeFeature[];

  protected rawConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  private needUpdateConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  public encodeStyleAttribute: Record<string, any> = {};

  // Shader 的数据映射
  public enableShaderEncodeStyles: string[] = [];

  // 数据层数据映射

  public enableDataEncodeStyles: string[] = [];

  /**
   * 待更新样式属性，在初始化阶段完成注册
   */
  protected pendingStyleAttributes: Array<{
    attributeName: string;
    attributeField: StyleAttributeField;
    attributeValues?: StyleAttributeOption;
    defaultName?: string;
    updateOptions?: Partial<IStyleAttributeUpdateOptions>;
  }> = [];

  /**
   * Scale 配置与 Legend 读取 delegate（阶段 1.6）。原 private `scaleOptions`
   * 字段搬入；`getScaleOptions()` 返回引用供 `FeatureScalePlugin` 缓存，语义不变。
   */
  protected scaleLegendManager: LayerScaleLegend = new LayerScaleLegend(this);

  private isDestroyed: boolean = false;

  private uniformBuffers: IBuffer[] = [];

  constructor(config: Partial<ILayerConfig & ChildLayerStyleOptions> = {}) {
    super();
    this.name = config.name || this.id;
    this.zIndex = config.zIndex || 0;
    this.rawConfig = config;
    this.masks = config.maskLayers || [];
    this.maskManager = new LayerMaskManager(this, this.masks);
  }
  public addMask(layer: ILayer): void {
    this.maskManager.addMask(layer);
  }

  public removeMask(layer: ILayer): void {
    this.maskManager.removeMask(layer);
  }

  public disableMask(): void {
    this.maskManager.disableMask();
  }

  public enableMask(): void {
    this.maskManager.enableMask();
  }

  /**
   * 将废弃
   * @deprecated
   */
  public addMaskLayer(maskLayer: ILayer) {
    this.maskManager.addMaskLayer(maskLayer);
  }

  /**
   * 将废弃
   * @deprecated
   */
  public removeMaskLayer(maskLayer: ILayer) {
    this.maskManager.removeMaskLayer(maskLayer);
  }

  public getAttribute(name: string) {
    return this.styleAttributeService.getLayerStyleAttribute(name);
  }

  public getLayerConfig<T = any>() {
    return this.configService.getLayerConfig<ChildLayerStyleOptions & T>(this.id);
  }

  public updateLayerConfig(configToUpdate: Partial<ILayerConfig | ChildLayerStyleOptions>) {
    // 同步 rawConfig
    Object.keys(configToUpdate).map((key) => {
      if (key in this.rawConfig) {
        (this.rawConfig as Record<string, unknown>)[key] = (
          configToUpdate as Record<string, unknown>
        )[key];
      }
    });
    if (!this.startInit) {
      this.needUpdateConfig = {
        ...this.needUpdateConfig,
        ...configToUpdate,
      };
    } else {
      const sceneId = this.container.id;
      this.configService.setLayerConfig(sceneId, this.id, {
        ...this.configService.getLayerConfig(this.id),
        ...this.needUpdateConfig,
        ...configToUpdate,
      });
      this.needUpdateConfig = {};
    }
  }

  /**
   * 注入图层容器，父容器为场景容器
   * RootContainer 1
   *  -> SceneContainer 1.*
   *   -> LayerContainer 1.*
   */
  public setContainer(container: L7Container) {
    this.container = container;
  }

  public getContainer() {
    return this.container;
  }

  public addPlugin(plugin: ILayerPlugin): ILayer {
    this.plugins.push(plugin);
    return this;
  }

  public async init(): Promise<void> {
    // 设置配置项
    const sceneId = this.container.id;
    this.startInit = true;
    // 初始化图层配置项
    this.configService.setLayerConfig(sceneId, this.id, this.rawConfig);
    this.layerType = this.rawConfig.layerType;

    // 全局容器服务

    // 场景容器服务
    const { enableMultiPassRenderer, passes } = this.getLayerConfig();
    if (enableMultiPassRenderer && passes?.length && passes.length > 0) {
      // Tip: 兼容 multiPassRender 在 amap1 时存在的图层不同步问题 zoom
      this.mapService.on('mapAfterFrameChange', () => {
        this.renderLayers();
      });
    }

    this.postProcessingPassFactory = this.container.postProcessingPassFactory;

    // 图层容器服务
    this.styleAttributeService = this.container.styleAttributeService;
    if (enableMultiPassRenderer) {
      // 按需初始化 瓦片频繁报错
      this.multiPassRenderer = this.container.multiPassRenderer;
      this.multiPassRenderer.setLayer(this);
    }
    // 完成样式服务注册完成前添加的属性
    this.pendingStyleAttributes.forEach(
      ({ attributeName, attributeField, attributeValues, updateOptions }) => {
        this.styleAttributeService.updateStyleAttribute(
          attributeName,
          {
            // @ts-ignore
            scale: {
              field: attributeField,
              ...this.splitValuesAndCallbackInAttribute(
                // @ts-ignore
                attributeValues,
                // @ts-ignore
                attributeField ? undefined : this.getLayerConfig()[attributeName], // 设置了字段不需要设置默认值
              ),
            },
          },
          // @ts-ignore
          updateOptions,
        );
      },
    );
    this.pendingStyleAttributes = [];

    // 获取插件集
    this.plugins = createPlugins();
    // 完成插件注册，传入场景和图层容器内的服务
    for (const plugin of this.plugins) {
      plugin.apply(this, this.container);
    }

    // 初始化其他服务
    this.layerPickService = new LayerPickService(this);

    // 颜色纹理服务
    this.textureService = new TextureService(this);
    this.log(IDebugLog.LayerInitStart);
    // 触发 init 生命周期插件
    await this.hooks.init.promise();
    this.log(IDebugLog.LayerInitEnd);
    this.inited = true;
    // add mask layer
    // 触发初始化完成事件;
    this.emit('inited', {
      target: this,
      type: 'inited',
    });
    this.emit('add', {
      target: this,
      type: 'add',
    });
    this.hooks.afterInit.call();
  }
  public log(logType: string, step: string = 'init') {
    // 瓦片、瓦片图层目前不参与日志（isTileLayer 仅子类/动态存在）
    // @ts-ignore
    if (this.tileLayer || this.isTileLayer) {
      return;
    }
    const key = `${this.id}.${step}.${logType}`;
    const values: { [key: string]: any } = {
      id: this.id,
      type: this.type,
    };
    this.debugService?.log(key, values);
  }

  public updateModelData(data: IAttributeAndElements) {
    if (data.attributes && data.elements) {
      this.models.map((m) => {
        m.updateAttributesAndElements(data.attributes, data.elements);
      });
    } else {
      console.warn('data error');
    }
  }

  public setLayerPickService(layerPickService: ILayerPickService): void {
    this.layerPickService = layerPickService;
  }
  /**
   * Model初始化前需要更新Model样式
   */
  public prepareBuildModel() {
    if (Object.keys(this.needUpdateConfig || {}).length !== 0) {
      this.updateLayerConfig({});
    }

    // 启动动画
    this.animateState.prepareAnimate();
  }
  public color(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.updateStyleAttribute('color', field, values, updateOptions);
    return this;
  }

  // 为对应的图层传入纹理的编号名称（point/image 在 shape 方法中传入纹理名称的方法并不通用）
  public texture(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.updateStyleAttribute('texture', field, values, updateOptions);
    return this;
  }

  public rotate(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.updateStyleAttribute('rotate', field, values, updateOptions);
    return this;
  }
  public size(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.updateStyleAttribute('size', field, values, updateOptions);
    return this;
  }
  // 对mapping后的数据过滤，scale保持不变
  public filter(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    const flag = this.updateStyleAttribute('filter', field, values, updateOptions);
    this.dataState.dataSourceNeedUpdate = flag && this.inited;
    return this;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.shapeOption = {
      field,
      values,
    };
    const flag = this.updateStyleAttribute('shape', field, values, updateOptions);
    this.dataState.dataSourceNeedUpdate = flag && this.inited;
    return this;
  }
  public label(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.pendingStyleAttributes.push({
      attributeName: 'label',
      attributeField: field,
      attributeValues: values,
      updateOptions,
    });
    return this;
  }
  public animate(options: IAnimateOption | boolean) {
    let rawAnimate: Partial<IAnimateOption> = {};
    if (isObject(options)) {
      rawAnimate.enable = true;
      rawAnimate = {
        ...rawAnimate,
        ...options,
      };
    } else {
      rawAnimate.enable = options;
    }
    this.updateLayerConfig({
      animateOption: rawAnimate,
    });
    return this;
  }

  public source(data: any, options?: ISourceCFG): ILayer {
    if (data?.type === 'source') {
      // 判断是否为source
      this.setSource(data);
      return this;
    }
    // 设置source 配置
    this.sourceOption = {
      data,
      options,
    };
    this.clusterZoom = 0;

    return this;
  }

  public setData(data: any, options?: ISourceCFG) {
    if (this.inited) {
      this.dataUpdatelog();
      this.layerSource.setData(data, options);
    } else {
      this.on('inited', () => {
        this.dataUpdatelog();
        this.layerSource.setData(data, options);
      });
    }
    return this;
  }
  private dataUpdatelog() {
    this.log(IDebugLog.SourceInitStart, ILayerStage.UPDATE);
    this.layerSource.once('update', () => {
      this.log(IDebugLog.SourceInitEnd, ILayerStage.UPDATE);
    });
  }

  public style(options: Partial<ChildLayerStyleOptions> & Partial<ILayerConfig>): ILayer {
    const { passes, ...rest } = options;
    const styleRest = rest as Record<string, any>;
    // passes 特殊处理
    if (passes) {
      normalizePasses(passes).forEach((pass: [string, { [key: string]: unknown }]) => {
        const postProcessingPass = this.multiPassRenderer
          .getPostProcessor()
          .getPostProcessingPassByName(pass[0]);
        if (postProcessingPass) {
          postProcessingPass.updateOptions(pass[1]);
        }
      });
    }
    // 兼容 borderColor borderWidth
    if (styleRest.borderColor) {
      styleRest.stroke = styleRest.borderColor;
    }
    if (styleRest.borderWidth) {
      styleRest.strokeWidth = styleRest.borderWidth;
    }

    // 兼容老版本的写法 ['field, 'value']
    const newOption: { [key: string]: any } = rest;
    Object.keys(rest).forEach((key: string) => {
      const values = styleRest[key];
      if (
        Array.isArray(values) &&
        values.length === 2 &&
        !isNumber(values[0]) &&
        !isNumber(values[1])
      ) {
        newOption[key] = {
          field: values[0],
          value: values[1],
        };
      }
    });

    this.encodeStyle(newOption);
    this.updateLayerConfig(newOption);

    return this;
  }

  // 参与数据映射的字段 encodeing
  private encodeStyle(options: { [key: string]: any }) {
    Object.keys(options).forEach((key: string) => {
      if (
        // 需要数据映射
        [...this.enableShaderEncodeStyles, ...this.enableDataEncodeStyles].includes(key) &&
        isPlainObject(options[key]) &&
        (options[key].field || options[key].value) &&
        !isEqual(this.encodeStyleAttribute[key], options[key]) // 防止计算属性重复计算
      ) {
        this.encodeStyleAttribute[key] = options[key];
        this.updateStyleAttribute(key, options[key].field, options[key].value);
        if (this.inited) {
          this.dataState.dataMappingNeedUpdate = true;
        }
      } else {
        // 不需要数据映射
        if (this.encodeStyleAttribute[key]) {
          delete this.encodeStyleAttribute[key]; // 删除已经存在的属性
          this.dataState.dataSourceNeedUpdate = true;
        }
      }
    });
  }

  public scale(field: string | number | IScaleOptions, cfg?: IScale) {
    this.scaleLegendManager.scale(field, cfg);
    return this;
  }

  /**
   * 渲染所有的图层
   */
  public renderLayers(): void {
    this.rendering = true;
    this.layerService.reRender();

    this.rendering = false;
  }

  /**
   * 渲染前的预处理钩子，由 LayerService 在每帧 render 前调用。
   * 默认空实现；子类可按需 override（如 HeatMap 走独立渲染流程）。
   */
  prerender() {}

  public render(options: Partial<IRenderOptions> = {}): ILayer {
    if (this.tileLayer) {
      // 瓦片图层执行单独的 render 渲染队列
      this.tileLayer.render();
      return this;
    }
    this.layerService.beforeRenderData(this);
    if (this.encodeDataLength <= 0 && !this.forceRender) {
      return this;
    }
    // Tip: this.getEncodedData().length !== 0 这个判断是为了解决在 2.5.x 引入数据纹理后产生的 空数据渲染导致 texture 超出上限问题
    this.renderModels(options);
    return this;
  }

  /**
   * multipass 图层的公共渲染入口：有 multiPassRenderer 时委托其编排渲染，
   * 否则回退到 {@link renderModels} 单 pass 渲染。与已废弃的
   * {@link renderMulPass}（单个 renderer 的薄封装）区分。
   */
  public async renderMultiPass() {
    if (this.encodeDataLength <= 0 && !this.forceRender) {
      return;
    }
    if (this.multiPassRenderer && this.multiPassRenderer.getRenderFlag()) {
      // multi render 开始执行 multiPassRender 的渲染流程
      await this.multiPassRenderer.render();
    } else {
      this.renderModels();
    }
  }

  public active(options: IActiveOption | boolean): ILayer {
    return this.pickingManager.active(options);
  }
  public setActive(id: number | { x: number; y: number }, options?: IActiveOption): void {
    this.pickingManager.setActive(id, options);
  }

  public select(option: IActiveOption | boolean): ILayer {
    return this.pickingManager.select(option);
  }

  public setSelect(id: number | { x: number; y: number }, options?: IActiveOption): void {
    this.pickingManager.setSelect(id, options);
  }
  public setBlend(type: keyof typeof BlendType): ILayer {
    this.updateLayerConfig({
      blend: type,
    });
    // this.layerModelNeedUpdate = true;
    this.reRender();
    return this;
  }
  public show(): ILayer {
    return this.visibilityZoomManager.show();
  }

  public hide(): ILayer {
    return this.visibilityZoomManager.hide();
  }
  public setIndex(index: number): ILayer {
    return this.visibilityZoomManager.setIndex(index);
  }

  public setCurrentPickId(id: number) {
    this.pickingManager.setCurrentPickId(id);
  }

  public getCurrentPickId(): number | null {
    return this.pickingManager.getCurrentPickId();
  }

  public setCurrentSelectedId(id: number) {
    this.pickingManager.setCurrentSelectedId(id);
  }

  public getCurrentSelectedId(): number | null {
    return this.pickingManager.getCurrentSelectedId();
  }
  public isVisible(): boolean {
    return this.visibilityZoomManager.isVisible();
  }

  public setMultiPass(
    enableMultiPass: boolean,
    currentPasses?: Array<string | [string, { [key: string]: unknown }]>,
  ) {
    this.updateLayerConfig({
      enableMultiPassRenderer: enableMultiPass,
    });
    if (currentPasses) {
      this.updateLayerConfig({
        passes: currentPasses,
      });
    }

    if (enableMultiPass) {
      const { passes = [] } = this.getLayerConfig();
      this.multiPassRenderer = createMultiPassRenderer(
        this,
        passes,
        this.postProcessingPassFactory,
        this.normalPassFactory,
      );
      this.multiPassRenderer.setRenderFlag(true);
      const { width, height } = this.rendererService.getViewportSize();
      this.multiPassRenderer.resize(width, height);
    }

    return this;
  }

  public setMinZoom(minZoom: number): ILayer {
    return this.visibilityZoomManager.setMinZoom(minZoom);
  }

  public getMinZoom(): number {
    return this.visibilityZoomManager.getMinZoom();
  }

  public getMaxZoom(): number {
    return this.visibilityZoomManager.getMaxZoom();
  }

  public get(name: string) {
    const cfg = this.getLayerConfig();
    return cfg[name];
  }

  public setMaxZoom(maxZoom: number): ILayer {
    return this.visibilityZoomManager.setMaxZoom(maxZoom);
  }

  public setAutoFit(autoFit: boolean): ILayer {
    return this.visibilityZoomManager.setAutoFit(autoFit);
  }

  /**
   * zoom to layer Bounds
   */
  public fitBounds(fitBoundsOptions?: unknown): ILayer {
    return this.visibilityZoomManager.fitBounds(fitBoundsOptions);
  }

  public destroy(refresh = true) {
    if (this.isDestroyed) {
      return;
    }

    // destroy all UBOs
    this.layerModel?.uniformBuffers.forEach((buffer) => {
      buffer.destroy();
    });

    // remove child layer
    this.layerChildren.map((child: ILayer) => child.destroy(false));
    this.layerChildren = [];

    // remove mask list maskfence 掩模需要销毁
    const { maskfence } = this.getLayerConfig();
    if (maskfence) {
      this.masks.map((mask: ILayer) => mask.destroy(false));
      this.masks = [];
    }

    this.hooks.beforeDestroy.call();
    // 清除sources事件
    this.layerSource.off('update', this.onSourceUpdate);

    this.multiPassRenderer?.destroy();

    this.textureService.destroy();

    // 清除所有属性以及关联的 vao == 销毁所有 => model this.models.forEach((model) => model.destroy());
    this.styleAttributeService.clearAllAttributes();

    // 执行每个图层单独的 clearModels 方法 （清除一些额外的 texture、program、buffer 等）

    this.hooks.afterDestroy.call();
    // Tip: 清除各个图层自定义的 models 资源
    this.layerModel?.clearModels(refresh);

    this.tileLayer?.destroy();

    this.models = [];
    // 清除图层日志（如果有的话：非瓦片相关）
    this.debugService?.removeLog(this.id);

    this.emit('remove', {
      target: this,
      type: 'remove',
    });

    this.emit('destroy', {
      target: this,
      type: 'destroy',
    });

    this.removeAllListeners();
    this.isDestroyed = true;
  }
  public clear() {
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
  }
  public clearModels() {
    this.models.forEach((model) => model.destroy());
    this.layerModel?.clearModels();
    this.models = [];
  }

  public isDirty() {
    return !!(this.styleAttributeService.getLayerStyleAttributes() || []).filter(
      (attribute) =>
        attribute.needRescale || attribute.needRemapping || attribute.needRegenerateVertices,
    ).length;
  }
  // 外部初始化Source
  public setSource(source: Source) {
    // 解除原 sources 事件
    if (this.layerSource) {
      this.layerSource.off('update', this.onSourceUpdate);
    }
    this.layerSource = source;
    this.clusterZoom = 0;

    // 已 inited 且启用聚合进行更新聚合数据
    if (this.inited && this.layerSource.cluster) {
      const zoom = this.mapService.getZoom();
      this.layerSource.updateClusterData(zoom);
    }
    if (this.layerSource.inited) {
      this.sourceEvent();
    }
    // this.layerSource.inited 为 true update 事件不会再触发
    this.layerSource.on('update', this.onSourceUpdate);
  }
  public getSource() {
    return this.layerSource;
  }

  public getScaleOptions() {
    return this.scaleLegendManager.getScaleOptions();
  }
  public encodeDataLength: number = 0;
  public setEncodedData(encodedData: IEncodeFeature[]) {
    this.encodedData = encodedData;
    this.encodeDataLength = encodedData.length;
  }
  public getEncodedData() {
    return this.encodedData;
  }

  public getScale(name: string): any {
    return this.scaleLegendManager.getScale(name);
  }

  public getLegend(name: string): ILegend {
    return this.scaleLegendManager.getLegend(name);
  }

  public getLegendItems(name: string): LegendItems {
    return this.scaleLegendManager.getLegendItems(name);
  }

  public pick({ x, y }: { x: number; y: number }) {
    this.pickingManager.pick({ x, y });
  }

  public boxSelect(box: [number, number, number, number], cb: (...args: any[]) => void) {
    this.pickingManager.boxSelect(box, cb);
  }

  public async buildLayerModel(
    options: ILayerModelInitializationOptions & Partial<IModelInitializationOptions>,
  ): Promise<IModel> {
    const {
      moduleName,
      vertexShader,
      fragmentShader,
      defines,
      inject,
      triangulation,
      styleOption,
      pickingEnabled = true,
      ...rest
    } = options;
    this.shaderModuleService.registerModule(moduleName, {
      vs: vertexShader,
      fs: fragmentShader,
      defines,
      inject,
    });
    const { vs, fs, uniforms } = this.shaderModuleService.getModule(moduleName);
    const { createModel } = this.rendererService;
    return new Promise((resolve) => {
      const { attributes, elements, count } = this.styleAttributeService.createAttributesAndIndices(
        this.encodedData,
        triangulation,
        styleOption,
        this,
      );

      const uniformBuffers = [
        ...this.layerModel.uniformBuffers,
        ...this.rendererService.uniformBuffers,
      ];
      if (pickingEnabled) {
        uniformBuffers.push(this.getPickingUniformBuffer());
      }
      const modelOptions = {
        attributes,
        uniforms,
        fs,
        vs,
        elements,
        blend: BlendTypes[BlendType.normal],
        uniformBuffers,
        textures: this.layerModel.textures,
        ...rest,
      };
      if (count) {
        modelOptions.count = count;
      }
      const m = createModel(modelOptions);
      resolve(m);
    });
  }

  public createAttributes(
    options: ILayerModelInitializationOptions & Partial<IModelInitializationOptions>,
  ) {
    const { triangulation } = options;
    // @ts-ignore
    const { attributes } = this.styleAttributeService.createAttributes(
      this.encodedData,
      triangulation,
    );
    return attributes;
  }

  public get animateStatus(): boolean {
    return this.animateState.getAnimateStatus();
  }
  public getTime() {
    return this.animateState.getTime();
  }
  public setAnimateStartTime() {
    this.animateState.setAnimateStartTime();
  }
  public stopAnimate() {
    this.animateState.stopAnimate();
  }
  public getLayerAnimateTime(): number {
    return this.animateState.getLayerAnimateTime();
  }

  public needPick(type: string): boolean {
    return this.pickingManager.needPick(type);
  }

  public async buildModels() {
    throw new Error('Method not implemented.');
  }
  public async rebuildModels() {
    await this.buildModels();
  }

  /**
   * @deprecated 该方法不在 `ILayer` 公共接口中，且无内部调用方，仅为单个
   * multipass renderer 的薄封装。新代码请使用 {@link renderMultiPass}（整图层
   * 多 pass 渲染入口）。将在渲染管线收敛（阶段 4）时并入 `renderMultiPass`。
   */
  public async renderMulPass(multiPassRenderer: IMultiPassRenderer) {
    await multiPassRenderer.render();
  }

  public renderModels(options: Partial<IRenderOptions> = {}) {
    // TODO: this.getEncodedData().length > 0 这个判断是为了解决在 2.5.x 引入数据纹理后产生的 空数据渲染导致 texture 超出上限问题
    if (this.encodeDataLength <= 0 && !this.forceRender) {
      // 数据为空销毁model
      this.clearModels();
      return this;
    }
    this.hooks.beforeRender.call();
    this.models.forEach((model) => {
      model.draw(
        {
          uniforms: this.layerModel.getUninforms(),
          blend: this.layerModel.getBlend(),
          stencil: this.layerModel.getStencil(options),
          textures: this.layerModel.textures,
        },
        options?.ispick || false,
      );
    });
    this.hooks.afterRender.call();
    return this;
  }

  public updateStyleAttribute(
    type: string,
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): boolean {
    // encode diff
    const preAttribute = this.configService.getAttributeConfig(this.id) || {};
    // @ts-ignore
    if (isEqual(preAttribute[type], { field, values })) {
      // 检测是否发生更新
      return false;
    }

    // 存储 Attribute 瓦片图层使用
    if (['color', 'size', 'texture', 'rotate', 'filter', 'label', 'shape'].indexOf(type) !== -1) {
      this.configService.setAttributeConfig(this.id, {
        [type]: {
          field,
          values,
        },
      });
    }

    if (!this.startInit) {
      // 开始初始化执行
      this.pendingStyleAttributes.push({
        attributeName: type,
        attributeField: field,
        attributeValues: values,
        updateOptions,
      });
    } else {
      this.styleAttributeService.updateStyleAttribute(
        type,
        {
          // @ts-ignore
          scale: {
            field,
            ...this.splitValuesAndCallbackInAttribute(
              // @ts-ignore
              values,
              // @ts-ignore
              this.getLayerConfig()[field],
            ),
          },
        },
        // @ts-ignore
        updateOptions,
      );
    }
    return true;
  }

  public getLayerAttributeConfig(): Partial<ILayerAttributesOption> {
    return this.configService.getAttributeConfig(this.id);
  }

  public getShaderPickStat() {
    return this.layerService.getShaderPickStat();
  }

  /**
   * 设置地球时间。基础图层为空实现（仅打印占位 warn）；需要响应的子类
   * （如 `EarthLayer`）可 override 转发至 layerModel。
   * @param time
   */
  public setEarthTime(time: number) {
    console.warn('empty fn');
  }

  /**
   * 数据在 mapping 生成 encodeData 之前的预处理钩子，默认透传。
   * 各具体图层可 override 以做字段裁剪/转换。
   */
  public processData(filterData: IParseDataItem[]) {
    return filterData;
  }

  public getModelType(): string {
    throw new Error('Method not implemented.');
  }
  protected getDefaultConfig() {
    return {};
  }

  /**
   * 处理相对坐标转换
   */
  protected processRelativeCoordinates() {
    this.relativeCoordsManager.processRelativeCoordinates();
  }

  /**
   * 获取绝对坐标数据（用于交互计算）
   */
  public getAbsoluteData() {
    return this.relativeCoordsManager.getAbsoluteData();
  }

  /**
   * 获取相对坐标原点
   */
  public getRelativeOrigin() {
    return this.relativeCoordsManager.getRelativeOrigin();
  }

  /**
   * 获取原始数据范围
   */
  public getOriginalExtent() {
    return this.relativeCoordsManager.getOriginalExtent();
  }

  protected sourceEvent = () => {
    this.dataState.dataSourceNeedUpdate = true;
    // 处理相对坐标转换
    this.processRelativeCoordinates();

    const layerConfig = this.getLayerConfig();
    if (layerConfig && layerConfig.autoFit) {
      this.fitBounds(layerConfig.fitBoundsOptions);
    }
    const autoRender = this.layerSource.getSourceCfg().autoRender;
    if (autoRender) {
      setTimeout(() => {
        this.reRender();
      }, 10);
    }
  };

  /**
   * source 'update' 事件监听器（稳定实例引用，供 on/off 配对解绑）。
   *
   * 修复历史遗留：原先 setSource 内以 inline arrow 注册监听，而 destroy / setSource
   * 替换旧 source 时调用 `off('update', this.sourceEvent)`，引用不匹配令 off 永不
   * 命中（空操作），监听器泄漏至 source GC。提取为具名实例箭头方法后 on/off 统一
   * 引用，解绑真实生效。
   */
  protected readonly onSourceUpdate = ({ type }: { type: string }): void => {
    if (this.coordCenter === undefined) {
      const layerCenter = this.layerSource.center;
      this.coordCenter = layerCenter;
    }
    if (type === 'update') {
      if (this.tileLayer) {
        // 瓦片图层独立更新
        this.tileLayer.reload();
        return;
      }
      // source 初始化不需要处理
      this.sourceEvent();
    }
    if (type === 'inited') {
      this.processRelativeCoordinates();
    }
  };

  protected async initLayerModels() {
    this.models.forEach((model) => model.destroy());
    this.models = [];
    this.uniformBuffers.forEach((buffer) => {
      buffer.destroy();
    });
    this.uniformBuffers = [];

    // Picking Uniform
    const pickingUniforms = this.rendererService.createBuffer({
      data: new Float32Array(20).fill(0),
      isUBO: true,
      label: 'pickingUniforms',
    });
    this.uniformBuffers.push(pickingUniforms);

    this.models = await this.layerModel.initModels();
  }

  getPickingUniformBuffer() {
    return this.uniformBuffers[0];
  }

  protected reRender() {
    if (this.inited) {
      this.layerService.reRender();
    }
  }
  protected splitValuesAndCallbackInAttribute(
    valuesOrCallback?: unknown[],
    // defaultValues?: unknown[],
  ) {
    return {
      values: isFunction(valuesOrCallback) ? undefined : valuesOrCallback,
      callback: isFunction(valuesOrCallback) ? valuesOrCallback : undefined,
    };
  }
}
