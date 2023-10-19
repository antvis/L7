import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { lodashUtil, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { SimpleLineTriangulation } from '../../core/triangulation';
import simple_line_frag from '../shaders/simple/simpleline_frag.glsl';
// linear simple line shader
import simle_linear_frag from '../shaders/simple/simpleline_linear_frag.glsl';
import simple_line_vert from '../shaders/simple/simpleline_vert.glsl';
const { isNumber } = lodashUtil;
export default class SimpleLineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      sourceColor,
      targetColor,
      vertexHeightScale = 20.0,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }

    const u_sourceColor = sourceColorArr;
    const u_targetColor = targetColorArr;
    const u_linearColor = useLinearColor;
    const u_opacity = isNumber(opacity) ? opacity : 1;
    // 顶点高度 scale
    const u_vertexScale = vertexHeightScale;

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          // vec4 u_sourceColor;
          // vec4 u_targetColor;
          // float u_opacity;
          // float u_vertexScale;
          // float u_linearColor;
          ...u_sourceColor,
          ...u_targetColor,
          u_opacity,
          u_vertexScale,
          u_linearColor,
        ]).buffer,
      ),
    });

    return {
      // 渐变色支持参数
      u_sourceColor,
      u_targetColor,
      u_linearColor,
      u_opacity,
      // 顶点高度 scale
      u_vertexScale,
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public getShaders(): { frag: string; vert: string; type: string } {
    const { sourceColor, targetColor } =
      this.layer.getLayerConfig() as ILineLayerStyleOptions;
    if (sourceColor && targetColor) {
      // 分离 linear 功能
      return {
        frag: simle_linear_frag,
        vert: simple_line_vert,
        type: 'lineSimpleLinear',
      };
    } else {
      return {
        frag: simple_line_frag,
        vert: simple_line_vert,
        type: 'lineSimpleNormal',
      };
    }
  }

  public async buildModels(): Promise<IModel[]> {
    const { frag, vert, type } = this.getShaders();

    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(4 + 4 + 1 + 1 + 1),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: SimpleLineTriangulation,
      primitive: gl.LINES,
      depth: { enable: false },
      pick: false,
    });

    return [model];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Distance',
        shaderLocation: 9,
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
          return [vertex[3]];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'total_distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Total_Distance',
        shaderLocation: 8,
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
        shaderLocation: 7,
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
  }
}
