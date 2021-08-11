import { injectable } from 'inversify';
import { isNil } from 'lodash';
import 'reflect-metadata';
import blur from '../../../../shaders/post-processing/blur.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IBlurHPassConfig {
  blurRadius: number;
}

@injectable()
export default class BlurHPass extends BasePostProcessingPass<
  IBlurHPassConfig
> {
  protected setupShaders() {
    this.shaderModuleService.registerModule('blur-pass', {
      vs: quad,
      fs: blur,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule(
      'blur-pass',
    );
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

  protected convertOptionsToUniforms(
    options: Partial<IBlurHPassConfig>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.blurRadius)) {
      uniforms.u_BlurDir = [options.blurRadius, 0];
    }

    return uniforms;
  }
}
