import colorHalftone from '../../../../shaders/post-processing/colorhalftone.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IColorHalftonePassConfig {
  center: [number, number];
  angle: number;
  size: number;
}

export default class ColorHalftonePass extends BasePostProcessingPass<IColorHalftonePassConfig> {
  protected setupShaders() {
    this.shaderModuleService.registerModule('colorhalftone-pass', {
      vs: quad,
      fs: colorHalftone,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule('colorhalftone-pass');
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
