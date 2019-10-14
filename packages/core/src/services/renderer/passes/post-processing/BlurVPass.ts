import { injectable } from 'inversify';
import { lazyInject } from '../../../../index';
import blur from '../../../../shaders/post-processing/blur.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../../types';
import { IRendererService } from '../../IRendererService';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IBlurVPassConfig {
  blurRadius: number;
}

const defaultConfig: IBlurVPassConfig = {
  blurRadius: 8.0,
};

@injectable()
export default class BlurVPass extends BasePostProcessingPass<
  IBlurVPassConfig
> {
  @lazyInject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  public setupShaders() {
    this.shaderModule.registerModule('blur-pass', {
      vs: quad,
      fs: blur,
    });

    const { vs, fs, uniforms } = this.shaderModule.getModule('blur-pass');
    const { width, height } = this.rendererService.getViewportSize();

    const { blurRadius } = {
      ...defaultConfig,
      ...this.config,
    };

    return {
      vs,
      fs,
      uniforms: {
        ...uniforms,
        u_BlurDir: [0, blurRadius],
        u_ViewportSize: [width, height],
      },
    };
  }
}
