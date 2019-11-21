import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  ILayerPlugin,
  ILogService,
  IModel,
  IStyleAttributeService,
  lazyInject,
  TYPES,
} from '@l7/core';
import BaseModel from '../../core/baseModel';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import polygonExtrudeFrag from '../shaders/polygon_extrude_frag.glsl';
import polygonExtrudeVert from '../shaders/polygon_extrude_vert.glsl';
interface IPolygonLayerStyleOptions {
  opacity: number;
}
export default class ExtrudeModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
    } = this.layer.getStyleOptions() as IPolygonLayerStyleOptions;
    return {
      u_opacity: opacity,
    };
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'polygonExtrude',
        vertexShader: polygonExtrudeVert,
        fragmentShader: polygonExtrudeFrag,
        triangulation: PolygonExtrudeTriangulation,
      }),
    ];
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.layer.styleAttributeService.registerStyleAttribute({
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

    this.layer.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }
}
