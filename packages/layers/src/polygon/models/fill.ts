import type { IEncodeFeature, IModel, Triangulation } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation, polygonTriangulationWithCenter } from '../../core/triangulation';
import polygon_frag from '../shaders/fill/fill_frag.glsl';
import polygon_linear_frag from '../shaders/fill/fill_linear_frag.glsl';
import polygon_linear_vert from '../shaders/fill/fill_linear_vert.glsl';
import polygon_vert from '../shaders/fill/fill_vert.glsl';
export default class FillModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      LINEAR: 9,
    });
  }

  public getUninforms() {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    };
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      raisingHeight = 0,
      opacityLinear = {
        enable: false,
        dir: 'in',
      },
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    const commonOptions = {
      u_raisingHeight: Number(raisingHeight),
      u_opacitylinear: Number(opacityLinear.enable),
      u_dir: opacityLinear.dir === 'in' ? 1.0 : 0.0,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { frag, vert, triangulation, type } = this.getModelParams();
    this.initUniformsBuffer();
    this.layer.triangulation = triangulation;
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 22 层级以上出现数据偏移
    this.registerPosition64LowAttribute();

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
          shaderLocation: this.attributeLocation.LINEAR,
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.STATIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 3,
          update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
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
        triangulation: polygonTriangulation,
      };
    }
  }
}
