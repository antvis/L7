// @ts-ignore
import { SyncBailHook, SyncHook, SyncWaterfallHook } from '@antv/async-hook';
import {
  BlendType,
  gl,
  IActiveOption,
  IAnimateOption,
  ICameraService,
  ICoordinateSystemService,
  IDataState,
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  IIconService,
  IInteractionService,
  ILayer,
  ILayerConfig,
  ILayerModel,
  ILayerModelInitializationOptions,
  ILayerPlugin,
  ILayerService,
  ILegendClassificaItem,
  ILegendSegmentItem,
  IMapService,
  IModel,
  IModelInitializationOptions,
  IMultiPassRenderer,
  IPass,
  IPickingService,
  IPostProcessingPass,
  IRendererService,
  IScale,
  IScaleOptions,
  IShaderModuleService,
  ISource,
  ISourceCFG,
  IStyleAttributeInitializationOptions,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  lazyInject,
  LegendItems,
  ScaleAttributeType,
  ScaleTypeName,
  ScaleTypes,
  StyleAttributeField,
  StyleAttributeOption,
  TYPES,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { encodePickingColor } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { isEqual, isFunction, isObject, isUndefined } from 'lodash';
import { BlendTypes } from '../utils/blend';
import { handleStyleDataMapping } from '../utils/dataMappingStyle';
import {
  createMultiPassRenderer,
  normalizePasses,
} from '../utils/multiPassRender';
import { updateShape } from '../utils/updateShape';
/**
 * 分配 layer id
 */
let layerIdCounter = 0;

export default class BaseLayer<ChildLayerStyleOptions = {}> extends EventEmitter
  implements ILayer {
  public id: string = `${layerIdCounter++}`;
  public name: string = `${layerIdCounter}`;
  public type: string;
  public visible: boolean = true;
  public zIndex: number = 0;
  public minZoom: number;
  public maxZoom: number;
  public inited: boolean = false;
  public layerModelNeedUpdate: boolean = false;
  public pickedFeatureID: number | null = null;
  public selectedFeatureID: number | null = null;
  public styleNeedUpdate: boolean = false;
  public rendering: boolean;
  public clusterZoom: number = 0; // 聚合等级标记
  public layerType?: string | undefined;
  public isLayerGroup: boolean = false;

  public dataState: IDataState = {
    dataSourceNeedUpdate: false,
    dataMappingNeedUpdate: false,
    filterNeedUpdate: false,
    featureScaleNeedUpdate: false,
    StyleAttrNeedUpdate: false,
  };
  // 生命周期钩子
  public hooks = {
    init: new SyncBailHook(),
    afterInit: new SyncBailHook(),
    beforeRender: new SyncBailHook(),
    beforeRenderData: new SyncWaterfallHook(),
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

  // 注入插件集
  public plugins: ILayerPlugin[];

  public sourceOption: {
    data: any;
    options?: ISourceCFG;
  };

  public layerModel: ILayerModel;

  public shapeOption: {
    field: any;
    values: any;
  };

  // TODO: 记录 sceneContainer 供创建子图层的时候使用 如 imageTileLayer
  public sceneContainer: Container | undefined;
  // TODO: 用于保存子图层对象
  public layerChildren: ILayer[] = [];
  public masks: ILayer[] = [];

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  // @lazyInject(TYPES.IShaderModuleService)
  // protected readonly shaderModuleService: IShaderModuleService;

  protected shaderModuleService: IShaderModuleService;
  protected cameraService: ICameraService;

  protected coordinateService: ICoordinateSystemService;

  protected iconService: IIconService;

  protected fontService: IFontService;

  protected pickingService: IPickingService;

  protected rendererService: IRendererService;

  protected layerService: ILayerService;

  protected interactionService: IInteractionService;

  protected mapService: IMapService;

  protected styleAttributeService: IStyleAttributeService;

  protected layerSource: Source;

  protected postProcessingPassFactory: (
    name: string,
  ) => IPostProcessingPass<unknown>;
  protected normalPassFactory: (name: string) => IPass<unknown>;

  protected animateOptions: IAnimateOption = { enable: false };

  /**
   * 图层容器
   */
  private container: Container;

  private encodedData: IEncodeFeature[];

  private configSchema: object;

  private currentPickId: number | null = null;

  private rawConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  private needUpdateConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  /**
   * 待更新样式属性，在初始化阶段完成注册
   */
  private pendingStyleAttributes: Array<{
    attributeName: string;
    attributeField: StyleAttributeField;
    attributeValues?: StyleAttributeOption;
    defaultName?: string;
    updateOptions?: Partial<IStyleAttributeUpdateOptions>;
  }> = [];

  private scaleOptions: IScaleOptions = {};

  private animateStartTime: number;

  private aniamateStatus: boolean = false;

  // TODO: layer 保底颜色
  private bottomColor = 'rgba(0, 0, 0, 0)';

  private isDestroied: boolean = false;

  // private pickingPassRender: IPass<'pixelPicking'>;

  constructor(config: Partial<ILayerConfig & ChildLayerStyleOptions> = {}) {
    super();
    this.name = config.name || this.id;
    this.zIndex = config.zIndex || 0;
    this.rawConfig = config;
  }

  public addMaskLayer(maskLayer: ILayer) {
    this.masks.push(maskLayer);
  }

  public removeMaskLayer(maskLayer: ILayer) {
    const layerIndex = this.masks.indexOf(maskLayer);
    if (layerIndex > -1) {
      this.masks.splice(layerIndex, 1);
    }
    maskLayer.destroy();
  }

  public getLayerConfig() {
    return this.configService.getLayerConfig<ChildLayerStyleOptions>(this.id);
  }

  public updateLayerConfig(
    configToUpdate: Partial<ILayerConfig | ChildLayerStyleOptions>,
  ) {
    if (!this.inited) {
      this.needUpdateConfig = {
        ...this.needUpdateConfig,
        ...configToUpdate,
      };
    } else {
      const sceneId = this.container.get<string>(TYPES.SceneID);

      // @ts-ignore
      handleStyleDataMapping(configToUpdate, this); // 处理 style 中进行数据映射的属性字段

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
  public setContainer(container: Container, sceneContainer: Container) {
    this.container = container;
    this.sceneContainer = sceneContainer;
  }

  public getContainer() {
    return this.container;
  }

  public setBottomColor(color: string) {
    this.bottomColor = color;
  }

  public getBottomColor() {
    return this.bottomColor;
  }

  public addPlugin(plugin: ILayerPlugin): ILayer {
    // TODO: 控制插件注册顺序
    // @example:
    // pointLayer.addPlugin(new MyCustomPlugin(), {
    //   before: 'L7BuiltinPlugin'
    // });
    this.plugins.push(plugin);
    return this;
  }

  public init() {
    // 设置配置项
    const sceneId = this.container.get<string>(TYPES.SceneID);
    // 初始化图层配置项
    // const { enableMultiPassRenderer = false } = this.rawConfig;
    // this.configService.setLayerConfig(sceneId, this.id, {
    //   enableMultiPassRenderer,
    // });
    this.configService.setLayerConfig(sceneId, this.id, this.rawConfig);
    this.layerType = this.rawConfig.layerType;

    // 全局容器服务

    // 场景容器服务
    this.iconService = this.container.get<IIconService>(TYPES.IIconService);
    this.fontService = this.container.get<IFontService>(TYPES.IFontService);

    this.rendererService = this.container.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = this.container.get<ILayerService>(TYPES.ILayerService);
    this.interactionService = this.container.get<IInteractionService>(
      TYPES.IInteractionService,
    );

    this.pickingService = this.container.get<IPickingService>(
      TYPES.IPickingService,
    );
    this.mapService = this.container.get<IMapService>(TYPES.IMapService);
    const { enableMultiPassRenderer, passes } = this.getLayerConfig();
    if (enableMultiPassRenderer && passes?.length && passes.length > 0) {
      // Tip: 兼容 multiPassRender 在 amap1 时存在的图层不同步问题 zoom
      this.mapService.on('mapAfterFrameChange', () => {
        this.renderLayers();
      });
    }

    this.cameraService = this.container.get<ICameraService>(
      TYPES.ICameraService,
    );
    this.coordinateService = this.container.get<ICoordinateSystemService>(
      TYPES.ICoordinateSystemService,
    );
    this.shaderModuleService = this.container.get<IShaderModuleService>(
      TYPES.IShaderModuleService,
    );
    this.postProcessingPassFactory = this.container.get(
      TYPES.IFactoryPostProcessingPass,
    );
    this.normalPassFactory = this.container.get(TYPES.IFactoryNormalPass);

    // 图层容器服务
    this.styleAttributeService = this.container.get<IStyleAttributeService>(
      TYPES.IStyleAttributeService,
    );
    this.multiPassRenderer = this.container.get<IMultiPassRenderer>(
      TYPES.IMultiPassRenderer,
    );
    this.multiPassRenderer.setLayer(this);

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
                this.getLayerConfig()[attributeName],
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
    this.plugins = this.container.getAll<ILayerPlugin>(TYPES.ILayerPlugin);
    // 完成插件注册，传入场景和图层容器内的服务
    for (const plugin of this.plugins) {
      plugin.apply(this, {
        rendererService: this.rendererService,
        mapService: this.mapService,
        styleAttributeService: this.styleAttributeService,
        normalPassFactory: this.normalPassFactory,
        postProcessingPassFactory: this.postProcessingPassFactory,
      });
    }

    // 触发 init 生命周期插件
    this.hooks.init.call();
    // this.pickingPassRender = this.normalPassFactory('pixelPicking');
    // this.pickingPassRender.init(this);
    this.hooks.afterInit.call();

    // 触发初始化完成事件;
    this.emit('inited', {
      target: this,
      type: 'inited',
    });
    this.emit('add', {
      target: this,
      type: 'add',
    });
    return this;
  }
  /**
   * Model初始化前需要更新Model样式
   */
  public prepareBuildModel() {
    this.inited = true;
    this.updateLayerConfig({
      ...(this.getDefaultConfig() as object),
      ...this.rawConfig,
    });

    // 启动动画
    const { animateOption } = this.getLayerConfig();
    if (animateOption?.enable) {
      this.layerService.startAnimate();
      this.aniamateStatus = true;
    }
  }
  public color(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    // 设置 color、size、shape、style 时由于场景服务尚未完成（并没有调用 scene.addLayer），因此暂时加入待更新属性列表
    this.updateStyleAttribute('color', field, values, updateOptions);

    // this.pendingStyleAttributes.push({
    //   attributeName: 'color',
    //   attributeField: field,
    //   attributeValues: values,
    //   defaultName: 'colors',
    //   updateOptions,
    // });
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
    this.updateStyleAttribute('filter', field, values, updateOptions);
    return this;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    const lastShape = this.styleAttributeService?.getLayerStyleAttribute(
      'shape',
    )?.scale?.field;
    const currentShape = field;
    this.shapeOption = {
      field,
      values,
    };
    this.updateStyleAttribute('shape', field, values, updateOptions);
    // TODO: 根据 shape 判断是否需要更新 model
    updateShape(this, lastShape, currentShape);
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
    // this.animateOptions = options;
    return this;
  }

  public source(data: any, options?: ISourceCFG): ILayer {
    if (data?.data) {
      // 判断是否为source
      this.setSource(data);
      return this;
    }
    this.sourceOption = {
      data,
      options,
    };
    this.clusterZoom = 0;
    return this;
  }

  public setData(data: any, options?: ISourceCFG) {
    if (this.inited) {
      this.layerSource.setData(data, options);
    } else {
      this.on('inited', () => {
        const currentSource = this.getSource();
        if (!currentSource) {
          // 执行 setData 的时候 source 还不存在（还未执行 addLayer）
          this.source(new Source(data, options));
          this.sourceEvent();
        } else {
          this.layerSource.setData(data, options);
        }
        // this.layerSource.setData(data, options);
      });
    }

    return this;
  }
  public style(
    options: Partial<ChildLayerStyleOptions> & Partial<ILayerConfig>,
  ): ILayer {
    const lastConfig = this.getLayerConfig();
    const { passes, ...rest } = options;

    // passes 特殊处理
    if (passes) {
      normalizePasses(passes).forEach(
        (pass: [string, { [key: string]: unknown }]) => {
          const postProcessingPass = this.multiPassRenderer
            .getPostProcessor()
            .getPostProcessingPassByName(pass[0]);
          if (postProcessingPass) {
            postProcessingPass.updateOptions(pass[1]);
          }
        },
      );
    }

    this.rawConfig = {
      ...this.rawConfig,
      ...rest,
    };
    if (this.container) {
      this.updateLayerConfig(this.rawConfig);
      this.styleNeedUpdate = true;
    }

    // @ts-ignore
    if (lastConfig && lastConfig.mask === true && options.mask === false) {
      this.clearModels();
      this.models = this.layerModel.buildModels();
    }
    return this;
  }
  public scale(field: string | number | IScaleOptions, cfg?: IScale) {
    if (isObject(field)) {
      this.scaleOptions = {
        ...this.scaleOptions,
        ...field,
      };
    } else {
      this.scaleOptions[field] = cfg;
    }
    return this;
  }

  /**
   * 渲染所有的图层
   */
  public renderLayers(): void {
    this.rendering = true;

    this.layerService.renderLayers();

    this.rendering = false;
  }

  public render(): ILayer {
    // TODO: this.getEncodedData().length !== 0 这个判断是为了解决在 2.5.x 引入数据纹理后产生的 空数据渲染导致 texture 超出上限问题
    if (this.getEncodedData().length !== 0) {
      this.renderModels();
    }
    return this;
  }

  /**
   * renderMultiPass 专门用于渲染支持 multipass 的 layer
   */
  public async renderMultiPass() {
    if (this.getEncodedData().length !== 0) {
      if (this.multiPassRenderer && this.multiPassRenderer.getRenderFlag()) {
        // multi render 开始执行 multiPassRender 的渲染流程
        await this.multiPassRenderer.render();
      } else if (this.multiPassRenderer) {
        // renderPass 触发的渲染
        this.renderModels();
      } else {
        this.renderModels();
      }
    }
  }

  public active(options: IActiveOption | boolean) {
    const activeOption: Partial<ILayerConfig> = {};
    activeOption.enableHighlight = isObject(options) ? true : options;
    if (isObject(options)) {
      activeOption.enableHighlight = true;
      if (options.color) {
        activeOption.highlightColor = options.color;
      }
      if (options.mix) {
        activeOption.activeMix = options.mix;
      }
    } else {
      activeOption.enableHighlight = !!options;
    }
    this.updateLayerConfig(activeOption);
    return this;
  }
  public setActive(
    id: number | { x: number; y: number },
    options?: IActiveOption,
  ): void {
    if (isObject(id)) {
      const { x = 0, y = 0 } = id;
      this.updateLayerConfig({
        highlightColor: isObject(options)
          ? options.color
          : this.getLayerConfig().highlightColor,
        activeMix: isObject(options)
          ? options.mix
          : this.getLayerConfig().activeMix,
      });
      this.pick({ x, y });
    } else {
      this.updateLayerConfig({
        pickedFeatureID: id,
        highlightColor: isObject(options)
          ? options.color
          : this.getLayerConfig().highlightColor,
        activeMix: isObject(options)
          ? options.mix
          : this.getLayerConfig().activeMix,
      });
      this.hooks.beforeSelect
        .call(encodePickingColor(id as number) as number[])
        // @ts-ignore
        .then(() => {
          setTimeout(() => {
            this.reRender();
          }, 1);
        });
    }
  }

  public select(option: IActiveOption | boolean): ILayer {
    const activeOption: Partial<ILayerConfig> = {};
    activeOption.enableSelect = isObject(option) ? true : option;
    if (isObject(option)) {
      activeOption.enableSelect = true;
      if (option.color) {
        activeOption.selectColor = option.color;
      }
      if (option.mix) {
        activeOption.selectMix = option.mix;
      }
    } else {
      activeOption.enableSelect = !!option;
    }
    this.updateLayerConfig(activeOption);
    return this;
  }

  public setSelect(
    id: number | { x: number; y: number },
    options?: IActiveOption,
  ): void {
    if (isObject(id)) {
      const { x = 0, y = 0 } = id;
      this.updateLayerConfig({
        selectColor: isObject(options)
          ? options.color
          : this.getLayerConfig().selectColor,
        selectMix: isObject(options)
          ? options.mix
          : this.getLayerConfig().selectMix,
      });
      this.pick({ x, y });
    } else {
      this.updateLayerConfig({
        pickedFeatureID: id,
        selectColor: isObject(options)
          ? options.color
          : this.getLayerConfig().selectColor,
        selectMix: isObject(options)
          ? options.mix
          : this.getLayerConfig().selectMix,
      });
      this.hooks.beforeSelect
        .call(encodePickingColor(id as number) as number[])
        // @ts-ignore
        .then(() => {
          setTimeout(() => {
            this.reRender();
          }, 1);
        });
    }
  }
  public setBlend(type: keyof typeof BlendType): ILayer {
    this.updateLayerConfig({
      blend: type,
    });
    this.layerModelNeedUpdate = true;
    this.reRender();
    return this;
  }
  public show(): ILayer {
    this.updateLayerConfig({
      visible: true,
    });
    this.reRender();
    return this;
  }

  public hide(): ILayer {
    this.updateLayerConfig({
      visible: false,
    });
    this.reRender();
    return this;
  }
  public setIndex(index: number): ILayer {
    this.zIndex = index;
    this.layerService.updateLayerRenderList();
    this.layerService.renderLayers();
    return this;
  }

  public setCurrentPickId(id: number) {
    this.currentPickId = id;
  }

  public getCurrentPickId(): number | null {
    return this.currentPickId;
  }

  public setCurrentSelectedId(id: number) {
    this.selectedFeatureID = id;
  }

  public getCurrentSelectedId(): number | null {
    return this.selectedFeatureID;
  }
  public isVisible(): boolean {
    const zoom = this.mapService.getZoom();
    const {
      visible,
      minZoom = -Infinity,
      maxZoom = Infinity,
    } = this.getLayerConfig();
    return !!visible && zoom >= minZoom && zoom <= maxZoom;
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
    this.updateLayerConfig({
      minZoom,
    });
    return this;
  }

  public getMinZoom(): number {
    const { minZoom } = this.getLayerConfig();
    return minZoom as number;
  }

  public getMaxZoom(): number {
    const { maxZoom } = this.getLayerConfig();
    return maxZoom as number;
  }

  public get(name: string) {
    const cfg = this.getLayerConfig();
    // @ts-ignore
    return cfg[name];
  }

  public setMaxZoom(maxZoom: number): ILayer {
    this.updateLayerConfig({
      maxZoom,
    });
    return this;
  }

  public setAutoFit(autoFit: boolean): ILayer {
    this.updateLayerConfig({
      autoFit,
    });
    return this;
  }

  /**
   * zoom to layer Bounds
   */
  public fitBounds(fitBoundsOptions?: unknown): ILayer {
    if (!this.inited) {
      this.updateLayerConfig({
        autoFit: true,
      });
      return this;
    }
    const source = this.getSource();
    const extent = source.extent;
    const isValid = extent.some((v) => Math.abs(v) === Infinity);
    if (isValid) {
      return this;
    }
    this.mapService.fitBounds(
      [
        [extent[0], extent[1]],
        [extent[2], extent[3]],
      ],
      fitBoundsOptions,
    );
    return this;
  }

  public destroy() {
    if (this.isDestroied) {
      return;
    }

    // remove child layer
    this.layerChildren.map((child: ILayer) => child.destroy());
    this.layerChildren = [];

    // remove mask list
    this.masks.map((mask: ILayer) => mask.destroy());
    this.masks = [];

    this.hooks.beforeDestroy.call();
    // 清除sources事件
    this.layerSource.off('update', this.sourceEvent);

    this.multiPassRenderer.destroy();
    // console.log(this.styleAttributeService.getAttributes())
    // 清除所有属性以及关联的 vao == 销毁所有 => model this.models.forEach((model) => model.destroy());
    this.styleAttributeService.clearAllAttributes();

    // 执行每个图层单独的 clearModels 方法 （清除一些额外的 texture、program、buffer 等）

    this.hooks.afterDestroy.call();

    // TODO: 清除各个图层自定义的 models 资源
    this.layerModel?.clearModels();

    this.models = [];

    this.layerService.cleanRemove(this);

    this.emit('remove', {
      target: this,
      type: 'remove',
    });

    this.emit('destroy', {
      target: this,
      type: 'destroy',
    });

    this.removeAllListeners();
    // 解绑图层容器中的服务
    // this.container.unbind(TYPES.IStyleAttributeService);

    this.isDestroied = true;
  }
  public clear() {
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
  }
  public clearModels() {
    this.models.forEach((model) => model.destroy());
    this.layerModel.clearModels();
    this.models = [];
  }

  public isDirty() {
    return !!(
      this.styleAttributeService.getLayerStyleAttributes() || []
    ).filter(
      (attribute) =>
        attribute.needRescale ||
        attribute.needRemapping ||
        attribute.needRegenerateVertices,
    ).length;
  }

  public setSource(source: Source) {
    // 清除旧 sources 事件
    if (this.layerSource) {
      this.layerSource.off('update', this.sourceEvent);
    }

    this.layerSource = source;
    this.clusterZoom = 0;

    // 已 inited 且启用聚合进行更新聚合数据
    if (this.inited && this.layerSource.cluster) {
      const zoom = this.mapService.getZoom();
      this.layerSource.updateClusterData(zoom);
    }
    // source 可能会复用，会在其它layer被修改
    this.layerSource.on('update', this.sourceEvent);
  }
  public getSource() {
    return this.layerSource;
  }

  public getScaleOptions() {
    return this.scaleOptions;
  }

  public setEncodedData(encodedData: IEncodeFeature[]) {
    this.encodedData = encodedData;
  }
  public getEncodedData() {
    return this.encodedData;
  }

  public getScale(name: string): any {
    return this.styleAttributeService.getLayerAttributeScale(name);
  }

  public getLegendItems(name: string): LegendItems {
    const scale = this.styleAttributeService.getLayerAttributeScale(name);

    // 函数自定义映射，没有 scale 返回为空数组
    if (!scale) {
      return [];
    }

    if (scale.invertExtent) {
      // 分段类型  Quantize、Quantile、Threshold
      const items: ILegendSegmentItem[] = scale.range().map((item: number) => {
        return {
          value: scale.invertExtent(item),
          [name]: item,
        };
      });

      return items;
    } else if (scale.ticks) {
      // 连续类型 Continuous (Linear, Power, Log, Identity, Time)
      const items: ILegendClassificaItem[] = scale
        .ticks()
        .map((item: string) => {
          return {
            value: item,
            [name]: scale(item),
          };
        });

      return items;
    } else if (scale?.domain) {
      // 枚举类型 Cat
      const items: ILegendClassificaItem[] = scale
        .domain()
        .filter((item: string | number | undefined) => !isUndefined(item))
        .map((item: string | number) => {
          return {
            value: item,
            [name]: scale(item) as string,
          };
        });

      return items;
    }

    return [];
  }

  public pick({ x, y }: { x: number; y: number }) {
    this.interactionService.triggerHover({ x, y });
  }

  public boxSelect(
    box: [number, number, number, number],
    cb: (...args: any[]) => void,
  ) {
    this.pickingService.boxPickLayer(this, box, cb);
  }

  public buildLayerModel(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ): IModel {
    const {
      moduleName,
      vertexShader,
      fragmentShader,
      triangulation,
      segmentNumber,
      ...rest
    } = options;
    this.shaderModuleService.registerModule(moduleName, {
      vs: vertexShader,
      fs: fragmentShader,
    });
    const { vs, fs, uniforms } = this.shaderModuleService.getModule(moduleName);
    const { createModel } = this.rendererService;
    const {
      attributes,
      elements,
    } = this.styleAttributeService.createAttributesAndIndices(
      this.encodedData,
      triangulation,
      segmentNumber,
    );
    return createModel({
      attributes,
      uniforms,
      fs,
      vs,
      elements,
      blend: BlendTypes[BlendType.normal],
      ...rest,
    });
  }

  public createAttrubutes(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ) {
    const { triangulation } = options;
    // @ts-ignore
    const { attributes } = this.styleAttributeService.createAttributes(
      this.encodedData,
      triangulation,
    );
    return attributes;
  }

  public getTime() {
    return this.layerService.clock.getDelta();
  }
  public setAnimateStartTime() {
    this.animateStartTime = this.layerService.clock.getElapsedTime();
  }
  public stopAnimate() {
    if (this.aniamateStatus) {
      this.layerService.stopAnimate();
      this.aniamateStatus = false;
      this.updateLayerConfig({
        animateOption: {
          enable: false,
        },
      });
    }
  }
  public getLayerAnimateTime(): number {
    return this.layerService.clock.getElapsedTime() - this.animateStartTime;
  }

  public needPick(type: string): boolean {
    const {
      enableHighlight = true,
      enableSelect = true,
    } = this.getLayerConfig();
    // 判断layer是否监听事件;
    let isPick =
      this.eventNames().indexOf(type) !== -1 ||
      this.eventNames().indexOf('un' + type) !== -1;
    if ((type === 'click' || type === 'dblclick') && enableSelect) {
      isPick = true;
    }
    if (
      type === 'mousemove' &&
      (enableHighlight ||
        this.eventNames().indexOf('mouseenter') !== -1 ||
        this.eventNames().indexOf('unmousemove') !== -1 ||
        this.eventNames().indexOf('mouseout') !== -1)
    ) {
      isPick = true;
    }
    return this.isVisible() && isPick;
  }

  public buildModels() {
    throw new Error('Method not implemented.');
  }
  public rebuildModels() {
    throw new Error('Method not implemented.');
  }

  public async renderMulPass(multiPassRenderer: IMultiPassRenderer) {
    await multiPassRenderer.render();
  }

  public renderModels(isPicking?: boolean) {
    // TODO: this.getEncodedData().length > 0 这个判断是为了解决在 2.5.x 引入数据纹理后产生的 空数据渲染导致 texture 超出上限问题
    if (this.getEncodedData().length > 0) {
      if (this.layerModelNeedUpdate && this.layerModel) {
        this.models = this.layerModel.buildModels();
        this.hooks.beforeRender.call();
        this.layerModelNeedUpdate = false;
      }

      if (this.layerModel.renderUpdate) {
        this.layerModel.renderUpdate();
      }
      this.models.forEach((model) => {
        model.draw(
          {
            uniforms: this.layerModel.getUninforms(),
          },
          isPicking,
        );
      });
    }
    return this;
  }

  public updateStyleAttribute(
    type: string,
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    if (!this.inited) {
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
  }

  public getShaderPickStat() {
    return this.layerService.getShaderPickStat();
  }

  /**
   * 继承空方法
   * @param time
   */
  public setEarthTime(time: number) {
    console.warn('empty fn');
  }

  protected getConfigSchema() {
    throw new Error('Method not implemented.');
  }

  protected getModelType(): unknown {
    throw new Error('Method not implemented.');
  }
  protected getDefaultConfig() {
    return {};
  }

  private sourceEvent = () => {
    this.dataState.dataSourceNeedUpdate = true;
    const { autoFit, fitBoundsOptions } = this.getLayerConfig();
    if (autoFit) {
      this.fitBounds(fitBoundsOptions);
    }
    // 对外暴露事件 迁移到 DataMappingPlugin generateMapping，保证在重新重新映射后触发
    // this.emit('dataUpdate');
    this.reRender();
  };

  private reRender() {
    if (this.inited) {
      this.layerService.updateLayerRenderList();
      this.layerService.renderLayers();
    }
  }
  private splitValuesAndCallbackInAttribute(
    valuesOrCallback?: unknown[],
    defaultValues?: unknown[],
  ) {
    return {
      values: isFunction(valuesOrCallback)
        ? undefined
        : valuesOrCallback || defaultValues,
      callback: isFunction(valuesOrCallback) ? valuesOrCallback : undefined,
    };
  }
}
