import hexagonalPixelate from '../../../../shaders/post-processing/hexagonalpixelate.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IHexagonalPixelatePassConfig {
  center: [number, number];
  scale: number;
}

export default class HexagonalPixelatePass extends BasePostProcessingPass<IHexagonalPixelatePassConfig> {
  protected setupShaders() {
    this.shaderModuleService.registerModule('hexagonalpixelate-pass', {
      vs: quad,
      fs: hexagonalPixelate,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule('hexagonalpixelate-pass');
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
