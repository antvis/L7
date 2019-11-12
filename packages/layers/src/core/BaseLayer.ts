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
  // inject,
  // lazyMultiInject,
  StyleAttributeField,
  StyleAttributeOption,
  Triangulation,
  TYPES,
} from '@l7/core';
import Source from '@l7/source';
import { inject, multiInject } from 'inversify';
import { isFunction } from 'lodash';
// @ts-ignore
import mergeJsonSchemas from 'merge-json-schemas';
import { SyncBailHook, SyncHook } from 'tapable';
import { normalizePasses } from '../plugins/MultiPassRendererPlugin';
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
  enableTAA: false,
  jitterScale: 1,
  enableLighting: false,
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

  // 注入插件集
  @multiInject(TYPES.ILayerPlugin)
  public plugins: ILayerPlugin[];

  public sourceOption: {
    data: any;
    options?: ISourceCFG;
  };

  @inject(TYPES.IStyleAttributeService)
  public styleAttributeService: IStyleAttributeService;

  @inject(TYPES.IGlobalConfigService)
  public readonly configService: IGlobalConfigService;

  @inject(TYPES.IIconService)
  protected readonly iconService: IIconService;

  @inject(TYPES.IFontService)
  protected readonly fontService: IFontService;

  protected layerSource: Source;

  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  private encodedData: IEncodeFeature[];

  private configSchema: object;

  /**
   * 保存样式属性
   */
  private styleOptions: Partial<
    ILayerInitializationOptions & ChildLayerStyleOptions
  >;

  @inject(TYPES.IShaderModuleService)
  private readonly shaderModuleService: IShaderModuleService;

  @inject(TYPES.IMapService)
  private readonly map: IMapService;

  @inject(TYPES.IInteractionService)
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
