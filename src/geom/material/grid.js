import Material from './material';
import { getModule } from '../../util/shaderModule';
export default class GridMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1.0 },
        u_time: { value: 0 },
        u_xOffset: { value: 0.01 },
        u_yOffset: { value: 0.01 },
        u_coverage: { value: 0.8 },
        u_activeId: { value: 0 },
        u_activeColor: { value: [ 1.0, 0, 0, 1.0 ] }
      },
      defines: {

      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    const { vs, fs } = getModule('grid');
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'GridMaterial';
    this.defines = Object.assign(defines, _defines);
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}
