import { IEncodeFeature } from '@l7/core';
import earcut from 'earcut';
import BaseLayer from '../core/BaseLayer';
import polygon_frag from './shaders/polygon_frag.glsl';
import polygon_vert from './shaders/polygon_vert.glsl';

interface IPolygonLayerStyleOptions {
  opacity: number;
}

export function polygonTriangulation(feature: IEncodeFeature) {
  const { coordinates } = feature;
  const flattengeo = earcut.flatten(coordinates as number[][][]);
  const { vertices, dimensions, holes } = flattengeo;

  return {
    indices: earcut(vertices, holes, dimensions),
    vertices,
    size: dimensions,
  };
}

export default class PolygonLayer extends BaseLayer<IPolygonLayerStyleOptions> {
  public name: string = 'PolygonLayer';

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
    const { opacity } = this.getStyleOptions();
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1.0,
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.models = [
      this.buildLayerModel({
        moduleName: 'polygon',
        vertexShader: polygon_vert,
        fragmentShader: polygon_frag,
        triangulation: polygonTriangulation,
        depth: { enable: false },
      }),
    ];
  }
}
