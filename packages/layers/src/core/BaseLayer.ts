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
import { isFunction, isObject } from 'lodash';
// @ts-ignore
import mergeJsonSchemas from 'merge-json-schemas';
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

  @lazyInject(TYPES.ILogService)
  protected readonly logger: ILogService;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IShaderModuleService)
  protected readonly shaderModuleService: IShaderModuleService;

  protected cameraService: ICameraService;

  protected coordinateService: ICoordinateSystemService;

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

  // private pickingPassRender: IPass<'pixelPicking'>;

  constructor(config: Partial<ILayerConfig & ChildLayerStyleOptions> = {}) {
    super();
    this.name = config.name || this.id;
    this.zIndex = config.zIndex || 0;
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
    // 初始化图层配置项
    const { enableMultiPassRenderer = false } = this.rawConfig;
    this.configService.setLayerConfig(sceneId, this.id, {
      enableMultiPassRenderer,
    });

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
    this.mapService = this.container.get<IMapService>(TYPES.IMapService);
    this.cameraService = this.container.get<ICameraService>(
      TYPES.ICameraService,
    );
    this.coordinateService = this.container.get<ICoordinateSystemService>(
      TYPES.ICoordinateSystemService,
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
    this.updateStyleAttribute('shape', field, values, updateOptions);
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
    if (this.inited) {
      this.layerSource.setData(data, options);
    } else {
      this.on('inited', () => {
        this.layerSource.setData(data, options);
      });
    }

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
      this.styleNeedUpdate = true;
    }
    return this;
  }
  public scale(field: string | IScaleOptions, cfg: IScale) {
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
    // if (
    //   this.needPick() &&
    //   this.multiPassRenderer &&
    //   this.multiPassRenderer.getRenderFlag()
    // ) {
    //   this.multiPassRenderer.render();
    // } else if (this.needPick() && this.multiPassRenderer) {
    //   this.renderModels();
    // } else {
    //   this.renderModels();
    // }
    this.renderModels();
    // this.multiPassRenderer.render();
    // this.renderModels();
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
      });
      this.pick({ x, y });
    } else {
      this.updateLayerConfig({
        pickedFeatureID: id,
        selectColor: isObject(options)
          ? options.color
          : this.getLayerConfig().selectColor,
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
  public setBlend(type: keyof typeof BlendType): void {
    this.updateLayerConfig({
      blend: type,
    });
    this.layerModelNeedUpdate = true;
    this.reRender();
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
    this.layerService.updateRenderOrder();
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
    this.hooks.beforeDestroy.call();
    // 清除sources事件
    this.layerSource.off('update', this.sourceEvent);

    this.multiPassRenderer.destroy();

    // 清除所有属性以及关联的 vao
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
    // this.models.forEach((model) => model.destroy());

    this.hooks.afterDestroy.call();

    this.emit('remove', {
      target: this,
      type: 'remove',
    });

    this.removeAllListeners();

    // 解绑图层容器中的服务
    // this.container.unbind(TYPES.IStyleAttributeService);
  }
  public clear() {
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
  }
  public clearModels() {
    this.models.forEach((model) => model.destroy());
    this.layerModel.clearModels();
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
    const zoom = this.mapService.getZoom();
    if (this.layerSource.cluster) {
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
  public getLegendItems(name: string): any {
    const scale = this.styleAttributeService.getLayerAttributeScale(name);
    if (scale) {
      if (scale.ticks) {
        const items = scale.ticks().map((item: any) => {
          return {
            value: item,
            [name]: scale(item),
          };
        });
        return items;
      } else if (scale.invertExtent) {
        const items = scale.range().map((item: any) => {
          return {
            value: scale.invertExtent(item),
            [name]: item,
          };
        });
        return items;
      }
    } else {
      return [];
    }
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

  public renderModels() {
    if (this.layerModelNeedUpdate && this.layerModel) {
      this.models = this.layerModel.buildModels();
      this.hooks.beforeRender.call();
      this.layerModelNeedUpdate = false;
    }
    this.models.forEach((model) => {
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      });
    });
    return this;
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

    this.emit('dataUpdate');
    this.reRender();
  };

  private reRender() {
    if (this.inited) {
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

  private updateStyleAttribute(
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
}
