import {
  IGlobalConfigService,
  IIconService,
  ILayer,
  ILayerInitializationOptions,
  ILayerPlugin,
  ILayerStyleAttribute,
  ILayerStyleOptions,
  IModel,
  IMultiPassRenderer,
  IRendererService,
  ISource,
  lazyInject,
  StyleAttributeField,
  StyleAttributeOption,
  TYPES,
} from '@l7/core';
import Source, { ISourceCFG } from '@l7/source';
import { isFunction } from 'lodash';
import { SyncHook } from 'tapable';
import DataEncodePlugin from '../plugins/DataEncodePlugin';
import DataSourcePlugin from '../plugins/DataSourcePlugin';
import MultiPassRendererPlugin from '../plugins/MultiPassRendererPlugin';
import ShaderUniformPlugin from '../plugins/ShaderUniformPlugin';
import StyleAttribute from './StyleAttribute';

export default class BaseLayer implements ILayer {
  public name: string;

  // 生命周期钩子
  public hooks = {
    init: new SyncHook(['layer']),
    beforeRender: new SyncHook(['layer']),
    afterRender: new SyncHook(['layer']),
  };

  // 待渲染 model 列表
  public models: IModel[] = [];

  // 每个 Layer 都有一个
  public multiPassRenderer: IMultiPassRenderer;

  // 插件集
  public plugins: ILayerPlugin[] = [
    new DataSourcePlugin(),
    new DataEncodePlugin(),
    new MultiPassRendererPlugin(),
    new ShaderUniformPlugin(),
  ];
  public sourceOption: {
    data: any;
    options?: ISourceCFG;
  };
  public styleOption: ILayerStyleOptions = {
    opacity: 1.0,
  };
  // 样式属性
  public styleAttributes: {
    [key: string]: Required<ILayerStyleAttribute>;
  } = {};

  protected layerSource: Source;

  private encodedData: Array<{ [key: string]: unknown }>;
  private initializationOptions: Partial<ILayerInitializationOptions>;

  @lazyInject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @lazyInject(TYPES.IIconService)
  private readonly iconService: IIconService;

  constructor(initializationOptions: Partial<ILayerInitializationOptions>) {
    this.initializationOptions = initializationOptions;
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
  ): ILayer {
    this.createStyleAttribute(
      'color',
      field,
      values,
      this.configService.getConfig().colors,
    );
    return this;
  }

  public size(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
  ): ILayer {
    this.createStyleAttribute(
      'size',
      field,
      values,
      this.configService.getConfig().size,
    );
    return this;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
  ): ILayer {
    this.createStyleAttribute(
      'shape',
      field,
      values,
      this.configService.getConfig().shape,
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
  public style(options: ILayerStyleOptions): ILayer {
    this.styleOption = options; // TODO: merge 默认同类型
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
    this.models.forEach((model) => model.destroy());
  }

  public getStyleAttributes(): {
    [key: string]: Required<ILayerStyleAttribute>;
  } {
    return this.styleAttributes;
  }

  public setSource(source: Source) {
    this.layerSource = source;
  }
  public getSource() {
    return this.layerSource;
  }

  public getInitializationOptions() {
    return this.initializationOptions;
  }

  public setEncodedData(encodedData: Array<{ [key: string]: unknown }>) {
    this.encodedData = encodedData;
  }

  public getEncodedData() {
    return this.encodedData;
  }

  protected buildModels() {
    throw new Error('Method not implemented.');
  }

  protected renderModels() {
    throw new Error('Method not implemented.');
  }

  private createStyleAttribute(
    attributeName: string,
    field: StyleAttributeField,
    valuesOrCallback: any,
    defaultValues: any,
  ) {
    this.styleAttributes[attributeName] = new StyleAttribute({
      field,
      values: isFunction(valuesOrCallback)
        ? undefined
        : valuesOrCallback || defaultValues,
      callback: isFunction(valuesOrCallback) ? valuesOrCallback : undefined,
    });
  }
}
