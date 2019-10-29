import {
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  IIconService,
  IInteractionService,
  ILayer,
  ILayerInitializationOptions,
  ILayerPlugin,
  IMapService,
  IModel,
  IModelInitializationOptions,
  IMultiPassRenderer,
  IRendererService,
  IShaderModuleService,
  ISourceCFG,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  lazyInject,
  StyleAttributeField,
  StyleAttributeOption,
  Triangulation,
  TYPES,
} from '@l7/core';
import Source from '@l7/source';
import { isFunction } from 'lodash';
// @ts-ignore
import mergeJsonSchemas from 'merge-json-schemas';
import { SyncBailHook, SyncHook } from 'tapable';
import ConfigSchemaValidationPlugin from '../plugins/ConfigSchemaValidationPlugin';
import DataMappingPlugin from '../plugins/DataMappingPlugin';
import DataSourcePlugin from '../plugins/DataSourcePlugin';
import FeatureScalePlugin from '../plugins/FeatureScalePlugin';
import MultiPassRendererPlugin from '../plugins/MultiPassRendererPlugin';
import PixelPickingPlugin from '../plugins/PixelPickingPlugin';
import RegisterStyleAttributePlugin from '../plugins/RegisterStyleAttributePlugin';
import ShaderUniformPlugin from '../plugins/ShaderUniformPlugin';
import UpdateStyleAttributePlugin from '../plugins/UpdateStyleAttributePlugin';
import baseLayerSchema from './schema';

export interface ILayerModelInitializationOptions {
  moduleName: string;
  vertexShader: string;
  fragmentShader: string;
  triangulation: Triangulation;
}

/**
 * 分配 layer id
 */
let layerIdCounter = 0;

/**
 * Layer 基类默认样式属性
 */
const defaultLayerInitializationOptions: Partial<
  ILayerInitializationOptions
> = {
  enableMultiPassRenderer: true,
  enablePicking: false,
  enableHighlight: false,
  highlightColor: 'red',
};

export default class BaseLayer<ChildLayerStyleOptions = {}> implements ILayer {
  public id: string = `${layerIdCounter++}`;
  public name: string;

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

  // 插件集
  public plugins: ILayerPlugin[] = [
    /**
     * 校验传入参数配置项的正确性
     * @see /dev-docs/ConfigSchemaValidation.md
     */
    new ConfigSchemaValidationPlugin(),
    /**
     * 获取 Source
     */
    new DataSourcePlugin(),
    /**
     * 根据 StyleAttribute 创建 VertexAttribute
     */
    new RegisterStyleAttributePlugin(),
    /**
     * 根据 Source 创建 Scale
     */
    new FeatureScalePlugin(),
    /**
     * 使用 Scale 进行数据映射
     */
    new DataMappingPlugin(),
    /**
     * 负责属性更新
     */
    new UpdateStyleAttributePlugin(),
    /**
     * Multi Pass 自定义渲染管线
     */
    new MultiPassRendererPlugin(),
    /**
     * 传入相机坐标系参数
     */
    new ShaderUniformPlugin(),
    /**
     * 负责拾取过程中 Encode 以及 Highlight 阶段及结束后恢复
     */
    new PixelPickingPlugin(),
  ];
  public sourceOption: {
    data: any;
    options?: ISourceCFG;
  };

  @lazyInject(TYPES.IStyleAttributeService)
  public styleAttributeService: IStyleAttributeService;

  @lazyInject(TYPES.IGlobalConfigService)
  public readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IIconService)
  protected readonly iconService: IIconService;

  @lazyInject(TYPES.IFontService)
  protected readonly fontService: IFontService;

  protected layerSource: Source;

  private encodedData: IEncodeFeature[];

  private configSchema: object;

  /**
   * 保存样式属性
   */
  private styleOptions: Partial<
    ILayerInitializationOptions & ChildLayerStyleOptions
  >;

  @lazyInject(TYPES.IShaderModuleService)
  private readonly shaderModuleService: IShaderModuleService;

  @lazyInject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @lazyInject(TYPES.IMapService)
  private readonly map: IMapService;

  @lazyInject(TYPES.IInteractionService)
  private readonly interactionService: IInteractionService;

  constructor(
    styleOptions: Partial<ILayerInitializationOptions & ChildLayerStyleOptions>,
  ) {
    this.styleOptions = {
      ...defaultLayerInitializationOptions,
      ...styleOptions,
    };
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
    this.hooks.init.call();
    this.buildModels();
    return this;
  }

  public color(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.styleAttributeService.updateStyleAttribute(
      'color',
      {
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
      // @ts-ignore
      updateOptions,
    );
    return this;
  }

  public size(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.styleAttributeService.updateStyleAttribute(
      'size',
      {
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
      // @ts-ignore
      updateOptions,
    );
    return this;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ) {
    this.styleAttributeService.updateStyleAttribute(
      'shape',
      {
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
      // @ts-ignore
      updateOptions,
    );
    return this;
  }

  public source(data: any, options?: ISourceCFG): ILayer {
    this.sourceOption = {
      data,
      options,
    };
    return this;
  }
  public style(options: object): ILayer {
    // @ts-ignore
    this.styleOptions = {
      ...this.styleOptions,
      ...(options as object),
    };
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
  /**
   * zoom to layer Bounds
   */
  public fitBounds(): void {
    const source = this.getSource();
    const extent = source.extent;
    this.map.fitBounds([[extent[0], extent[1]], [extent[2], extent[3]]]);
  }

  public destroy() {
    this.hooks.beforeDestroy.call();

    // 清除所有属性以及关联的 vao
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
    this.models.forEach((model) => model.destroy());

    this.hooks.afterDestroy.call();
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

  protected buildLayerModel(
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
