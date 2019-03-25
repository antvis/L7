import * as THREE from '../three';
import Util from '../../util';

export default class RenderPass {
  constructor(cfg) {
    const defaultCfg = this._getDefaultCfg();
    Util.assign(this, defaultCfg, cfg);
    this._init();
  }

  _getDefaultCfg() {
    const defaultRenderCfg = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false
    };
    return {
      size: null,
      renderCfg: defaultRenderCfg,
      clearColor: 0x000000,
      clearAlpha: 0.0,
      renderToScreen: false,
      renderTarget: true
    };
  }

  _init() {
    this.scene = new THREE.Scene();
    if (this.renderTarget) {
      const size = this.size ? this.size : this.renderer.getSize();
      this.renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, this.renderCfg);
      this.texture = this.renderTarget.texture;
    }
    this.originClearColor = this.renderer.getClearColor();
    this.originClearAlpha = this.renderer.getClearAlpha();
  }

  setSize(width, height) {
    this.size = { width, height };
    this.renderTarget && this.renderTarget.setSize(width, height);
  }

  add(mesh) {
    this.scene.add(mesh);
  }

  remove(mesh) {
    this.scene.remove(mesh);
  }

  render() {
    this.renderer.setClearColor(this.clearColor, this.clearAlpha);
    if (this.renderToScreen) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    } else {
      this.renderTarget && this.renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.renderer.setRenderTarget(null);
    }
    this.renderer.setClearColor(this.originClearColor, this.originClearAlpha);
  }
}
