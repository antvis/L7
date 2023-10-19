import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';

import BaseModel from '../../core/BaseModel';
import { earthOuterTriangulation } from '../../core/triangulation';
import bloomSphereFrag from '../shaders/bloomsphere_frag.glsl';
import bloomSphereVert from '../shaders/bloomsphere_vert.glsl';
interface IBloomLayerStyleOptions {
  opacity: number;
}
const { isNumber } = lodashUtil;
export default class EarthBloomSphereModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const { opacity = 1 } =
      this.layer.getLayerConfig() as IBloomLayerStyleOptions;

    const u_opacity = isNumber(opacity) ? opacity : 1.0;
    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(new Float32Array([u_opacity]).buffer),
    });
    return {
      u_opacity,
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public clearModels() {
    return '';
  }

  public async buildModels(): Promise<IModel[]> {
    // Tip: 调整图层的绘制顺序，让它保持在地球后面（减少锯齿现象）
    this.layer.zIndex = -999;

    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(1),
        isUBO: true,
      }),
    );

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
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: 7,
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
        shaderLocation: 8,
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
