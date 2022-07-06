import {
  BlendType,
  gl,
  IAnimateOption,
  IAttribute,
  IBlendOptions,
  ICameraService,
  IElements,
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  IIconService,
  ILayer,
  ILayerConfig,
  ILayerModel,
  ILayerService,
  IMapService,
  IModel,
  IModelUniform,
  IPickingService,
  IRendererService,
  IShaderModuleService,
  IStyleAttributeService,
  ITexture2D,
  ITexture2DInitializationOptions,
  lazyInject,
  Triangulation,
  TYPES,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { color } from 'd3-color';
import { isEqual, isFunction, isNumber, isString } from 'lodash';
import { BlendTypes } from '../utils/blend';

export type styleSingle =
  | number
  | string
  | [string, (single: any) => number]
  | [string, [number, number]];
export type styleOffset =
  | string
  | [number, number]
  | [string, (single: any) => number];
export type styleColor =
  | string
  | [string, (single: any) => string]
  | [string, [string, string]];
export interface IDataTextureFrame {
  data: number[];
  width: number;
  height: number;
}

export interface ICellProperty {
  attr: string;
  count: number;
}

export default class BaseModel<ChildLayerStyleOptions = {}>
  implements ILayerModel {
  public triangulation: Triangulation;

  // style texture data mapping
  public createTexture2D: (
    options: ITexture2DInitializationOptions,
  ) => ITexture2D;

  protected layer: ILayer;
  protected dataTexture: ITexture2D; // 用于数据传递的数据纹理
  protected DATA_TEXTURE_WIDTH: number; // 默认有多少列（宽度）
  protected rowCount: number; // 计算得到的当前数据纹理有多少行（高度）
  protected cacheStyleProperties: {
    // 记录存储上一次样式字段的值
    thetaOffset: styleSingle | undefined;
    opacity: styleSingle | undefined;
    strokeOpacity: styleSingle | undefined;
    strokeWidth: styleSingle | undefined;
    stroke: styleColor | undefined;
    offsets: styleOffset | undefined;
  };
  protected cellLength: number; // 单个 cell 的长度
  protected cellProperties: ICellProperty[]; // 需要进行数据映射的属性集合
  protected cellTypeLayout: number[];
  protected stylePropertyesExist: {
    // 记录 style 属性是否存在的中间变量
    hasThetaOffset: number;
    hasOpacity: number;
    hasStrokeOpacity: number;
    hasStrokeWidth: number;
    hasStroke: number;
    hasOffsets: number;
  };
  protected dataTextureTest: boolean;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  // @lazyInject(TYPES.IIconService)
  // protected readonly iconService: IIconService;

  // @lazyInject(TYPES.IFontService)
  // protected readonly fontService: IFontService;

  // @lazyInject(TYPES.IShaderModuleService)
  protected shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;
  protected iconService: IIconService;
  protected fontService: IFontService;
  protected styleAttributeService: IStyleAttributeService;
  protected mapService: IMapService;
  protected cameraService: ICameraService;
  protected layerService: ILayerService;
  protected pickingService: IPickingService;

  // style texture data mapping

  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);
    this.pickingService = layer
      .getContainer()
      .get<IPickingService>(TYPES.IPickingService);

    this.shaderModuleService = layer
      .getContainer()
      .get<IShaderModuleService>(TYPES.IShaderModuleService);

    this.styleAttributeService = layer
      .getContainer()
      .get<IStyleAttributeService>(TYPES.IStyleAttributeService);
    this.mapService = layer.getContainer().get<IMapService>(TYPES.IMapService);
    this.iconService = layer
      .getContainer()
      .get<IIconService>(TYPES.IIconService);
    this.fontService = layer
      .getContainer()
      .get<IFontService>(TYPES.IFontService);
    this.cameraService = layer
      .getContainer()
      .get<ICameraService>(TYPES.ICameraService);
    this.layerService = layer
      .getContainer()
      .get<ILayerService>(TYPES.ILayerService);

    // 注册 Attribute
    this.registerBuiltinAttributes();
    // 开启动画
    this.startModelAnimate();

    const { createTexture2D } = this.rendererService;
    this.createTexture2D = createTexture2D;
    this.DATA_TEXTURE_WIDTH = 1024; // 数据纹理固定宽度
    this.rowCount = 1;
    this.cellLength = 0;
    this.cellProperties = [];
    this.cacheStyleProperties = {
      thetaOffset: undefined,
      opacity: undefined,
      strokeOpacity: undefined,
      strokeWidth: undefined,
      stroke: undefined,
      offsets: undefined,
    };
    this.stylePropertyesExist = {
      hasThetaOffset: 0,
      hasOpacity: 0,
      hasStrokeOpacity: 0,
      hasStrokeWidth: 0,
      hasStroke: 0,
      hasOffsets: 0,
    };
    this.dataTextureTest = this.layerService.getOESTextureFloat();
    // 只有在不支持数据纹理的情况下进行赋值
    if (!this.dataTextureTest) {
      this.dataTexture = this.createTexture2D({
        // data: new Uint8ClampedArray(4),
        // 使用 Uint8ClampedArray 在 支付宝 环境中可能存在问题 UC 内核对格式有要求 L7 v2.7.18 版本发现
        // Uint8ClampedArray 和 Uint8Array 没有实质性的区别
        data: new Uint8Array(4),
        mag: gl.NEAREST,
        min: gl.NEAREST,
        width: 1,
        height: 1,
      });
    }
  }

  // style datatexture mapping

  /**
   * 清除上一次的计算结果 - 全量清除
   */
  public clearLastCalRes() {
    this.cellProperties = []; // 清空上一次计算的需要进行数据映射的属性集合
    this.cellLength = 0; // 清空上一次计算的 cell 的长度
    this.stylePropertyesExist = {
      // 全量清空上一次是否需要对 style 属性进行数据映射的判断
      hasThetaOffset: 0,
      hasOpacity: 0,
      hasStrokeOpacity: 0,
      hasStrokeWidth: 0,
      hasStroke: 0,
      hasOffsets: 0,
    };
  }

  public getCellTypeLayout() {
    if (this.dataTextureTest) {
      return [
        // 0
        this.rowCount, // 数据纹理有几行
        this.DATA_TEXTURE_WIDTH, // 数据纹理有几列
        0.0,
        0.0,
        // 1
        this.stylePropertyesExist.hasOpacity, // cell 中是否存在 opacity
        this.stylePropertyesExist.hasStrokeOpacity, // cell 中是否存在 strokeOpacity
        this.stylePropertyesExist.hasStrokeWidth, // cell 中是否存在 strokeWidth
        this.stylePropertyesExist.hasStroke, // cell 中是否存在 stroke
        // 2
        this.stylePropertyesExist.hasOffsets, // cell 中是否存在 offsets
        this.stylePropertyesExist.hasThetaOffset, // cell 中是否存在 thetaOffset
        0.0,
        0.0,
        // 3
        0.0,
        0.0,
        0.0,
        1.0,
      ];
    } else {
      return [
        1.0, // 数据纹理有几行
        1.0, // 数据纹理有几列
        0.0,
        0.0,
        0.0, // cell 中是否存在 opacity
        0.0, // cell 中是否存在 strokeOpacity
        0.0, // cell 中是否存在 strokeWidth
        0.0, // cell 中是否存在 stroke
        0.0, // cell 中是否存在 offsets
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        -1.0,
      ];
    }
  }

  /**
   * 判断数据纹理是否需要重新计算 - 根据传入的值进行判断
   * @param options
   * @returns
   */
  public dataTextureNeedUpdate(options: {
    // TODO: thetaOffset 目前只有 lineLayer/arc 使用
    thetaOffset?: styleSingle;
    opacity?: styleSingle;
    strokeOpacity?: styleSingle;
    strokeWidth?: styleSingle;
    stroke?: styleColor;
    offsets?: styleOffset;
    textOffset?: styleOffset;
  }): boolean {
    let isUpdate = false;
    if (!isEqual(options.thetaOffset, this.cacheStyleProperties.thetaOffset)) {
      isUpdate = true;
      this.cacheStyleProperties.thetaOffset = options.thetaOffset;
    }
    if (!isEqual(options.opacity, this.cacheStyleProperties.opacity)) {
      isUpdate = true;
      this.cacheStyleProperties.opacity = options.opacity;
    }
    if (
      !isEqual(options.strokeOpacity, this.cacheStyleProperties.strokeOpacity)
    ) {
      isUpdate = true;
      this.cacheStyleProperties.strokeOpacity = options.strokeOpacity;
    }
    if (!isEqual(options.strokeWidth, this.cacheStyleProperties.strokeWidth)) {
      isUpdate = true;
      this.cacheStyleProperties.strokeWidth = options.strokeWidth;
    }
    if (!isEqual(options.stroke, this.cacheStyleProperties.stroke)) {
      isUpdate = true;
      this.cacheStyleProperties.stroke = options.stroke;
    }
    if (!isEqual(options.offsets, this.cacheStyleProperties.offsets)) {
      isUpdate = true;
      this.cacheStyleProperties.offsets = options.offsets;
    }
    if (this.dataTexture === undefined) {
      isUpdate = true;
    }
    return isUpdate;
  }
  /**
   * 判断当前的样式中哪些是需要进行数据映射的，哪些是常量，同时计算用于构建数据纹理的一些中间变量
   * @param options
   */
  public judgeStyleAttributes(options: {
    // TODO: 目前 thetaOffset 只有 lineLayer/arc 使用
    thetaOffset?: styleSingle;
    opacity?: styleSingle;
    strokeOpacity?: styleSingle;
    strokeWidth?: styleSingle;
    stroke?: styleColor;
    offsets?: styleOffset;
  }) {
    this.clearLastCalRes(); // 清除上一次的计算结果 - 全量清除

    if (options.opacity !== undefined && !isNumber(options.opacity)) {
      // 数据映射
      this.cellProperties.push({ attr: 'opacity', count: 1 });
      this.stylePropertyesExist.hasOpacity = 1;
      this.cellLength += 1;
    }

    if (
      options.strokeOpacity !== undefined &&
      !isNumber(options.strokeOpacity)
    ) {
      // 数据映射
      this.cellProperties.push({ attr: 'strokeOpacity', count: 1 });
      this.stylePropertyesExist.hasStrokeOpacity = 1;
      this.cellLength += 1;
    }

    if (options.strokeWidth !== undefined && !isNumber(options.strokeWidth)) {
      // 数据映射
      this.cellProperties.push({ attr: 'strokeWidth', count: 1 });
      this.stylePropertyesExist.hasStrokeWidth = 1;
      this.cellLength += 1;
    }

    if (options.stroke !== undefined && !this.isStaticColor(options.stroke)) {
      // 数据映射
      this.cellProperties.push({ attr: 'stroke', count: 4 });
      this.stylePropertyesExist.hasStroke = 1;
      this.cellLength += 4;
    }

    if (
      options.offsets !== undefined &&
      !this.isOffsetStatic(options.offsets)
    ) {
      // 数据映射
      this.cellProperties.push({ attr: 'offsets', count: 2 });
      this.stylePropertyesExist.hasOffsets = 1;
      this.cellLength += 2;
    }

    if (options.thetaOffset !== undefined && !isNumber(options.thetaOffset)) {
      // 数据映射
      this.cellProperties.push({ attr: 'thetaOffset', count: 1 });
      this.stylePropertyesExist.hasThetaOffset = 1;
      this.cellLength += 1;
    }
    // console.log('this.cellLength', this.cellLength)
  }

  /**
   * 判断变量 stroke 是否是常量值
   * @param stroke
   * @returns
   */
  public isStaticColor(stroke: styleColor): boolean {
    if (isString(stroke)) {
      if (color(stroke)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  /**
   * 获取 stroke 颜色并做兼容处理
   * @param stroke
   * @returns
   */
  public getStrokeColor(stroke: styleColor) {
    if (this.isStaticColor(stroke)) {
      const strokeColor = rgb2arr(stroke as string);
      strokeColor[0] = strokeColor[0] ? strokeColor[0] : 0;
      strokeColor[1] = strokeColor[1] ? strokeColor[1] : 0;
      strokeColor[2] = strokeColor[2] ? strokeColor[2] : 0;
      strokeColor[3] = strokeColor[3] ? strokeColor[3] : 0;
      return strokeColor;
    } else {
      return [0, 0, 0, 0];
    }
  }

  /**
   * 判断 offsets 是否是常量
   * @param offsets
   * @returns
   */
  public isOffsetStatic(offsets: styleOffset) {
    if (
      Array.isArray(offsets) &&
      offsets.length === 2 &&
      isNumber(offsets[0]) &&
      isNumber(offsets[1])
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 补空位
   * @param d
   * @param count
   */
  public patchMod(d: number[], count: number) {
    for (let i = 0; i < count; i++) {
      d.push(-1);
    }
  }

  /**
   * 根据映射的数据字段往推入数据
   * @param d
   * @param cellData
   * @param cellPropertiesLayouts
   */
  public patchData(
    d: number[],
    cellData: IEncodeFeature,
    cellPropertiesLayouts: ICellProperty[],
  ) {
    for (const layout of cellPropertiesLayouts) {
      const { attr, count } = layout;

      const value = cellData[attr];
      if (value !== undefined) {
        // 数据中存在该属性
        if (attr === 'stroke') {
          d.push(...rgb2arr(value));
        } else if (attr === 'offsets') {
          if (this.isOffsetStatic(value)) {
            d.push(-value[0], value[1]);
          } else {
            d.push(0, 0);
          }
        } else {
          d.push(isNumber(value) ? value : 1.0);
        }
      } else {
        // 若不存在时则补位
        this.patchMod(d, count);
      }
    }
  }

  /**
   * 计算推入数据纹理的数据
   * @param cellLength
   * @param encodeData
   * @param cellPropertiesLayouts
   * @returns
   */
  public calDataFrame(
    cellLength: number,
    encodeData: IEncodeFeature[],
    cellPropertiesLayouts: ICellProperty[],
  ): IDataTextureFrame {
    const encodeDatalength = encodeData.length;
    const rowCount = Math.ceil(
      (encodeDatalength * cellLength) / this.DATA_TEXTURE_WIDTH,
    ); // 有多少行

    const totalLength = rowCount * this.DATA_TEXTURE_WIDTH;
    const d: number[] = [];
    for (let i = 0; i < encodeDatalength; i++) {
      // 根据 encodeData 数据推入数据
      const cellData = encodeData[i];
      this.patchData(d, cellData, cellPropertiesLayouts);
    }
    for (let i = d.length; i < totalLength; i++) {
      // 每行不足的部分用 -1 补足（数据纹理时 width * height 的矩形数据集合）
      d.push(-1);
    }
    // console.log('data', d)
    return { data: d, width: this.DATA_TEXTURE_WIDTH, height: rowCount };
  }

  // style datatexture mapping

  public getBlend(): IBlendOptions {
    const { blend = 'normal' } = this.layer.getLayerConfig();
    return BlendTypes[BlendType[blend]] as IBlendOptions;
  }
  public getDefaultStyle(): unknown {
    return {};
  }
  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public getAnimateUniforms(): IModelUniform {
    return {};
  }

  public needUpdate(): boolean {
    return false;
  }
  public buildModels(): IModel[] {
    throw new Error('Method not implemented.');
  }
  public initModels(): IModel[] {
    throw new Error('Method not implemented.');
  }
  public clearModels() {
    return;
  }
  public getAttribute(): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    throw new Error('Method not implemented.');
  }
  public render() {
    throw new Error('Method not implemented.');
  }
  protected registerBuiltinAttributes() {
    throw new Error('Method not implemented.');
  }
  protected animateOption2Array(option: IAnimateOption): number[] {
    return [
      option.enable ? 0 : 1.0,
      option.duration || 4.0,
      option.interval || 0.2,
      option.trailLength || 0.1,
    ];
  }
  protected startModelAnimate() {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    if (animateOption.enable) {
      this.layer.setAnimateStartTime();
    }
  }
}
