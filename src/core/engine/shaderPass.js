import * as THREE from '../three';
import RenderPass from './renderpass';

export default class ShaderPass extends RenderPass {

  constructor(cfg) {
    super({
      size: { width: 2, height: 2 },
      ...cfg
    });
  }

  _init(cfg) {
    super._init(cfg);
    this.camera = new THREE.OrthographicCamera(-this.size.width / 2, this.size.width / 2, this.size.height / 2, -this.size.height / 2, 0, 100);
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
      ...this.matCfg
    });
    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.size.width, this.size.height), this.material);
    this.quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add(this.quad);
  }
}
