import { gl, IModel } from '@antv/l7-core';
import { isNumber } from 'lodash';
import BaseModel, { styleSingle } from '../../core/BaseModel';
import { polygonTriangulation } from '../../core/triangulation';
import mask_frag from '../shaders/mask_frag.glsl';
import mask_vert from '../shaders/mask_vert.glsl';
interface IMaskStyleOptions {
  opacity: styleSingle;
}
export default class MaskModel extends BaseModel {
  public getUninforms() {
    const { opacity = 0 } = this.layer.getLayerConfig() as IMaskStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 0.0,
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'mask',
        vertexShader: mask_vert,
        fragmentShader: mask_frag,
        triangulation: polygonTriangulation,
        blend: this.getBlend(),
        depth: { enable: false },

        stencil: {
          enable: true,
          mask: 0xff,
          func: {
            cmp: gl.ALWAYS,
            ref: 1,
            mask: 0xff,
          },
          opFront: {
            fail: gl.REPLACE,
            zfail: gl.REPLACE,
            zpass: gl.REPLACE,
          },
        },
      }),
    ];
  }

  public clearModels() {
    this.dataTexture?.destroy();
    this.layerService.clear();
  }

  protected registerBuiltinAttributes() {
    return '';
  }
}
