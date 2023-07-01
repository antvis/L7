import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  Triangulation,
} from '@antv/l7-core';
import { polygonFillTriangulation } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulationWithCenter } from '../../core/triangulation';
import polygon_frag from '../shaders/polygon_frag.glsl';
import polygon_linear_frag from '../shaders/polygon_linear_frag.glsl';
import polygon_linear_vert from '../shaders/polygon_linear_vert.glsl';
import polygon_vert from '../shaders/polygon_vert.glsl';
export default class FillModel extends BaseModel {
  public getUninforms() {
    const {
      raisingHeight = 0,
      opacityLinear = {
        enable: false,
        dir: 'in',
      },
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    return {
      u_raisingHeight: Number(raisingHeight),
      u_opacitylinear: Number(opacityLinear.enable),
      u_dir: opacityLinear.dir === 'in' ? 1.0 : 0.0,
      ...this.getStyleAttribute(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { frag, vert, triangulation, type } = this.getModelParams();
    const { workerEnabled = false, enablePicking } =
      this.layer.getLayerConfig() as Partial<
        ILayerConfig & IPolygonLayerStyleOptions
      >;
    this.layer.triangulation = triangulation;
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      inject: this.getInject(),
      triangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },

      workerEnabled,
      workerOptions: {
        modelType: type,
        enablePicking,
      },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    const {
      opacityLinear = {
        enable: false,
        dir: 'in',
      },
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    if (opacityLinear.enable) {
      this.styleAttributeService.registerStyleAttribute({
        name: 'linear',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_linear',
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
          ) => {
            return [vertex[3], vertex[4], vertex[5]];
          },
        },
      });
    }
  }

  private getModelParams(): {
    frag: string;
    vert: string;
    type: string;
    triangulation: Triangulation;
  } {
    const {
      opacityLinear = {
        enable: false,
      },
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    if (opacityLinear.enable) {
      return {
        frag: polygon_linear_frag,
        vert: polygon_linear_vert,
        type: 'polygonLinear',
        triangulation: polygonTriangulationWithCenter,
      };
    } else {
      return {
        frag: polygon_frag,
        vert: polygon_vert,
        type: 'polygonFill',
        triangulation: polygonFillTriangulation,
      };
    }
  }
}
