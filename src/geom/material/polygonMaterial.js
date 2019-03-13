import Material from './material';
import { getModule } from '../../util/shaderModule';
export default class PolygonMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1.0 },
        u_time: { value: 0 },
        u_zoom: { value: 0 },
        u_baseColor: { value: [ 1.0, 0, 0, 1.0 ] },
        u_brightColor: { value: [ 1.0, 0, 0, 1.0 ] },
        u_windowColor: { value: [ 1.0, 0, 0, 1.0 ] },
        u_near: { value: 0.0 },
        u_far: { value: 1.0 },
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
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.type = 'PolygonMaterial';
    this.defines = Object.assign(defines, _defines);

    const { vs, fs } = getModule('polygon');
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;
  }
}
