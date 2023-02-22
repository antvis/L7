import { IModel } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IMaskLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import mask_frag from '../../shader/minify_frag.glsl';
import mask_vert from '../shaders/mask_vert.glsl';

export default class MaskModel extends BaseModel {
  public getUninforms() {
    const { opacity = 1, color = '#000' } =
      this.layer.getLayerConfig() as IMaskLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 0.0,
      u_color: rgb2arr(color),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const model = await this.layer.buildLayerModel({
      moduleName: 'mask',
      vertexShader: mask_vert,
      fragmentShader: mask_frag,
      triangulation: polygonTriangulation,
      depth: { enable: false },
      pick: false,
    });
    return [model];
  }

  public clearModels(refresh = true) {
    if (refresh) {
      this.layerService.clear();
    }
  }

  protected registerBuiltinAttributes() {
    return '';
  }
}
