import { AttributeType, gl, IEncodeFeature, IModel } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { PointExtrudeTriangulation } from '../../core/triangulation';
import { calculteCentroid } from '../../utils/geo';
import pointExtrudeFrag from '../shaders/extrude_frag.glsl';
import pointExtrudeVert from '../shaders/extrude_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
  offsets: [number, number];
}
export default class ExtrudeModel extends BaseModel {
  public getUninforms() {
    const {
      opacity,
      offsets,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return {
      u_opacity: opacity || 1.0,
      u_offsets: offsets || [0, 0],
    };
  }
  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointExtrude2',
        vertexShader: pointExtrudeVert,
        fragmentShader: pointExtrudeFrag,
        triangulation: PointExtrudeTriangulation,
        blend: this.getBlend(),
      }),
    ];
  }
  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
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
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
          if (size) {
            let buffersize: number[] = [];
            if (Array.isArray(size)) {
              buffersize =
                size.length === 2 ? [size[0], size[0], size[1]] : size;
            }
            if (!Array.isArray(size)) {
              buffersize = [size];
            }
            return buffersize;
          } else {
            return [2, 2, 2];
          }
        },
      },
    });

    // point layer size;
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
      name: 'pos',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Pos',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature, featureIdx: number) => {
          const coordinates = calculteCentroid(feature.coordinates);
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
