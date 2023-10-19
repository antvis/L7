import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions } from '../../core/interface';
import normalFrag from '../shaders/normal_frag.glsl';
import normalVert from '../shaders/normal_vert.glsl';
const { isNumber } = lodashUtil;

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
    const { opacity = 1 } =
      this.layer.getLayerConfig() as IPointLayerStyleOptions;

    return {
      ...this.getStyleAttribute(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.layer.triangulation = PointTriangulation;

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
        shaderLocation: 2,
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
