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
  IInject,
  ILayer,
  ILayerConfig,
  ILayerModel,
  ILayerService,
  IMapService,
  IModel,
  IModelUniform,
  IPickingService,
  IRendererService,
  IRenderOptions,
  IShaderModuleService,
  IStencilOptions,
  IStyleAttributeService,
  ITexture2D,
  ITexture2DInitializationOptions,
  lazyInject,
  MaskOperation,
  StencilType,
  Triangulation,
  TYPES,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { BlendTypes } from '../utils/blend';
import { getStencil, getStencilMask } from '../utils/stencil';
import { getCommonStyleAttributeOptions } from './CommonStyleAttribute';

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
  public preStyleAttribute: Record<string, any> = {};
  protected encodeStyleAttribute: Record<string, boolean> = {};
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
  protected stylePropertiesExist: {
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
    // 初始化支持数据映射的 Style 属性

    this.registerStyleAttribute();
    // 注册 Attribute
    this.registerBuiltinAttributes();
    // 开启动画
    this.startModelAnimate();

    const { createTexture2D } = this.rendererService;
    this.createTexture2D = createTexture2D;
  }

  // style datatexture mapping

  public getBlend(): IBlendOptions {
    const { blend = 'normal' } = this.layer.getLayerConfig();
    return BlendTypes[BlendType[blend]] as IBlendOptions;
  }
  public getStencil(option: Partial<IRenderOptions>): Partial<IStencilOptions> {
    const {
      mask = false,
      maskInside = true,
      enableMask,
      maskOperation = MaskOperation.AND,
    } = this.layer.getLayerConfig();
    // TODO 临时处理，后期移除MaskLayer
    if (this.layer.type === 'MaskLayer') {
      return getStencilMask({
        isStencil: true,
        stencilType: StencilType.SINGLE,
      }); // 用于遮罩的stencil 参数
    }

    if (option.isStencil) {
      return getStencilMask({ ...option, maskOperation }); // 用于遮罩的stencil 参数
    }

    const maskflag =
      mask || //  mask 兼容历史写法
      (enableMask && this.layer.masks.length !== 0) || // 外部图层的mask
      this.layer.tileMask !== undefined; // 瓦片图层
    // !!(mask || enableMask || this.layer.tileMask);
    return getStencil(maskflag, maskInside);
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

  public async needUpdate(): Promise<boolean> {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(renderOptions?: Partial<IRenderOptions>): void {
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

  protected getInject(): IInject {
    const encodeStyleAttribute = this.layer.encodeStyleAttribute;
    let str = '';
    const attrType: { [key: string]: any } = {
      opacity: 'float',
      stroke: 'vec4',
      offsets: 'vec2',
      textOffset: 'vec2',
    };
    this.layer.enableShaderEncodeStyles.forEach((key: string) => {
      if (encodeStyleAttribute[key]) {
        str += `#define USE_ATTRIBUTE_${key.toUpperCase()} 0.0; \n\n`;
      }
      str += `
          #ifdef USE_ATTRIBUTE_${key.toUpperCase()}
      attribute ${attrType[key]} a_${
        key.charAt(0).toUpperCase() + key.slice(1)
      };
    #else
      uniform ${attrType[key]} u_${key};
    #endif\n
    `;
    });
    let innerStr = '';
    this.layer.enableShaderEncodeStyles.forEach((key) => {
      innerStr += `\n
#ifdef USE_ATTRIBUTE_${key.toUpperCase()}
  ${attrType[key]} ${key}  = a_${key.charAt(0).toUpperCase() + key.slice(1)};
#else
  ${attrType[key]} ${key} = u_${key};
#endif\n
`;
    });

    return {
      'vs:#decl': str,
      'vs:#main-start': innerStr,
    };
  }

  // 获取数据映射样式
  protected getStyleAttribute() {
    const options: { [key: string]: any } = {};
    // TODO: 优化

    const defualtValue: { [key: string]: any } = {
      opacity: 1,
      stroke: [1, 0, 0, 1],
      offsets: [0, 0],
    };
    this.layer.enableShaderEncodeStyles.forEach((key) => {
      if (!this.layer.encodeStyleAttribute[key]) {
        // 没有设置样式映射
        // @ts-ignore
        const keyValue = this.layer.getLayerConfig()[key];

        let value =
          typeof keyValue === 'undefined' ? defualtValue[key] : keyValue;
        if (key === 'stroke') {
          value = rgb2arr(value);
        }
        options['u_' + key] = value;
      }
    });
    return options;
  }
  // 注册数据映射样式
  protected registerStyleAttribute() {
    Object.keys(this.layer.encodeStyleAttribute).forEach((key) => {
      const options = getCommonStyleAttributeOptions(key);
      if (options) {
        this.styleAttributeService.registerStyleAttribute(options);
      }
    });
  }
  public updateEncodeAttribute(type: string, flag: boolean) {
    this.encodeStyleAttribute[type] = flag;
  }
}
