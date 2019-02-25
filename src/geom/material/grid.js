import grid_frag from '../shader/grid_frag.glsl';
import grid_vert from '../shader/grid_vert.glsl';
import Material from './material';


export default class GridMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1.0 },
        u_time: { value: 0 },
        u_xOffset: { value: 0.01 },
        u_yOffset: { value: 0.01 },
        u_coverage: { value: 0.8 }
      },
      defines: {

      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'GridMaterial';
    this.defines = Object.assign(defines, _defines);
    this.vertexShader = grid_vert;
    this.fragmentShader = grid_frag;
    this.transparent = true;
  }
}
