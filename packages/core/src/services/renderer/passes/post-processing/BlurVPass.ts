import { lodashUtil } from '@antv/l7-utils';
import blur from '../../../../shaders/post-processing/blur.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import type { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';
const { isNil } = lodashUtil;

export interface IBlurVPassConfig {
  blurRadius: number;
}

export default class BlurVPass extends BasePostProcessingPass<IBlurVPassConfig> {
  public setupShaders() {
    this.shaderModuleService.registerModule('blur-pass', {
      vs: quad,
      fs: blur,
    });

    const { vs, fs, uniforms } =
      this.shaderModuleService.getModule('blur-pass');
    const { width, height } = this.rendererService.getViewportSize();

    return {
      vs,
      fs,
      uniforms: {
        ...uniforms,
        u_ViewportSize: [width, height],
      },
    };
  }

  protected convertOptionsToUniforms(options: Partial<IBlurVPassConfig>): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.blurRadius)) {
      uniforms.u_BlurDir = [0, options.blurRadius];
    }

    return uniforms;
  }
}
