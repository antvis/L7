import * as THREE from '../three';

export class RenderPass {
  constructor(cfg) {
    this.scene;
    this.camera = cfg.camera;
    this.renderer = cfg.renderer;
    this.clearColor = cfg.clear.clearColor;
    this.clearAlpha = cfg.clear.clearAlpha;
    this._init(cfg);
  }

  _init() {
    this.scene = new THREE.Scene();
    const parameters = { minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false
    };
    const size = this.renderer.getSize();
    this.pass = new THREE.WebGLRenderTarget(size.width, size.height, parameters);
    this.originClearColor = this.renderer.getClearColor();
    this.originClearAlpha = this.renderer.getClearAlpha();
    this.texture = this.pass.texture;
  }

  add(mesh) {
    this.scene.add(mesh);
  }

  remove(mesh) {
    this.scene.remove(mesh);
  }

  render() {
    this.renderer.setClearColor(this.clearColor, this.clearAlpha);
    this.renderer.render(this.scene, this.camera, this.pass, true); // this.pass,true
    this.renderer.setClearColor(this.clearColor, this.clearAlpha);
  }
}
