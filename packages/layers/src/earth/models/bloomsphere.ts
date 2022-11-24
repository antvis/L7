import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { isNumber } from 'lodash';

import BaseModel from '../../core/BaseModel';
import { earthOuterTriangulation } from '../../core/triangulation';
import bloomSphereFrag from '../shaders/bloomsphere_frag.glsl';
import bloomSphereVert from '../shaders/bloomsphere_vert.glsl';
interface IBloomLayerStyleOptions {
  opacity: number;
}

export default class EarthBloomSphereModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
    } = this.layer.getLayerConfig() as IBloomLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
  }

  public async initModels(): Promise<IModel[]> {
      return await this.buildModels();
  }

  public clearModels() {
    return '';
  }

 public async buildModels():Promise<IModel[]> {
    // Tip: 调整图层的绘制顺序，让它保持在地球后面（减少锯齿现象）
    this.layer.zIndex = -999;
   const model = await this.layer
      .buildLayerModel({
        moduleName: 'earthBloom',
        vertexShader: bloomSphereVert,
        fragmentShader: bloomSphereFrag,
        triangulation: earthOuterTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
      })
     return [model]
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
        ) => {
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
