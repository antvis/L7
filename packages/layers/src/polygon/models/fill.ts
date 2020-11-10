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
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { polygonTriangulation } from '../../core/triangulation';
import polygon_frag from '../shaders/polygon_frag.glsl';
import polygon_vert from '../shaders/polygon_vert.glsl';

interface IPolygonLayerStyleOptions {
  opacity: number;
}
export default class FillModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    return {
      u_opacity: opacity,
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'polygon',
        vertexShader: polygon_vert,
        fragmentShader: polygon_frag,
        triangulation: polygonTriangulation,
        blend: this.getBlend(),
        depth: { enable: false },
      }),
    ];
  }

  protected registerBuiltinAttributes() {
    // point layer size;
  }
}
