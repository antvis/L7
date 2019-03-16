import * as THREE from '../three';

export default class RenderPass {
  constructor(cfg) {
    this.scene;
    this.camera = cfg.camera;
    this.renderer = cfg.renderer;
    this.clearColor = cfg.clear.clearColor;
    this.clearAlpha = cfg.clear.clearAlpha;
    this.size = cfg.size ? cfg.size : cfg.renderer.getSize();
    const defaultRenderCfg = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false
    };
    this.renderCfg = cfg.renderCfg ? cfg.renderCfg : defaultRenderCfg;
    this._init(cfg);
  }

  _init() {
    this.scene = new THREE.Scene();
    this.pass = new THREE.WebGLRenderTarget(this.size.width, this.size.height, this.renderCfg);
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
    this.renderer.render(this.scene, this.camera, this.pass, true);
    this.renderer.setRenderTarget(null);
    this.renderer.setClearColor(this.originClearColor, this.originClearAlpha);
  }
}
