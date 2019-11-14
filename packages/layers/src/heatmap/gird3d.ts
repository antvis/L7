import { AttributeType, gl, IEncodeFeature, ILayer } from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import { PointExtrudeTriangulation } from '../core/triangulation';
import heatmapGrid3dVert from './shaders/hexagon_3d_vert.glsl';
import heatmapGridFrag from './shaders/hexagon_frag.glsl';
interface IHeatMapLayerStyleOptions {
  opacity: number;
  coverage: number;
}
export default class HeatMapGrid extends BaseLayer<IHeatMapLayerStyleOptions> {
  public name: string = 'hexgaon';

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected renderModels() {
    const { opacity, coverage } = this.getStyleOptions();
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1.0,
          u_coverage: coverage || 1.0,
          u_radius: [
            this.getSource().data.xOffset,
            this.getSource().data.yOffset,
          ],
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes(this);
    this.models = [
      this.buildLayerModel({
        moduleName: 'grid3dheatmap',
        vertexShader: heatmapGrid3dVert,
        fragmentShader: heatmapGridFrag,
        triangulation: PointExtrudeTriangulation,
        depth: { enable: true },
      }),
    ];
  }

  private registerBuiltinAttributes(layer: ILayer) {
    // point layer size;
    layer.styleAttributeService.registerStyleAttribute({
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
    layer.styleAttributeService.registerStyleAttribute({
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
    layer.styleAttributeService.registerStyleAttribute({
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
