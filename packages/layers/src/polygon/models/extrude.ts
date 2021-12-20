import { AttributeType, gl, IEncodeFeature, IModel } from '@antv/l7-core';
import { isNumber } from 'lodash';
import BaseModel, { styleSingle } from '../../core/BaseModel';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import polygonExtrudeFrag from '../shaders/polygon_extrude_frag.glsl';
import polygonExtrudePickLightFrag from '../shaders/polygon_extrude_picklight_frag.glsl';
import polygonExtrudePickLightVert from '../shaders/polygon_extrude_picklight_vert.glsl';
import polygonExtrudeVert from '../shaders/polygon_extrude_vert.glsl';

interface IPolygonLayerStyleOptions {
  opacity: styleSingle;
  pickLight: boolean;
}
export default class ExtrudeModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
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

      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    const {
      pickLight = false,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    return [
      this.layer.buildLayerModel({
        moduleName: 'polygonExtrude',
        vertexShader: pickLight
          ? polygonExtrudePickLightVert
          : polygonExtrudeVert,
        fragmentShader: pickLight
          ? polygonExtrudePickLightFrag
          : polygonExtrudeFrag,
        triangulation: PolygonExtrudeTriangulation,
      }),
    ];
  }

  public clearModels() {
    this.dataTexture?.destroy();
  }

  protected registerBuiltinAttributes() {
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
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }
}
