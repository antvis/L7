import {
  IEncodeFeature,
  IGlobalConfigService,
  IIconService,
  ILayer,
  ILayerInitializationOptions,
  ILayerPlugin,
  IModel,
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
import { SyncHook } from 'tapable';
import DataMappingPlugin from '../plugins/DataMappingPlugin';
import DataSourcePlugin from '../plugins/DataSourcePlugin';
import FeatureScalePlugin from '../plugins/FeatureScalePlugin';
import MultiPassRendererPlugin from '../plugins/MultiPassRendererPlugin';
import PixelPickingPlugin from '../plugins/PixelPickingPlugin';
import RegisterStyleAttributePlugin from '../plugins/RegisterStyleAttributePlugin';
import ShaderUniformPlugin from '../plugins/ShaderUniformPlugin';
import UpdateStyleAttributePlugin from '../plugins/UpdateStyleAttributePlugin';

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
    init: new SyncHook(['layer']),
    beforeRender: new SyncHook(['layer']),
    afterRender: new SyncHook(['layer']),
    beforePickingEncode: new SyncHook(['layer']),
    afterPickingEncode: new SyncHook(['layer']),
    // @ts-ignore
    beforeHighlight: new SyncHook(['layer', 'pickedColor']),
    afterHighlight: new SyncHook(['layer']),
    beforeDestroy: new SyncHook(['layer']),
    afterDestroy: new SyncHook(['layer']),
  };

  // 待渲染 model 列表
  public models: IModel[] = [];

  // 每个 Layer 都有一个
  public multiPassRenderer: IMultiPassRenderer;

  // 插件集
  public plugins: ILayerPlugin[] = [
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

  @lazyInject(TYPES.IIconService)
  protected readonly iconService: IIconService;

  protected layerSource: Source;

  private encodedData: IEncodeFeature[];

  /**
   * 保存样式属性
   */
  private styleOptions: Partial<
    ILayerInitializationOptions & ChildLayerStyleOptions
  >;

  @lazyInject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IShaderModuleService)
  private readonly shaderModuleService: IShaderModuleService;

  @lazyInject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

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
    this.hooks.init.call(this);
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

  public size(field: StyleAttributeField, values?: StyleAttributeOption) {
    return this;
  }

  public shape(field: StyleAttributeField, values?: StyleAttributeOption) {
    return this;
  }

  public source(data: any, options?: ISourceCFG): ILayer {
    this.sourceOption = {
      data,
      options,
    };
    return this;
  }
  public style(options: unknown): ILayer {
    // @ts-ignore
    this.styleOptions = {
      ...this.styleOptions,
      ...options,
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

  public destroy() {
    this.hooks.beforeDestroy.call(this);

    // 清除所有属性以及关联的 vao
    this.styleAttributeService.clearAllAttributes();
    // 销毁所有 model
    this.models.forEach((model) => model.destroy());

    this.hooks.afterDestroy.call(this);
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

  protected buildLayerModel(options: ILayerModelInitializationOptions): IModel {
    const { moduleName, vertexShader, fragmentShader, triangulation } = options;
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
    });
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
