import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  Triangulation,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import {
  polygonTriangulation,
  polygonTriangulationWithCenter,
} from '../../core/triangulation';
import polygon_frag from '../shaders/polygon_frag.glsl';
import polygon_linear_frag from '../shaders/polygon_linear_frag.glsl';
import polygon_linear_vert from '../shaders/polygon_linear_vert.glsl';
import polygon_vert from '../shaders/polygon_vert.glsl';
export default class FillModel extends BaseModel {
  public getUninforms() {
    const {
      raisingHeight = 0,
      opacity = 1,
      opacityLinear = {
        enable: false,
        dir: 'in',
      },
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    if (this.dataTextureTest && this.dataTextureNeedUpdate({ opacity })) {
      this.judgeStyleAttributes({ opacity });
      const encodeData = this.layer.getEncodedData();
      const { data, width, height } = this.calDataFrame(
        this.cellLength,
        encodeData,
        this.cellProperties,
      );
      this.rowCount = height; // 当前数据纹理有多少行

      this.dataTexture =
        this.cellLength > 0 && data.length > 0
          ? this.createTexture2D({
              flipY: true,
              data,
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width,
              height,
            })
          : this.createTexture2D({
              flipY: true,
              data: [1],
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width: 1,
              height: 1,
            });
    }
    return {
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_raisingHeight: Number(raisingHeight),

      u_opacity: isNumber(opacity) ? opacity : 1.0,

      u_opacitylinear: Number(opacityLinear.enable),
      u_dir: opacityLinear.dir === 'in' ? 1.0 : 0.0,
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    const { frag, vert, triangulation, type } = this.getModelParams();
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    this.layer.triangulation = triangulation;
    return [
      this.layer.buildLayerModel({
        moduleName: type,
        vertexShader: vert,
        fragmentShader: frag,
        triangulation,
        blend: this.getBlend(),
        depth: { enable: false },
        stencil: getMask(mask, maskInside),
      }),
    ];
  }

  public clearModels() {
    this.dataTexture?.destroy();
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
            attributeIdx: number,
            normal: number[],
          ) => {
            // center[0] center[1] radius
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
        type: 'polygon_linear',
        triangulation: polygonTriangulationWithCenter,
      };
    } else {
      return {
        frag: polygon_frag,
        vert: polygon_vert,
        type: 'polygon_fill',
        triangulation: polygonTriangulation,
      };
    }
  }
}
