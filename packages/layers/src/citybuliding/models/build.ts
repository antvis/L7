import { AttributeType, gl, IEncodeFeature, IModel } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import buildFrag from '../shaders/build_frag.glsl';
import buildVert from '../shaders/build_vert.glsl';
interface ICityBuildLayerStyleOptions {
  opacity: number;
  baseColor: string;
  brightColor: string;
  windowColor: string;
  time: number;
}
export default class CityBuildModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
      baseColor = 'rgb(16,16,16)',
      brightColor = 'rgb(255,176,38)',
      windowColor = 'rgb(30,60,89)',
      time = 0,
    } = this.layer.getLayerConfig() as ICityBuildLayerStyleOptions;
    return {
      u_opacity: opacity,
      u_baseColor: rgb2arr(baseColor),
      u_brightColor: rgb2arr(brightColor),
      u_windowColor: rgb2arr(windowColor),
      u_time: this.layer.getLayerAnimateTime() || time,
    };
  }

  public initModels(): IModel[] {
    this.startModelAnimate();
    return [
      this.layer.buildLayerModel({
        moduleName: 'cityBuilding',
        vertexShader: buildVert,
        fragmentShader: buildFrag,
        triangulation: PolygonExtrudeTriangulation,
      }),
    ];
  }

  protected registerBuiltinAttributes() {
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
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
