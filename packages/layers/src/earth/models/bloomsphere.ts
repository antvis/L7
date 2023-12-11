import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';

import BaseModel from '../../core/BaseModel';
import { earthOuterTriangulation } from '../../core/triangulation';
import bloomSphereFrag from '../shaders/bloomsphere_frag.glsl';
import bloomSphereVert from '../shaders/bloomsphere_vert.glsl';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
interface IBloomLayerStyleOptions {
  opacity: number;
}
const { isNumber } = lodashUtil;
export default class EarthBloomSphereModel extends BaseModel {
  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption:{[key: string]: any}  } {
    const { opacity = 1 } =
      this.layer.getLayerConfig() as IBloomLayerStyleOptions;
    const commonOptions ={
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    return this.buildModels();
  }

  public clearModels() {
    return '';
  }

  public async buildModels(): Promise<IModel[]> {
    // Tip: 调整图层的绘制顺序，让它保持在地球后面（减少锯齿现象）
    this.layer.zIndex = -999;
    const model = await this.layer.buildLayerModel({
      moduleName: 'earthBloom',
      vertexShader: bloomSphereVert,
      fragmentShader: bloomSphereFrag,
      triangulation: earthOuterTriangulation,
      depth: { enable: false },
      blend: this.getBlend(),
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation:ShaderLocation.SIZE,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation:ShaderLocation.NORMAL,
        buffer: {
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
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation:ShaderLocation.UV,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
