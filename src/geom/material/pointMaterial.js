
import Material from './material';
import * as THREE from '../../core/three';
import { getModule } from '../../util/shaderModule';
import picking_frag from '../../core/engine/picking//picking_frag.glsl';
export default class PointMaterial extends Material {
  getDefaultParameters() {
    return {
      uniforms: {
        u_opacity: { value: 1 },
        u_stroke: { value: [ 1.0, 1.0, 1.0, 1.0 ] },
        u_strokeWidth: { value: 1 },
        u_activeId: { value: 0 }
      },
      defines: {
        SHAPE: false,
        TEXCOORD_0: false
      }
    };
  }
  constructor(_uniforms, _defines, parameters) {
    super(parameters);
    const { uniforms, defines } = this.getDefaultParameters();
    const { vs, fs } = getModule('point');
    this.uniforms = Object.assign(uniforms, this.setUniform(_uniforms));
    this.defines = Object.assign(defines, _defines);
    this.type = 'PointMaterial';
    this.vertexShader = vs;
    this.fragmentShader = fs;
    this.transparent = true;

    if (!this.uniforms.shape) { this.blending = THREE.AdditiveBlending; }
    if (this.uniforms.u_texture) {
      this.defines.TEXCOORD_0 = true;
    }
  }
}
