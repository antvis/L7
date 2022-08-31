import { IModel } from '@antv/l7-core';
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
   
    return {
      u_tileOrigin: tileOrigin || [0, 0],
      u_coord: coord === 'lnglat' ? 1.0 : 0.0,
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
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels() {
  }

  protected registerBuiltinAttributes() {
    //
  }
}
