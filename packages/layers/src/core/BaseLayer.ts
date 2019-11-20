import {
  gl,
  IAnimateOption,
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  IIconService,
  IInteractionService,
  ILayer,
  ILayerInitializationOptions,
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
  StyleAttributeField,
  StyleAttributeOption,
  TYPES,
} from '@l7/core';
import Source from '@l7/source';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { isFunction, isObject } from 'lodash';
// @ts-ignore
import mergeJsonSchemas from 'merge-json-schemas';
import { SyncBailHook, SyncHook } from 'tapable';
import { normalizePasses } from '../plugins/MultiPassRendererPlugin';
import baseLayerSchema from './schema';

/**
 * 分配 layer id
 */
let layerIdCounter = 0;

/**
 * Layer 基类默认样式属性
 */
const defaultLayerInitializationOptions: Partial<ILayerInitializationOptions> = {
  minZoom: 0,
  maxZoom: 20,
  visible: true,
  zIndex: 0,
  enableMultiPassRenderer: false,
  enablePicking: false,
  enableHighlight: false,
  highlightColor: 'red',
  enableTAA: false,
  jitterScale: 1,
  enableLighting: false,
};

export default class BaseLayer<ChildLayerStyleOptions = {}> extends EventEmitter
  implements ILayer {
  public id: string = `${layerIdCounter++}`;
  public name: string;
  public visible: boolean = true;
  public zIndex: number = 0;
  public minZoom: number;
  public maxZoom: number;

  // 生命周期钩子
  public hooks = {
    init: new SyncBailHook<void, boolean | void>(),
    beforeRender: new SyncBailHook<void, boolean | void>(),
    afterRender: new SyncHook<void>(),
    beforePickingEncode: new SyncHook<void>(),
    afterPickingEncode: new SyncHook<void>(),
    beforeHighlight: new SyncHook<[number[]]>(['pickedColor']),
    afterHighlight: new SyncHook<void>(),
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

  protected styleAttributeService: IStyleAttributeService;

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

  protected layerSource: Source;

  protected postProcessingPassFactory: (
    name: string,
  ) => IPostProcessingPass<unknown>;
  protected normalPassFactory: (name: string) => IPass<unknown>;

  protected layerModel: ILayerModel;

  protected enodeOptions: {
    [type: string]: {
      field: StyleAttributeField;
      values?: StyleAttributeOption;
    };
  } = {};

  protected animateOptions: IAnimateOption = { enable: false };

  /**
   * 图层容器
   */
  private container: Container;

  private encodedData: IEncodeFeature[];

  private configSchema: object;

  /**
   * 保存样式属性
   */
  private styleOptions: Partial<
    ILayerInitializationOptions & ChildLayerStyleOptions
  >;

  /**
   * 待更新样式属性，在初始化阶段完成注册
   */
  private pendingStyleAttributes: Array<{
    attributeName: string;
    attributeOptions: Partial<IStyleAttributeInitializationOptions>;
    updateOptions?: Partial<IStyleAttributeUpdateOptions>;
  }> = [];

  private scaleOptions: IScaleOptions = {};

  constructor(
    styleOptions: Partial<ILayerInitializationOptions & ChildLayerStyleOptions>,
  ) {
    super();
    this.styleOptions = {
      ...defaultLayerInitializationOptions,
      ...styleOptions,
    };
    const { minZoom, maxZoom, zIndex, visible } = this
      .styleOptions as ILayerInitializationOptions;
    this.visible = visible;
    this.zIndex = zIndex;
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
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
      ({ attributeName, attributeOptions, updateOptions }) => {
        this.styleAttributeService.updateStyleAttribute(
          attributeName,
          attributeOptions,
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
    this.buildModels();
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
      attributeOptions: {
        // @ts-ignore
        scale: {
          field,
          ...this.splitValuesAndCallbackInAttribute(
            // @ts-ignore
            values,
            this.configService.getConfig().colors,
          ),
        },
      },
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
      attributeOptions: {
        // @ts-ignore
        scale: {
          field,
          ...this.splitValuesAndCallbackInAttribute(
            // @ts-ignore
            values,
            this.configService.getConfig().size,
          ),
        },
      },
      updateOptions,
    });
    return this;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.enodeOptions.shape = {
      field,
      values,
    };
    this.pendingStyleAttributes.push({
      attributeName: 'shape',
      attributeOptions: {
        // @ts-ignore
        scale: {
          field,
          ...this.splitValuesAndCallbackInAttribute(
            // @ts-ignore
            values,
            this.configService.getConfig().shape,
          ),
        },
      },
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
      attributeOptions: {
        // @ts-ignore
        scale: {
          field,
          ...this.splitValuesAndCallbackInAttribute(
            // @ts-ignore
            values,
            null,
          ),
        },
      },
      updateOptions,
    });
    return this;
  }
  public animate(options: IAnimateOption) {
    this.animateOptions = options;
    return this;
  }

  public source(data: any, options?: ISourceCFG): ILayer {
    this.sourceOption = {
      data,
      options,
    };
    return this;
  }
  public style(options: object & Partial<ILayerInitializationOptions>): ILayer {
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

    this.styleOptions = {
      ...this.styleOptions,
      ...rest,
    };
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
    if (this.multiPassRenderer && this.multiPassRenderer.getRenderFlag()) {
      this.multiPassRenderer.render();
    } else {
      this.renderModels();
    }
    return this;
  }

  public show(): ILayer {
    this.visible = true;
    this.layerService.renderLayers();
    return this;
  }

  public hide(): ILayer {
    this.visible = false;
    this.layerService.renderLayers();
    return this;
  }

  public setIndex(index: number): ILayer {
    this.zIndex = index;
    this.layerService.updateRenderOrder();
    return this;
  }

  public isVisible(): boolean {
    const zoom = this.mapService.getZoom();
    return this.visible && zoom >= this.minZoom && zoom <= this.maxZoom;
  }

  public setMinZoom(min: number): ILayer {
    this.minZoom = min;
    return this;
  }

  public setMaxZoom(max: number): ILayer {
    this.maxZoom = max;
    return this;
  }
  /**
   * zoom to layer Bounds
   */
  public fitBounds(): void {
    const source = this.getSource();
    const extent = source.extent;
    this.mapService.fitBounds([
      [extent[0], extent[1]],
      [extent[2], extent[3]],
    ]);
  }

  public destroy() {
    this.hooks.beforeDestroy.call();

    // 清除所有属性以及关联的 vao
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
    this.models.forEach((model) => model.destroy());

    this.hooks.afterDestroy.call();

    // 解绑图层容器中的服务
    // this.container.unbind(TYPES.IStyleAttributeService);
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
  }
  public getSource() {
    return this.layerSource;
  }

  public getStyleOptions() {
    return this.styleOptions;
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
      blend: {
        enable: true,
        func: {
          srcRGB: gl.SRC_ALPHA,
          srcAlpha: 1,
          dstRGB: gl.ONE_MINUS_SRC_ALPHA,
          dstAlpha: 1,
        },
      },
      ...rest,
    });
  }

  protected getConfigSchema() {
    throw new Error('Method not implemented.');
  }

  protected buildModels() {
    throw new Error('Method not implemented.');
  }

  protected renderModels() {
    throw new Error('Method not implemented.');
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
