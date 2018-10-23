
import * as THREE from '../../core/three';
export default class Material extends THREE.ShaderMaterial {
  constructor(opts) {
    super(opts);
  }
  setValue(name, value) {
    this.uniforms[name].value = value;
    this.uniforms.needsUpdate = true;
  }
}
