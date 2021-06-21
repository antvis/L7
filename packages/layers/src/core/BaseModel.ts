import {
  BlendType,
  IAnimateOption,
  IAttribute,
  IBlendOptions,
  ICameraService,
  IElements,
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
  IRendererService,
  IShaderModuleService,
  IStyleAttributeService,
  ITexture2D,
  ITexture2DInitializationOptions,
  lazyInject,
  Triangulation,
  TYPES,
} from '@antv/l7-core';
import { isColor, rgb2arr } from '@antv/l7-utils';
import { BlendTypes } from '../utils/blend';
interface ICellProperty {
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
  protected DATA_TEXTURE_WIDTH: number; // 默认有多少列（宽度）
  protected rowCount: number; // 计算得到的当前数据纹理有多少行（高度）
  protected curretnOpacity: any = ''; // 当前的 opacity 值
  protected curretnStrokeOpacity: any = ''; // 当前的 strokeOpacity 值
  protected currentStrokeColor: any = ''; // 当前的 strokeColor 值
  protected currentStrokeWidth: any = ''; // 当前的 strokeWidth 值
  protected currentOffsets: any = ''; // 当前的 strokeOffsets 值
  protected cellLength: number; // 单个 cell 的长度
  protected cellProperties: ICellProperty[]; // 需要进行数据映射的属性集合
  protected hasOpacity: number = 0;
  protected hasStrokeOpacity: number = 0;
  protected hasStrokeWidth: number = 0;
  protected hasStroke: number = 0;
  protected hasOffsets: number = 0;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  // @lazyInject(TYPES.IIconService)
  // protected readonly iconService: IIconService;

  // @lazyInject(TYPES.IFontService)
  // protected readonly fontService: IFontService;

  @lazyInject(TYPES.IShaderModuleService)
  protected readonly shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;
  protected iconService: IIconService;
  protected fontService: IFontService;
  protected styleAttributeService: IStyleAttributeService;
  protected mapService: IMapService;
  protected cameraService: ICameraService;
  protected layerService: ILayerService;

  // style texture data mapping

  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);
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
  }

  // style datatexture mapping

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
  public patchData(d: number[], cellData: any, cellPropertiesLayouts: any) {
    for (const layout of cellPropertiesLayouts) {
      const { attr, count } = layout;
      if (!cellData) {
        if (attr === 'stroke') {
          d.push(-1, -1, -1, -1);
        } else if (attr === 'offsets') {
          d.push(-1, -1);
        } else {
          d.push(-1);
        }
      } else {
        const value = cellData[attr];

        if (value) {
          // 数据中存在该属性
          if (attr === 'stroke') {
            d.push(...rgb2arr(value));
          } else if (attr === 'offsets') {
            // d.push(...value)
            d.push(-value[0], value[1]);
          } else {
            d.push(value);
          }
        } else {
          // 若不存在时则补位
          this.patchMod(d, count);
        }
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
    encodeData: any,
    cellPropertiesLayouts: any,
  ): any {
    if (cellLength > this.DATA_TEXTURE_WIDTH) {
      // console.log('failed');
      return false;
    }

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
