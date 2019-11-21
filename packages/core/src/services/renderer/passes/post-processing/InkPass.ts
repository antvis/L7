import { inject, injectable } from 'inversify';
import { isNil } from 'lodash';
import ink from '../../../../shaders/post-processing/ink.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../../types';
import { IRendererService } from '../../IRendererService';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IInkPassConfig {
  strength: number;
}

@injectable()
export default class InkPass extends BasePostProcessingPass<IInkPassConfig> {
  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  public getName() {
    return 'ink';
  }

  protected setupShaders() {
    this.shaderModule.registerModule('ink-pass', {
      vs: quad,
      fs: ink,
    });

    const { vs, fs, uniforms } = this.shaderModule.getModule('ink-pass');
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
    options: Partial<IInkPassConfig>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.strength)) {
      uniforms.u_Strength = options.strength;
    }

    return uniforms;
  }
}
