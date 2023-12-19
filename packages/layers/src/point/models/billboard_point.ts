import type {
  IEncodeFeature,
  IModel} from '@antv/l7-core';
import {
  AttributeType,
  gl
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IPointLayerStyleOptions } from '../../core/interface';

import { rgb2arr } from '@antv/l7-utils';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
import simplePointFrag from '../shaders/billboard/billboard_point_frag.glsl';
import simplePointVert from '../shaders/billboard/billboard_point_vert.glsl';

export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates],
    indices: [0],
    size: coordinates.length,
  };
}

export default class SimplePointModel extends BaseModel {
  public getDefaultStyle(): Partial<IPointLayerStyleOptions> {
    return {
      blend: 'additive',
    };
  }
  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption: { [key: string]: any; }; } {
    const {
      blend,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = '#fff',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    const commonOptions = {
      u_stroke_color: rgb2arr(stroke),
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_stroke_opacity: strokeOpacity,
      u_stroke_width: strokeWidth,
    }

    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.layer.triangulation = PointTriangulation;

    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointSimple',
      vertexShader: simplePointVert,
      fragmentShader: simplePointFrag,
      inject: this.getInject(),
      triangulation: PointTriangulation,
      depth: { enable: false },
      primitive: gl.POINTS,
    });
    return [model];
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
