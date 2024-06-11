import type {
  IAnimateOption,
  IAttribute,
  IBlendOptions,
  IBuffer,
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
  IRenderOptions,
  IRendererService,
  IShaderModuleService,
  IStencilOptions,
  IStyleAttributeService,
  ITexture2D,
  ITexture2DInitializationOptions,
  ShaderDefine,
  ShaderInject,
  Triangulation,
} from '@antv/l7-core';
import { AttributeType, BlendType, MaskOperation, StencilType, gl } from '@antv/l7-core';
import { fp64LowPart, rgb2arr } from '@antv/l7-utils';
import { BlendTypes } from '../utils/blend';
import { getStencil, getStencilMask } from '../utils/stencil';
import { COMMON_ATTRIBUTE_LOCATION, getCommonStyleAttributeOptions } from './CommonStyleAttribute';
import { DefaultUniformStyleType, DefaultUniformStyleValue } from './constant';
import { MultipleOfFourNumber } from './utils';
export type styleSingle =
  | number
  | string
  | [string, (single: any) => number]
  | [string, [number, number]];
export type styleOffset = string | [number, number] | [string, (single: any) => number];
export type styleColor = string | [string, (single: any) => string] | [string, [string, string]];
export interface IDataTextureFrame {
  data: number[];
  width: number;
  height: number;
}

export interface ICellProperty {
  attr: string;
  count: number;
}

type AttributeLayoutLocationType = typeof COMMON_ATTRIBUTE_LOCATION & Record<string, number>;

// 属性索引宏定义前缀，使用命名空间避免 define 名称重复情况
const DEFINE_ATTRIBUTE_LOCATION_PREFIX = 'ATTRIBUTE_LOCATION_';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class BaseModel<ChildLayerStyleOptions = {}> implements ILayerModel {
  public triangulation: Triangulation;
  public uniformBuffers: IBuffer[] = [];
  public textures: ITexture2D[] = [];
  /**
   * Attribute Layout Location in Shader
   */
  protected get attributeLocation(): AttributeLayoutLocationType {
    return { ...COMMON_ATTRIBUTE_LOCATION };
  }

  // style texture data mapping
  public createTexture2D: (options: ITexture2DInitializationOptions) => ITexture2D;
  public preStyleAttribute: Record<string, any> = {};
  protected encodeStyleAttribute: Record<string, boolean> = {};
  protected layer: ILayer;
  protected dataTexture: ITexture2D; // 用于数据传递的数据纹理
  protected DATA_TEXTURE_WIDTH: number; // 默认有多少列（宽度）
  protected dataTextureTest: boolean;

  protected readonly configService: IGlobalConfigService;
  protected shaderModuleService: IShaderModuleService;
  protected rendererService: IRendererService;
  protected iconService: IIconService;
  protected fontService: IFontService;
  protected styleAttributeService: IStyleAttributeService;
  protected mapService: IMapService;
  protected cameraService: ICameraService;
  protected layerService: ILayerService;
  protected pickingService: IPickingService;

  protected attributeUnifoms: IBuffer; // 支持数据映射的buffer
  protected commonUnifoms: IBuffer; // 不支持数据映射的buffer

  // style texture data mapping

  constructor(layer: ILayer) {
    this.layer = layer;
    this.configService = layer.getContainer().globalConfigService;
    this.rendererService = layer.getContainer().rendererService;
    this.pickingService = layer.getContainer().pickingService;

    this.shaderModuleService = layer.getContainer().shaderModuleService;

    this.styleAttributeService = layer.getContainer().styleAttributeService;
    this.mapService = layer.getContainer().mapService;
    this.iconService = layer.getContainer().iconService;
    this.fontService = layer.getContainer().fontService;
    this.cameraService = layer.getContainer().cameraService;
    this.layerService = layer.getContainer().layerService;
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
  // public getUninforms(): IModelUniform {
  //   throw new Error('Method not implemented.');
  // }
  public getUninforms(): IModelUniform {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    const result = {
      ...attributeInfo.uniformsOption,
      ...commoninfo.uniformsOption,
    };
    // 兼容 Regl Boolean 类型
    Object.keys(result).forEach((key) => {
      if (typeof result[key] === 'boolean') {
        result[key] = result[key] ? 1 : 0;
      }
    });
    //如果是regl渲染 需要在uniform中带上u_texture 暂时用this.rendererService.device判断
    if (
      !this.rendererService.hasOwnProperty('device') &&
      this.textures &&
      this.textures.length === 1
    ) {
      result['u_texture'] = this.textures[0];
    }
    return result;
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
  public prerender(): void {}
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

  protected getInject(): ShaderInject {
    const shaderInject = getDynamicStyleInject(
      this.layer.enableShaderEncodeStyles,
      this.layer.encodeStyleAttribute,
    );

    return shaderInject;
  }

  protected getDefines(): Record<string, ShaderDefine> {
    // define atribute Layout Location
    const atributeLocationDefines = Object.keys(this.attributeLocation).reduce<
      Record<string, number>
    >((result, key) => {
      const normalizedKey = DEFINE_ATTRIBUTE_LOCATION_PREFIX + key;
      result[normalizedKey] = this.attributeLocation[key];
      return result;
    }, {});

    return { ...atributeLocationDefines };
  }

  // 获取数据映射样式
  protected getStyleAttribute() {
    const options: { [key: string]: any } = {};
    // TODO: 优化
    this.layer.enableShaderEncodeStyles.forEach((key) => {
      if (!this.layer.encodeStyleAttribute[key]) {
        // 没有设置样式映射
        // @ts-ignore
        const keyValue = this.layer.getLayerConfig()[key];

        let value = typeof keyValue === 'undefined' ? DefaultUniformStyleValue[key] : keyValue;
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

  /**
   * 注册 Position 属性 64 位地位部分，当经纬度数据开启双精度浮点数使用，
   * 避免大于 20层级以上出现数据偏移
   */
  protected registerPosition64LowAttribute(enable64bitPosition = true) {
    // save low part for enabled double precision POSITION attribute
    this.styleAttributeService.registerStyleAttribute({
      name: 'position64Low',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Position64Low',
        shaderLocation: this.attributeLocation.POSITION_64LOW,
        buffer: {
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return enable64bitPosition ? [fp64LowPart(vertex[0]), fp64LowPart(vertex[1])] : [0, 0];
        },
      },
    });
  }

  public updateEncodeAttribute(type: string, flag: boolean) {
    this.encodeStyleAttribute[type] = flag;
  }

  public initUniformsBuffer() {
    const attrUniforms = this.getUniformsBufferInfo(this.getStyleAttribute());
    const commonUniforms = this.getCommonUniformsInfo();
    if (attrUniforms.uniformsLength !== 0) {
      this.attributeUnifoms = this.rendererService.createBuffer({
        data: new Float32Array(MultipleOfFourNumber(attrUniforms.uniformsLength)).fill(0), // 长度需要大于等于 4
        isUBO: true,
        label: 'layerModelAttributeUnifoms',
      });
      this.uniformBuffers.push(this.attributeUnifoms);
    }
    if (commonUniforms.uniformsLength !== 0) {
      this.commonUnifoms = this.rendererService.createBuffer({
        data: new Float32Array(MultipleOfFourNumber(commonUniforms.uniformsLength)).fill(0),
        isUBO: true,
        label: 'layerModelCommonUnifoms',
      });
      this.uniformBuffers.push(this.commonUnifoms);
    }
  }
  // 获取数据映射 uniform 信息
  protected getUniformsBufferInfo(uniformsOption: { [key: string]: any }) {
    let uniformsLength = 0;
    const uniformsArray: number[] = [];
    Object.values(uniformsOption).forEach((value: any) => {
      if (Array.isArray(value)) {
        uniformsArray.push(...value);
        uniformsLength += value.length;
      } else if (typeof value === 'number') {
        // 排除纹理
        uniformsArray.push(value);
        uniformsLength += 1;
      } else if (typeof value === 'boolean') {
        uniformsArray.push(Number(value));
        uniformsLength += 1;
      }
    });

    return {
      uniformsOption,
      uniformsLength,
      uniformsArray,
    };
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    return {
      uniformsLength: 0,
      uniformsArray: [],
      uniformsOption: {},
    };
  }

  // 更新支持数据映射的uniform
  public updateStyleUnifoms() {
    const { uniformsArray } = this.getUniformsBufferInfo(this.getStyleAttribute());
    const { uniformsArray: commonUniformsArray } = this.getCommonUniformsInfo();
    this.attributeUnifoms?.subData({
      offset: 0,
      data: new Uint8Array(new Float32Array(uniformsArray).buffer),
    });
    this.commonUnifoms?.subData({
      offset: 0,
      data: new Uint8Array(new Float32Array(commonUniformsArray).buffer),
    });
  }
}

/**
 * 获取动态注入参与数据映射 uniform/attribute
 */
function getDynamicStyleInject(
  shaderEncodeStyles: string[],
  styleAttribute: Record<string, any>,
): ShaderInject {
  const uniforms: string[] = [];
  let vsDeclInjection = '';

  // 支持数据映射的类型
  shaderEncodeStyles.forEach((key) => {
    const upperCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    const shaderDefineName = DEFINE_ATTRIBUTE_LOCATION_PREFIX + upperCaseKey;

    if (styleAttribute[key]) {
      // 配置了数据映射的类型
      vsDeclInjection += `#define USE_ATTRIBUTE_${upperCaseKey} 0.0 \n`;
    } else {
      uniforms.push(`  ${DefaultUniformStyleType[key]} u_${key};`);
    }

    vsDeclInjection += `
#ifdef USE_ATTRIBUTE_${upperCaseKey}
layout(location = ${shaderDefineName}) in ${DefaultUniformStyleType[key]} a_${key.charAt(0).toUpperCase() + key.slice(1)};
#endif \n`;
  });

  const fsDeclInjection = uniforms.length
    ? `
layout(std140) uniform AttributeUniforms {
  ${uniforms.join('\n')}
};\n`
    : '';

  vsDeclInjection += fsDeclInjection;

  let vsMainInjection = '';
  shaderEncodeStyles.forEach((key) => {
    const upperCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    vsMainInjection += `
  #ifdef USE_ATTRIBUTE_${upperCaseKey}
    ${DefaultUniformStyleType[key]} ${key} = a_${key.charAt(0).toUpperCase() + key.slice(1)};
  #else
    ${DefaultUniformStyleType[key]} ${key} = u_${key};
  #endif
  `;
  });

  return {
    'vs:#decl': vsDeclInjection,
    'fs:#decl': fsDeclInjection,
    'vs:#main-start': vsMainInjection,
  };
}
