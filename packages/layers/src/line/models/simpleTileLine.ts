import {
  gl,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask, rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { TileSimpleLineTriangulation } from '../../core/triangulation';
import simple_line_frag from '../../shader/minify_frag.glsl';
import simple_line_vert from '../shaders/tile/simpleline_vert.glsl';

import simple_line_map_frag from '../../shader/minify_frag.glsl';
import simple_line_map_vert from '../shaders/tile/simpleline_map_vert.glsl';
export default class SimpleTileLineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      usage,
      color = '#fff'
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_color: usage === 'basemap' ? rgb2arr(color): [0, 0, 0, 0]
    };
  }

  public async initModels(): Promise<IModel[]> {
      return await this.buildModels();
  }

  public clearModels() {
  }

 public async buildModels():Promise<IModel[]> {
    const {
      mask = false,
      maskInside = true,
      usage
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
   const model = await this.layer
      .buildLayerModel({
        moduleName: 'lineTileSimpleNormal_' + usage,
        vertexShader: usage === 'basemap' ? simple_line_map_vert : simple_line_vert,
        fragmentShader: usage === 'basemap' ? simple_line_map_frag : simple_line_frag,
        triangulation: TileSimpleLineTriangulation,
        primitive: gl.LINES,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        pick: false,
      })
     return [model]
  }

  protected registerBuiltinAttributes() {
  }
}
