import grid_frag from '../shader/hexagon_frag.glsl';
import grid_vert from '../shader/hexagon_vert.glsl';
import Material from './material';


export default class hexagonMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1.0 },
        u_time: { value: 0 },
        u_radius: { value: 0.01 },
        u_angle: { value: 0.01 },
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
    this.type = 'hexagonMaterial';
    this.defines = Object.assign(defines, _defines);
    this.vertexShader = grid_vert;
    this.fragmentShader = grid_frag;
    this.transparent = true;
  }
}
