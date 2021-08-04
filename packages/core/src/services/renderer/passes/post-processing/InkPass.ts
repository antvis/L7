import { injectable } from 'inversify';
import 'reflect-metadata';
import ink from '../../../../shaders/post-processing/ink.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IInkPassConfig {
  strength: number;
}

@injectable()
export default class InkPass extends BasePostProcessingPass<IInkPassConfig> {
  protected setupShaders() {
    this.shaderModuleService.registerModule('ink-pass', {
      vs: quad,
      fs: ink,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule('ink-pass');
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
}
