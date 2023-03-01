import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IHeatMapLayerStyleOptions } from '../../core/interface';
import { HeatmapGridTriangulation } from '../../core/triangulation';
import heatmapGridVert from '../shaders/grid_vert.glsl';
import heatmapGridFrag from '../shaders/hexagon_frag.glsl';
export default class GridModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const { opacity, coverage, angle } =
      this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
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

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'heatmapGrid',
      vertexShader: heatmapGridVert,
      fragmentShader: heatmapGridFrag,
      triangulation: HeatmapGridTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    return [model];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'pos', // 顶点经纬度位置
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Pos',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature) => {
          const coordinates = (
            feature.version === 'GAODE2.x'
              ? feature.originCoordinates
              : feature.coordinates
          ) as number[];
          return [coordinates[0], coordinates[1], 0];
        },
      },
    });
  }
}
