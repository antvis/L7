import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  ILayerPlugin,
  IModel,
  IStyleAttributeService,
  lazyInject,
  TYPES,
} from '@antv/l7-core';
import { isNumber } from 'lodash';
import BaseModel, { styleSingle } from '../../core/BaseModel';
import { polygonTriangulation } from '../../core/triangulation';
import polygon_frag from '../shaders/polygon_frag.glsl';
import polygon_vert from '../shaders/polygon_vert.glsl';

interface IPolygonLayerStyleOptions {
  opacity: styleSingle;
}
export default class FillModel extends BaseModel {
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
      // u_opacity: opacity,
      u_opacity: isNumber(opacity) ? opacity : 1.0,
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

  public clearModels() {
    this.dataTexture?.destroy();
  }

  protected registerBuiltinAttributes() {
    // point layer size;
  }
}
