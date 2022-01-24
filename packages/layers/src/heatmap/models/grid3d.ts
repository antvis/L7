import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IHeatMapLayerStyleOptions } from '../../core/interface';
import { PointExtrudeTriangulation } from '../../core/triangulation';
import heatmapGrid3dVert from '../shaders/hexagon_3d_vert.glsl';
import heatmapGridFrag from '../shaders/hexagon_frag.glsl';
export default class Grid3DModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity,
      coverage,
      angle,
    } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    return {
      u_opacity: opacity || 1.0,
      u_coverage: coverage || 1.0,
      u_angle: angle || 0,
      u_radius: [
        this.layer.getSource().data.xOffset,
        this.layer.getSource().data.yOffset,
      ],
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    return [
      this.layer.buildLayerModel({
        moduleName: 'grid3dheatmap',
        vertexShader: heatmapGrid3dVert,
        fragmentShader: heatmapGridFrag,
        triangulation: PointExtrudeTriangulation,
        depth: { enable: true },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
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
          const coordinates = (feature.version === 'GAODE2.x'
            ? feature.originCoordinates
            : feature.coordinates) as number[];
          // const coordinates = feature.coordinates as number[];
          // const coordinates = feature.originCoordinates as number[];
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
