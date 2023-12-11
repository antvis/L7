import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import { generateColorRamp, IColorRamp, lodashUtil } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions, LinearDir } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';
import linear_line_frag from '../shaders/linearLine/line_linear_frag.glsl';
import linear_line_vert from '../shaders/linearLine/line_linear_vert.glsl';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
const { isNumber } = lodashUtil;
export default class LinearLineModel extends BaseModel {
  protected colorTexture: ITexture2D;

  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption:{[key: string]: any}  } {
    const {
      vertexHeightScale = 20.0,
      raisingHeight = 0,
      heightfixed = false,
      linearDir = LinearDir.VERTICAL,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (this.rendererService.getDirty()) {
      this.colorTexture.bind();
    }
    const commonOptions= {
      // 纹理支持参数

      // 是否固定高度
      u_heightfixed: Number(heightfixed),

      // 顶点高度 scale
      u_vertexScale: vertexHeightScale,
      u_raisingHeight: Number(raisingHeight),
      u_linearDir: linearDir === LinearDir.VERTICAL ? 1.0 : 0.0,
    }
    this.textures = [this.colorTexture]
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);    
    return commonBufferInfo; 
  }
  public async initModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    this.updateTexture();
    return this.buildModels();
  }

  public clearModels() {
    this.colorTexture?.destroy();
  }

  public async buildModels(): Promise<IModel[]> {
    const { depth = false } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;

    this.layer.triangulation = LineTriangulation;

    const model = await this.layer.buildLayerModel({
      moduleName: 'lineRampColors',
      vertexShader: linear_line_vert,
      fragmentShader: linear_line_frag,
      triangulation: LineTriangulation,
      inject:this.getInject(),
      depth: { enable: depth },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'distanceAndIndex',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_DistanceAndIndex',
        shaderLocation:10,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
          vertexIndex?: number,
        ) => {
          return vertexIndex === undefined
            ? [vertex[3], 10]
            : [vertex[3], vertexIndex];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'total_distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Total_Distance',
        shaderLocation:11,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[5]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation:ShaderLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation:ShaderLocation.NORMAL,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'miter',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Miter',
        shaderLocation:12,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[4]];
        },
      },
    });
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.colorTexture) {
      this.colorTexture.destroy();
    }
    const { rampColors } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: new Uint8Array(imageData.data),
      width: imageData.width,
      height: imageData.height,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      flipY: false,
    });
    this.textures = [this.colorTexture];
  };
}
