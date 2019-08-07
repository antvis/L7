import * as THREE from '../three';
export default class Renderer {
  constructor(container) {
    this.container = container;
    this.initRender();
    this.updateSize();
    window.addEventListener('resize', this.updateSize.bind(this), false);
  }
  initRender() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      autoClear: false
    });
    this.renderer.setClearColor(0xff0000, 0.0);
    this.pixelRatio = window.devicePixelRatio;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = false;
    this.container.appendChild(this.renderer.domElement);
  }
  updateSize() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

  }
}
