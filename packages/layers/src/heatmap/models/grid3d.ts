import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  IModel,
  IModelUniform,
} from '@l7/core';
import BaseModel from '../../core/baseModel';
import { PointExtrudeTriangulation } from '../../core/triangulation';
import heatmapGrid3dVert from '../shaders/hexagon_3d_vert.glsl';
import heatmapGridFrag from '../shaders/hexagon_frag.glsl';

interface IHeatMapLayerStyleOptions {
  opacity: number;
  coverage: number;
}
export default class Grid3DModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity,
      coverage,
    } = this.layer.getStyleOptions() as IHeatMapLayerStyleOptions;
    return {
      u_opacity: opacity || 1.0,
      u_coverage: coverage || 1.0,
      u_radius: [
        this.layer.getSource().data.xOffset,
        this.layer.getSource().data.yOffset,
      ],
    };
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'grid3dheatmap',
        vertexShader: heatmapGrid3dVert,
        fragmentShader: heatmapGridFrag,
        triangulation: PointExtrudeTriangulation,
        depth: { enable: true },
      }),
    ];
  }
  protected registerBuiltinAttributes() {
    // point layer size;
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
      name: 'pos', // 顶点经纬度位置
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
          const coordinates = feature.coordinates as number[];
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
