// @ts-ignore
import {
  AsyncSeriesBailHook,
  AsyncWaterfallHook,
  SyncBailHook,
  SyncHook,
} from '@antv/async-hook';
import {
  BlendType,
  IActiveOption,
  IAnimateOption,
  IAttributeAndElements,
  ICameraService,
  ICoordinateSystemService,
  IDataState,
  IDebugLog,
  IDebugService,
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  IIconService,
  IInteractionService,
  ILayer,
  ILayerAttributesOption,
  ILayerConfig,
  ILayerModel,
  ILayerModelInitializationOptions,
  ILayerPickService,
  ILayerPlugin,
  ILayerService,
  ILayerStage,
  ILegend,
  ILegendClassificaItem,
  ILegendSegmentItem,
  IMapService,
  IModel,
  IModelInitializationOptions,
  IMultiPassRenderer,
  IParseDataItem,
  IPass,
  IPickingService,
  IPostProcessingPass,
  IRendererService,
  IRenderOptions,
  IScale,
  IScaleOptions,
  IShaderModuleService,
  ISourceCFG,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  ITextureService,
  LayerEventType,
  lazyInject,
  LegendItems,
  StyleAttributeField,
  StyleAttributeOption,
  Triangulation,
  TYPES,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { encodePickingColor } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import {
  isEqual,
  isFunction,
  isNumber,
  isObject,
  isPlainObject,
  isUndefined,
} from 'lodash';
import { BlendTypes } from '../utils/blend';
import { calculateData } from '../utils/layerData';
import {
  createMultiPassRenderer,
  normalizePasses,
} from '../utils/multiPassRender';
import LayerPickService from './LayerPickService';
import TextureService from './TextureService';
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
  public selectedFeatureID: number | null = null;
  public styleNeedUpdate: boolean = false;
  public rendering: boolean;
  public forceRender: boolean = false;
  public clusterZoom: number = 0; // 聚合等级标记
  public layerType?: string | undefined;
  public triangulation?: Triangulation | undefined;
  public layerPickService: ILayerPickService;
  public textureService: ITextureService;

  public defaultSourceConfig: {
    data: any[];
    options: ISourceCFG | undefined;
  } = {
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

  public sourceOption: {
    data: any;
    options?: ISourceCFG;
  };

  public layerModel: ILayerModel;

  public shapeOption: {
    field: any;
    values: any;
  };

  // 记录 sceneContainer 供创建子图层的时候使用 如 imageTileLayer
  public sceneContainer: Container | undefined;
  public tileLayer: any | undefined;
  // 用于保存子图层对象
  public layerChildren: ILayer[] = [];
  public masks: ILayer[] = [];

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  protected shaderModuleService: IShaderModuleService;
  protected cameraService: ICameraService;

  protected coordinateService: ICoordinateSystemService;

  protected iconService: IIconService;

  protected fontService: IFontService;

  protected pickingService: IPickingService;

  protected rendererService: IRendererService;

  protected layerService: ILayerService;

  protected debugService: IDebugService;

  protected interactionService: IInteractionService;

  protected mapService: IMapService;

  public styleAttributeService: IStyleAttributeService;

  protected layerSource: Source;

  public postProcessingPassFactory: (
    name: string,
  ) => IPostProcessingPass<unknown>;
  public normalPassFactory: (name: string) => IPass<unknown>;

  protected animateOptions: IAnimateOption = { enable: false };

  /**
   * 图层容器
   */
  protected container: Container;

  private encodedData: IEncodeFeature[];

  private currentPickId: number | null = null;

  protected rawConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  private needUpdateConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  public encodeStyleAttribute: Record<string, any> = {};

  // Shader 的数据映射
  public enableShaderEncodeStyles: string[] = [];

  // 数据层数据映射

  public enableDataEncodeStyles: string[] = [];

  public enablg: string[] = [];

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

  private scaleOptions: IScaleOptions = {};

  private animateStartTime: number;

  private animateStatus: boolean = false;

  private isDestroyed: boolean = false;

  // private pickingPassRender: IPass<'pixelPicking'>;

  constructor(config: Partial<ILayerConfig & ChildLayerStyleOptions> = {}) {
    super();
    this.name = config.name || this.id;
    this.zIndex = config.zIndex || 0;
    this.rawConfig = config;
  }
  public addMask(layer: ILayer): void {
    this.masks.push(layer);
    this.enableMask();
  }

  public removeMask(layer: ILayer): void {
    const layerIndex = this.masks.indexOf(layer);
    if (layerIndex > -1) {
      this.masks.splice(layerIndex, 1);
    }
  }

  public disableMask(): void {
    this.updateLayerConfig({
      enableMask: false,
    });
  }

  public enableMask(): void {
    this.updateLayerConfig({
      enableMask: true,
    });
  }
  // 将废弃
  public addMaskLayer(maskLayer: ILayer) {
    this.masks.push(maskLayer);
  }
  // 将废弃
  public removeMaskLayer(maskLayer: ILayer) {
    const layerIndex = this.masks.indexOf(maskLayer);
    if (layerIndex > -1) {
      this.masks.splice(layerIndex, 1);
    }
    maskLayer.destroy();
  }

  public getAttribute(name: string) {
    return this.styleAttributeService.getLayerStyleAttribute(name);
  }

  public getLayerConfig<T = any>() {
    return this.configService.getLayerConfig<ChildLayerStyleOptions & T>(
      this.id,
    );
  }

  public updateLayerConfig(
    configToUpdate: Partial<ILayerConfig | ChildLayerStyleOptions>,
  ) {
    // 同步 rawConfig
    Object.keys(configToUpdate).map((key) => {
      if (key in this.rawConfig) {
        // @ts-ignore
        this.rawConfig[key] = configToUpdate[key];
      }
    });
    if (!this.startInit) {
      this.needUpdateConfig = {
        ...this.needUpdateConfig,
        ...configToUpdate,
      };
    } else {
      const sceneId = this.container.get<string>(TYPES.SceneID);
      // @ts-ignore
      // styleDataMapping(configToUpdate, this); // 处理 style 中进行数据映射的属性字段
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

  public addPlugin(plugin: ILayerPlugin): ILayer {
    this.plugins.push(plugin);
    return this;
  }

  public async init(): Promise<void> {
    // 设置配置项
    const sceneId = this.container.get<string>(TYPES.SceneID);
    this.startInit = true;
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
    this.debugService = this.container.get<IDebugService>(TYPES.IDebugService);
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
    if (enableMultiPassRenderer) {
      // 按需初始化 瓦片频繁报错
      this.multiPassRenderer = this.container.get<IMultiPassRenderer>(
        TYPES.IMultiPassRenderer,
      );
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
    // @ts-ignore 瓦片、瓦片图层目前不参与日志
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

  public createModelData(data: any, option?: ISourceCFG) {
    if (this.layerModel?.createModelData) {
      // 在某些特殊图层中单独构建 attribute & elements
      return this.layerModel.createModelData(option);
    }
    const calEncodeData = this.calculateEncodeData(data, option);
    const triangulation = this.triangulation;

    if (calEncodeData && triangulation) {
      return this.styleAttributeService.createAttributesAndIndices(
        calEncodeData,
        triangulation,
      );
    } else {
      return {
        attributes: undefined,
        elements: undefined,
      };
    }
  }
  public setLayerPickService(layerPickService: ILayerPickService): void {
    this.layerPickService = layerPickService;
  }

  public calculateEncodeData(data: any, option?: ISourceCFG) {
    if (this.inited) {
      return calculateData(
        this,
        this.fontService,
        this.mapService,
        this.styleAttributeService,
        data,
        option,
      );
    } else {
      console.warn('layer not inited!');
      return null;
    }
  }
  /**
   * Model初始化前需要更新Model样式
   */
  public prepareBuildModel() {
    if (Object.keys(this.needUpdateConfig || {}).length !== 0) {
      this.updateLayerConfig({});
    }

    // 启动动画
    const { animateOption } = this.getLayerConfig();
    if (animateOption?.enable) {
      this.layerService.startAnimate();
      this.animateStatus = true;
    }
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
    const flag = this.updateStyleAttribute(
      'filter',
      field,
      values,
      updateOptions,
    );
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
    const flag = this.updateStyleAttribute(
      'shape',
      field,
      values,
      updateOptions,
    );
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
      this.log(IDebugLog.SourceInitStart, ILayerStage.UPDATE);
      this.layerSource.setData(data, options);
      this.log(IDebugLog.SourceInitEnd, ILayerStage.UPDATE);
    } else {
      this.on('inited', () => {
        this.log(IDebugLog.SourceInitStart, ILayerStage.UPDATE);
        const currentSource = this.getSource();
        if (!currentSource) {
          // 执行 setData 的时候 source 还不存在（还未执行 addLayer）
          this.source(new Source(data, options));
        } else {
          this.layerSource.setData(data, options);
        }
        this.layerSource.once('update', () => {
          this.log(IDebugLog.SourceInitEnd, ILayerStage.UPDATE);
        });
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

    // 兼容老版本的写法 ['field, 'value']
    const newOption: { [key: string]: any } = rest;
    Object.keys(rest).forEach((key: string) => {
      // @ts-ignore
      const values = rest[key];
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
        [
          ...this.enableShaderEncodeStyles,
          ...this.enableDataEncodeStyles,
        ].includes(key) &&
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
    const preOption = { ...this.scaleOptions };
    if (isObject(field)) {
      this.scaleOptions = {
        ...this.scaleOptions,
        ...field,
      };
    } else {
      this.scaleOptions[field] = cfg;
    }
    if (this.styleAttributeService && !isEqual(preOption, this.scaleOptions)) {
      const scaleOptions = isObject(field) ? field : { [field]: cfg };
      this.styleAttributeService.updateScaleAttribute(scaleOptions);
    }

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
   * renderMultiPass 专门用于渲染支持 multipass 的 layer
   */
  public async renderMultiPass() {
    if (this.encodeDataLength <= 0 && !this.forceRender) {
      return;
    }
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
      this.hooks.beforeHighlight
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
    // this.layerModelNeedUpdate = true;
    this.reRender();
    return this;
  }
  public show(): ILayer {
    this.updateLayerConfig({
      visible: true,
    });
    this.reRender();
    this.emit('show');
    return this;
  }

  public hide(): ILayer {
    this.updateLayerConfig({
      visible: false,
    });
    this.reRender();
    this.emit('hide');
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
    return !!visible && zoom >= minZoom && zoom < maxZoom;
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

  public destroy(refresh = true) {
    if (this.isDestroyed) {
      return;
    }
    // remove child layer
    this.layerChildren.map((child: ILayer) => child.destroy(false));
    this.layerChildren = [];

    // remove mask list maskfence 掩膜需要销毁
    const { maskfence } = this.getLayerConfig();
    if (maskfence) {
      this.masks.map((mask: ILayer) => mask.destroy(false));
      this.masks = [];
    }

    this.hooks.beforeDestroy.call();
    // 清除sources事件
    this.layerSource.off('update', this.sourceEvent);

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
    // 解绑图层容器中的服务
    // this.container.unbind(TYPES.IStyleAttributeService);
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
    return !!(
      this.styleAttributeService.getLayerStyleAttributes() || []
    ).filter(
      (attribute) =>
        attribute.needRescale ||
        attribute.needRemapping ||
        attribute.needRegenerateVertices,
    ).length;
  }
  // 外部初始化Source
  public setSource(source: Source) {
    // 解除原 sources 事件
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
    if (this.layerSource.inited) {
      this.sourceEvent();
    }
    // this.layerSource.inited 为 true update 事件不会再触发
    this.layerSource.on('update', ({ type }) => {
      if (this.coordCenter === undefined) {
        const layerCenter = this.layerSource.center;
        this.coordCenter = layerCenter;
        if (this.mapService?.setCoordCenter) {
          this.mapService.setCoordCenter(layerCenter);
        }
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
    });
  }
  public getSource() {
    return this.layerSource;
  }

  public getScaleOptions() {
    return this.scaleOptions;
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
    return this.styleAttributeService.getLayerAttributeScale(name);
  }

  public getLegend(name: string): ILegend {
    const attribute = this.styleAttributeService.getLayerStyleAttribute(name);
    const scales = attribute?.scale?.scalers || [];

    return {
      type: scales[0].option?.type,
      field: attribute?.scale?.field,
      items: this.getLegendItems(name),
    };
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

  public async buildLayerModel(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ): Promise<IModel> {
    const {
      moduleName,
      vertexShader,
      fragmentShader,
      inject,
      triangulation,
      segmentNumber,
      ...rest
    } = options;
    this.shaderModuleService.registerModule(moduleName, {
      vs: vertexShader,
      fs: fragmentShader,
      inject,
    });
    const { vs, fs, uniforms } = this.shaderModuleService.getModule(moduleName);
    const { createModel } = this.rendererService;
    return new Promise((resolve) => {
      // console.log(this.encodedData)
      const { attributes, elements, count } =
        this.styleAttributeService.createAttributesAndIndices(
          this.encodedData,
          triangulation,
          segmentNumber,
        );
      const modelOptions = {
        attributes,
        uniforms,
        fs,
        vs,
        elements,
        blend: BlendTypes[BlendType.normal],
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
    if (this.animateStatus) {
      this.layerService.stopAnimate();
      this.animateStatus = false;
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
    const { enableHighlight = true, enableSelect = true } =
      this.getLayerConfig();
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

  public async buildModels() {
    throw new Error('Method not implemented.');
  }
  public async rebuildModels() {
    await this.buildModels();
  }

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
    if (
      [
        'color',
        'size',
        'texture',
        'rotate',
        'filter',
        'label',
        'shape',
      ].indexOf(type) !== -1
    ) {
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
   * 继承空方法
   * @param time
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setEarthTime(time: number) {
    console.warn('empty fn');
  }

  // 数据处理 在数据进行 mapping 生成 encodeData 之前对数据进行处理
  // 在各个 layer 中继承
  public processData(filterData: IParseDataItem[]) {
    return filterData;
  }

  public getModelType(): string {
    throw new Error('Method not implemented.');
  }
  protected getDefaultConfig() {
    return {};
  }

  protected sourceEvent = () => {
    this.dataState.dataSourceNeedUpdate = true;
    const layerConfig = this.getLayerConfig();
    if (layerConfig && layerConfig.autoFit) {
      this.fitBounds(layerConfig.fitBoundsOptions);
    }
    const autoRender = this.layerSource.getSourceCfg().autoRender;
    if (autoRender) {
      this.reRender();
    }
  };

  protected async initLayerModels() {
    this.models.forEach((model) => model.destroy());
    this.models = [];
    this.models = await this.layerModel.initModels();
  }

  protected reRender() {
    if (this.inited) {
      this.layerService.reRender();
    }
  }
  protected splitValuesAndCallbackInAttribute(
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
