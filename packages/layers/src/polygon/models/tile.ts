import { gl, IModel, Triangulation } from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';

import polygon_tile_frag from '../shaders/tile/polygon_tile_frag.glsl';
import polygon_tile_vert from '../shaders/tile/polygon_tile_vert.glsl';
export default class FillModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
      tileOrigin,
      coord = 'lnglat',
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
      u_tileOrigin: tileOrigin || [0, 0],
      u_coord: coord === 'lnglat' ? 1.0 : 0.0,

      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),

      u_opacity: opacity,
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    this.layer.triangulation = polygonTriangulation;
    this.layer
      .buildLayerModel({
        moduleName: 'polygonTile',
        vertexShader: polygon_tile_vert,
        fragmentShader: polygon_tile_frag,
        triangulation: polygonTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        workerOptions: {
          modelType: 'polygonTile',
        },
      })
      .then((model) => {
        callbackModel([model as IModel]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels() {
    this.dataTexture?.destroy();
  }

  protected registerBuiltinAttributes() {
    //
  }
}
