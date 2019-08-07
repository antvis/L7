import * as THREE from '../three';
export default class Camera {
  constructor(container) {
    this.container = container;
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 2000000);
    this.camera = camera;
    this.updateSize();
    window.addEventListener('resize', this.updateSize.bind(this));

  }
  updateSize() {
    const container = this.container;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
  }
}
