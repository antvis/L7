import * as THREE from '../../core/three';
import Material from './material';
import point_frag from '../shader/point_frag.glsl';
import point_vert from '../shader/point_vert.glsl';

export default class PointMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1 },
        u_stroke: { value: [ 1.0, 1.0, 1.0, 1.0 ] },
        u_strokeWidth: { value: 1 }
      },
      defines: {
        SHAPE: true,
        TEXCOORD_0: false
      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();

    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.defines = Object.assign(defines, _defines);
    this.type = 'PointMaterial';
    this.vertexShader = point_vert;
    this.fragmentShader = point_frag;
    this.transparent = true;
    if (!_uniforms.shape) { this.blending = THREE.AdditiveBlending; }
    if (_uniforms.u_texture) {
      this.defines.TEXCOORD_0 = true;
    }
  }


}
