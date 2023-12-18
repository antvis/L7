import type {
  IEncodeFeature,
  IModel,
  IModelUniform} from '@antv/l7-core';
import {
  AttributeType,
  gl
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
import type { IPointLayerStyleOptions } from '../../core/interface';
import normalFrag from '../shaders/normal_frag.glsl';
import normalVert from '../shaders/normal_vert.glsl';

export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates],
    indices: [0],
    size: coordinates.length,
  };
}

export default class NormalModel extends BaseModel {
  public getDefaultStyle(): Partial<IPointLayerStyleOptions> {
    return {
      blend: 'additive',
    };
  }
  public getUninforms(): IModelUniform {
    const attributes = this.getStyleAttribute();
    // FIXME: No need to update each frame
    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...attributes.u_stroke,
          ...attributes.u_offsets,
          attributes.u_opacity,
          attributes.u_rotation,
        ]).buffer,
      ),
    });

    this.uniformBuffers[1].subData({
      offset: 0,
      data: new Uint8Array(new Float32Array([0.5]).buffer),
    });

    return {
      u_size_scale: 0.5,
      ...attributes,
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.layer.triangulation = PointTriangulation;

    const uniformBuffer = this.rendererService.createBuffer({
      data: new Float32Array(4 + 2 + 1 + 1),
      isUBO: true,
    });

    const commonBuffer = this.rendererService.createBuffer({
      data: new Float32Array(4),
      isUBO: true,
    });

    this.uniformBuffers.push(uniformBuffer, commonBuffer);
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointNormal',
      vertexShader: normalVert,
      fragmentShader: normalFrag,
      triangulation: PointTriangulation,
      inject: this.getInject(),
      depth: { enable: false },
      primitive: gl.POINTS,

      pick: false,
    });
    return [model];
  }

  public clearModels() {
    return;
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: ShaderLocation.SIZE,
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
  }
}
