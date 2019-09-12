
import * as THREE from '../../core/three';
export default class Material extends THREE.ShaderMaterial {
  setUniformsValue(name, value) {
    if (!this.uniforms[name]) { return; }
    this.uniforms[name].value = value;
    this.uniforms.needsUpdate = true;
  }
  setDefinesvalue(name, value) {
    this.defines[name] = value;
    this.needsUpdate = true;
  }
  setUniform(option) {
    const uniforms = {};
    for (const key in option) {
      if (key.substr(0, 2) === 'u_') {
        uniforms[key] = { value: option[key] };
      }
    }
    return uniforms;
  }
  updateUninform(option) {
    for (const key in option) {
      if (key.substr(0, 2) === 'u_') {
        this.setUniformsValue(key, option[key]);
      }
    }
  }
  setBending(type) {
    this.blending = THREE[Material.blendingEnum[type]] || THREE.NormalBlending;
  }
}
Material.blendingEnum = {
  normal: 'NormalBlending',
  additive: 'AdditiveBlending',
  subtractive: 'SubtractiveBlending'
};

