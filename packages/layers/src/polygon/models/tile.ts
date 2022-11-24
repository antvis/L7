import { IModel } from '@antv/l7-core';
import { getMask, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';

import polygon_tile_frag from '../../shader/minify_picking_frag.glsl';
import polygon_tile_vert from '../shaders/tile/polygon_tile_vert.glsl';
import polygon_tile_map_frag from '../../shader/minify_frag.glsl';
import polygon_tile_map_vert from '../shaders/tile/polygon_tile_map_vert.glsl';
export default class FillModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 1,
      // tileOrigin,
      // coord = 'lnglat',
      usage,
      color = '#fff'
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
   
    return {
      // u_tileOrigin: tileOrigin || [0, 0],
      // u_coord: coord === 'lnglat' ? 1.0 : 0.0,
      u_opacity: opacity,
      u_color: usage === 'basemap' ? rgb2arr(color): [0, 0, 0, 0]
    };
  }

  public async initModels(): Promise<IModel[]> {
      return await this.buildModels();
  }

 public async buildModels():Promise<IModel[]> {
    const {
      mask = false,
      maskInside = true,
      usage
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    this.layer.triangulation = polygonTriangulation;
   const model = await this.layer
      .buildLayerModel({
        moduleName: 'polygonTile_' + usage,
        vertexShader: usage === 'basemap' ? polygon_tile_map_vert : polygon_tile_vert,
        fragmentShader: usage === 'basemap' ? polygon_tile_map_frag : polygon_tile_frag,
        triangulation: polygonTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        pick: usage !== 'basemap'
      })
     return [model]
  }

  public clearModels() {
  }

  protected registerBuiltinAttributes() {
    //
  }
}
