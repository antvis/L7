import { inject, injectable } from 'inversify';
import { isNil } from 'lodash';
import blur from '../../../../shaders/post-processing/blur.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../../types';
import { IRendererService } from '../../IRendererService';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IBlurVPassConfig {
  blurRadius: number;
}

@injectable()
export default class BlurVPass extends BasePostProcessingPass<
  IBlurVPassConfig
> {
  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  public getName() {
    return 'blurV';
  }

  public setupShaders() {
    this.shaderModule.registerModule('blur-pass', {
      vs: quad,
      fs: blur,
    });

    const { vs, fs, uniforms } = this.shaderModule.getModule('blur-pass');
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
    options: Partial<IBlurVPassConfig>,
  ): {
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
