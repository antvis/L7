import Material from './../material';
import { getModule } from '../../../util/shaderModule';
export default class MaskMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
      },
      defines: {

      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    const { vs, fs } = getModule('mask_quard');
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'MaskMaterial';
    this.defines = Object.assign(defines, _defines);
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}
