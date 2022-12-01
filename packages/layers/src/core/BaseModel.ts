import {
  BlendType,
  IAttribute,
  IBlendOptions,
  ICameraService,
  IElements,
  IGlobalConfigService,
  ILayer,
  ILayerModel,
  ILayerService,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class BaseModel<ChildLayerStyleOptions = {}>
  implements ILayerModel
{
  public triangulation: Triangulation;

  // style texture data mapping
  public createTexture2D: (
    options: ITexture2DInitializationOptions,
  ) => ITexture2D;

  protected layer: ILayer;
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

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  protected shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;

  protected styleAttributeService: IStyleAttributeService;
  protected cameraService: ICameraService;
  protected layerService: ILayerService;

  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);

    this.shaderModuleService = layer
      .getContainer()
      .get<IShaderModuleService>(TYPES.IShaderModuleService);

    this.styleAttributeService = layer
      .getContainer()
      .get<IStyleAttributeService>(TYPES.IStyleAttributeService);

    this.registerBuiltinAttributes();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async buildModels(): Promise<IModel[]> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async initModels(): Promise<IModel[]> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public clearModels(refresh = true) {
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
}
