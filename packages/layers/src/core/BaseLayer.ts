import {
  BlendType,
  gl,
  IActiveOption,
  IAnimateOption,
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
  ILogService,
  IMapService,
  IModel,
  IModelInitializationOptions,
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
  IRendererService,
  IScale,
  IScaleOptions,
  IShaderModuleService,
  ISourceCFG,
  IStyleAttributeInitializationOptions,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  lazyInject,
  ScaleTypeName,
  ScaleTypes,
  StyleAttributeField,
  StyleAttributeOption,
  TYPES,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { isFunction, isObject } from 'lodash';
// @ts-ignore
import mergeJsonSchemas from 'merge-json-schemas';
import { SyncBailHook, SyncHook, SyncWaterfallHook } from 'tapable';
import { normalizePasses } from '../plugins/MultiPassRendererPlugin';
import { BlendTypes } from '../utils/blend';
import baseLayerSchema from './schema';
/**
 * 分配 layer id
 */
let layerIdCounter = 0;

export default class BaseLayer<ChildLayerStyleOptions = {}> extends EventEmitter
  implements ILayer {
  public id: string = `${layerIdCounter++}`;
  public name: string = `${layerIdCounter++}`;
  public type: string;
  public visible: boolean = true;
  public zIndex: number = 0;
  public minZoom: number;
  public maxZoom: number;
  public inited: boolean = false;
  public layerModelNeedUpdate: boolean = false;
  public pickedFeatureID: number = -1;

  public dataState: IDataState = {
    dataSourceNeedUpdate: false,
    dataMappingNeedUpdate: false,
    filterNeedUpdate: false,
    featureScaleNeedUpdate: false,
    StyleAttrNeedUpdate: false,
  };
  // 生命周期钩子
  public hooks = {
    init: new SyncBailHook<void, boolean | void>(),
    afterInit: new SyncBailHook<void, boolean | void>(),
    beforeRender: new SyncBailHook<void, boolean | void>(),
    beforeRenderData: new SyncWaterfallHook<void | boolean>(['data']),
    afterRender: new SyncHook<void>(),
    beforePickingEncode: new SyncHook<void>(),
    afterPickingEncode: new SyncHook<void>(),
    beforeHighlight: new SyncHook<[number[]]>(['pickedColor']),
    afterHighlight: new SyncHook<void>(),
    beforeSelect: new SyncHook<[number[]]>(['pickedColor']),
    afterSelect: new SyncHook<void>(),
    beforeDestroy: new SyncHook<void>(),
    afterDestroy: new SyncHook<void>(),
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

  @lazyInject(TYPES.ILogService)
  protected readonly logger: ILogService;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IShaderModuleService)
  protected readonly shaderModuleService: IShaderModuleService;

  protected iconService: IIconService;

  protected fontService: IFontService;

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

  constructor(config: Partial<ILayerConfig & ChildLayerStyleOptions> = {}) {
    super();
    this.name = config.name || this.id;
    this.rawConfig = config;
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
  public setContainer(container: Container) {
    this.container = container;
  }

  public getContainer() {
    return this.container;
  }

  public addPlugin(plugin: ILayerPlugin) {
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
    this.configService.setLayerConfig(sceneId, this.id, {});

    // 全局容器服务
    this.iconService = this.container.get<IIconService>(TYPES.IIconService);
    this.fontService = this.container.get<IFontService>(TYPES.IFontService);

    // 场景容器服务
    this.rendererService = this.container.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = this.container.get<ILayerService>(TYPES.ILayerService);
    this.interactionService = this.container.get<IInteractionService>(
      TYPES.IInteractionService,
    );
    this.mapService = this.container.get<IMapService>(TYPES.IMapService);
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
      ({
        attributeName,
        attributeField,
        attributeValues,
        defaultName,
        updateOptions,
      }) => {
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
                this.getLayerConfig()[defaultName || attributeName],
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
    this.inited = true;
    // 更新 model 样式
    this.updateLayerConfig({
      ...(this.getDefaultConfig() as object),
      ...this.rawConfig,
    });
    this.hooks.afterInit.call();
    // 启动动画
    const { animateOption } = this.getLayerConfig();
    if (animateOption?.enable) {
      this.layerService.startAnimate();
      this.aniamateStatus = true;
    }
    this.buildModels();
    // 触发初始化完成事件;
    this.emit('inited');
    this.emit('added');
    return this;
  }

  public color(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    // 设置 color、size、shape、style 时由于场景服务尚未完成（并没有调用 scene.addLayer），因此暂时加入待更新属性列表
    this.pendingStyleAttributes.push({
      attributeName: 'color',
      attributeField: field,
      attributeValues: values,
      defaultName: 'colors',
      updateOptions,
    });
    return this;
  }

  public size(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.pendingStyleAttributes.push({
      attributeName: 'size',
      attributeField: field,
      attributeValues: values,
      updateOptions,
    });
    return this;
  }
  // 对mapping后的数据过滤，scale保持不变
  public filter(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.pendingStyleAttributes.push({
      attributeName: 'filter',
      attributeField: field,
      attributeValues: values,
      updateOptions,
    });
    this.dataState.dataMappingNeedUpdate = true;
    return this;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.pendingStyleAttributes.push({
      attributeName: 'shape',
      attributeField: field,
      attributeValues: values,
      updateOptions,
    });
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
    this.sourceOption = {
      data,
      options,
    };
    return this;
  }

  public setData(data: any, options?: ISourceCFG) {
    this.sourceOption.data = data;
    this.sourceOption.options = options;
    this.hooks.init.call();
    this.buildModels();
    return this;
  }
  public style(
    options: Partial<ChildLayerStyleOptions> & Partial<ILayerConfig>,
  ): ILayer {
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
    }
    return this;
  }
  public scale(field: ScaleTypeName | IScaleOptions, cfg: IScale) {
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
  public render(): ILayer {
    if (this.multiPassRenderer && this.multiPassRenderer.getRenderFlag()) {
      this.multiPassRenderer.render();
    } else {
      this.renderModels();
    }
    return this;
  }

  public active(options: IActiveOption) {
    const activeOption: Partial<ILayerConfig> = {};
    activeOption.enableHighlight = isObject(options) ? true : options;
    if (isObject(options)) {
      activeOption.enableHighlight = true;
      if (options.color) {
        activeOption.highlightColor = options.color;
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
      });
      this.pick({ x, y });
    } else {
      this.updateLayerConfig({
        pickedFeatureID: id,
        highlightColor: isObject(options)
          ? options.color
          : this.getLayerConfig().highlightColor,
      });
      this.interactionService.triggerActive(id);
    }
  }

  public select(option: IActiveOption | false): ILayer {
    const activeOption: Partial<ILayerConfig> = {};
    activeOption.enableSelect = isObject(option) ? true : option;
    if (isObject(option)) {
      activeOption.enableSelect = true;
      if (option.color) {
        activeOption.selectColor = option.color;
      }
    } else {
      activeOption.enableHighlight = !!option;
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
      });
      this.pick({ x, y });
    } else {
      this.updateLayerConfig({
        pickedFeatureID: id,
        selectColor: isObject(options)
          ? options.color
          : this.getLayerConfig().selectColor,
      });
      this.interactionService.triggerSelect(id);
    }
  }
  public setBlend(type: keyof typeof BlendType): void {
    this.updateLayerConfig({
      blend: type,
    });
    this.layerModelNeedUpdate = true;
    this.render();
  }
  public show(): ILayer {
    this.updateLayerConfig({
      visible: true,
    });

    return this;
  }

  public hide(): ILayer {
    this.updateLayerConfig({
      visible: false,
    });
    return this;
  }

  public setIndex(index: number): ILayer {
    this.zIndex = index;
    this.layerService.updateRenderOrder();
    return this;
  }

  public setCurrentPickId(id: number) {
    this.currentPickId = id;
  }

  public getCurrentPickId(): number | null {
    return this.currentPickId;
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

  public setMinZoom(minZoom: number): ILayer {
    this.updateLayerConfig({
      minZoom,
    });
    return this;
  }

  public setMaxZoom(maxZoom: number): ILayer {
    this.updateLayerConfig({
      maxZoom,
    });
    return this;
  }
  /**
   * zoom to layer Bounds
   */
  public fitBounds(): ILayer {
    if (!this.inited) {
      this.updateLayerConfig({
        autoFit: true,
      });
      return this;
    }
    const source = this.getSource();
    const extent = source.extent;
    this.mapService.fitBounds([
      [extent[0], extent[1]],
      [extent[2], extent[3]],
    ]);
    return this;
  }

  public destroy() {
    this.hooks.beforeDestroy.call();

    // 清除所有属性以及关联的 vao
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
    this.models.forEach((model) => model.destroy());

    this.hooks.afterDestroy.call();

    this.removeAllListeners();

    // 解绑图层容器中的服务
    // this.container.unbind(TYPES.IStyleAttributeService);
  }
  public clear() {
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
    this.models.forEach((model) => model.destroy());
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
    this.layerSource = source;
    const bounds = this.mapService.getBounds();
    const zoom = this.mapService.getZoom();
    if (this.layerSource.cluster) {
      this.layerSource.updateClusterData(zoom);
    }
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

  public getConfigSchemaForValidation() {
    if (!this.configSchema) {
      // 相比 allOf, merge 有一些优势
      // @see https://github.com/goodeggs/merge-json-schemas
      this.configSchema = mergeJsonSchemas([
        baseLayerSchema,
        this.getConfigSchema(),
      ]);
    }
    return this.configSchema;
  }

  public pick({ x, y }: { x: number; y: number }) {
    this.interactionService.triggerHover({ x, y });
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

  protected getConfigSchema() {
    throw new Error('Method not implemented.');
  }

  protected buildModels() {
    throw new Error('Method not implemented.');
  }

  protected renderModels() {
    if (this.layerModelNeedUpdate) {
      this.models = this.layerModel.buildModels();
      this.layerModelNeedUpdate = false;
    }
    this.models.forEach((model) => {
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      });
    });
    return this;
  }

  protected getModelType(): unknown {
    throw new Error('Method not implemented.');
  }
  protected getDefaultConfig() {
    return {};
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
