import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';

import { rgb2arr } from '@antv/l7-utils';
import simplePointFrag from '../shaders/simplePoint_frag.glsl';
import simplePointVert from '../shaders/simplePoint_vert.glsl';

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
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      offsets = [0, 0],
      blend,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = '#fff',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    return {
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_opacity: opacity,
      u_offsets: offsets,
      u_stroke_opacity: strokeOpacity,
      u_stroke_width: strokeWidth,
      u_stroke_color: rgb2arr(stroke),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.layer.triangulation = PointTriangulation;

    const model = await this.layer.buildLayerModel({
      moduleName: 'pointSimple',
      vertexShader: simplePointVert,
      fragmentShader: simplePointFrag,
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
