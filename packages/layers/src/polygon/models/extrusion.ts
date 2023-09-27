import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import polygonExtrudeFrag from '../shaders/extrusion/polygon_extrusion_frag.glsl';
import polygonExtrudeVert from '../shaders/extrusion/polygon_extrusion_vert.glsl';

export default class ExtrusionModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms() {
    return {
      ...this.getStyleAttribute(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { frag, vert, type } = this.getShaders();
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      inject: this.getInject(),
      triangulation: PolygonExtrudeTriangulation,
    });
    return [model];
  }

  public getShaders() {
    return {
      frag: polygonExtrudeFrag,
      vert: polygonExtrudeVert,
      type: 'polygonExtrude',
    };
  }

  public clearModels() {
    this.texture?.destroy();
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
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
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }
}
