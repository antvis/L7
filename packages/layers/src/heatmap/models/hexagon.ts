import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { HeatmapGridTriangulation } from '../../core/triangulation';
import heatmapGridFrag from '../shaders/hexagon_frag.glsl';
import heatmapGridVert from '../shaders/hexagon_vert.glsl';

interface IHeatMapLayerStyleOptions {
  opacity: number;
  coverage: number;
  angle: number;
}

export default class HexagonModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity,
      coverage,
      angle,
    } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    return {
      u_opacity: opacity || 1.0,
      u_coverage: coverage || 0.9,
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
    return [
      this.layer.buildLayerModel({
        moduleName: 'hexagonheatmap',
        vertexShader: heatmapGridVert,
        fragmentShader: heatmapGridFrag,
        triangulation: HeatmapGridTriangulation,
        depth: { enable: false },
        primitive: gl.TRIANGLES,
        blend: this.getBlend(),
      }),
    ];
  }
  protected registerBuiltinAttributes() {
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
          const coordinates = feature.coordinates as number[];
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
