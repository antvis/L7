import Base from '../core/base';
import Util from '../util';
import { scene } from '../global';
import * as THREE from '../core/three';
const WORLD_SIZE = 512;
export class MapBoxProvider extends Base {
  getDefaultCfg() {
    return Util.assign(scene, {
      resizeEnable: true,
      viewMode: '3D'
    });
  }
  constructor(container, cfg, engine) {
    super(cfg);
    this.container = container;
    this.engine = engine;
    const scene = engine._scene;
    this.initMap();
    this.addOverLayer();
    scene.position.x = scene.position.y = WORLD_SIZE / 2;
    scene.matrixAutoUpdate = false;
    setTimeout(() => {
      this.emit('mapLoad');
    }, 100);

  }

  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHp4dWUiLCJhIjoiYnhfTURyRSJ9.Ugm314vAKPHBzcPmY1p4KQ';
    this.map = new mapboxgl.Map(this._attrs);
    this.map.on('move', () => {
      this.updateCamera();
    });
    this.updateCamera();
  }
  asyncCamera() {
    const engine = this.engine;
    const camera = engine._camera;
    const scene = engine._scene;
    // Build a projection matrix, paralleling the code found in Mapbox GL JS
    const fov = 0.6435011087932844;
    const cameraToCenterDistance = 0.5 / Math.tan(fov / 2) * this.map.transform.height;
    const halfFov = fov / 2;
    const groundAngle = Math.PI / 2 + this.map.transform._pitch;
    const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

    // Calculate z distance of the farthest fragment that should be rendered.
    const furthestDistance = Math.cos(Math.PI / 2 - this.map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;

    // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
    const farZ = furthestDistance * 1.01;

    camera.projectionMatrix = this.makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);


    const cameraWorldMatrix = new THREE.Matrix4();
    const cameraTranslateZ = new THREE.Matrix4().makeTranslation(0, 0, cameraToCenterDistance);
    const cameraRotateX = new THREE.Matrix4().makeRotationX(this.map.transform._pitch);
    const cameraRotateZ = new THREE.Matrix4().makeRotationZ(this.map.transform.angle);

    // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
    // If this is applied directly to the projection matrix, it will work OK but break raycasting
    cameraWorldMatrix
        .premultiply(cameraTranslateZ)
        .premultiply(cameraRotateX)
        .premultiply(cameraRotateZ);

    camera.matrixWorld.copy(cameraWorldMatrix);


    const zoomPow = this.map.transform.scale;
    // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
    const scale = new THREE.Matrix4();
    const translateCenter = new THREE.Matrix4();
    const translateMap = new THREE.Matrix4();
    const rotateMap = new THREE.Matrix4();
    scale
        .makeScale(zoomPow, zoomPow, zoomPow);
    translateCenter
        .makeTranslation(WORLD_SIZE / 2, -WORLD_SIZE / 2, 0);
    translateMap
        .makeTranslation(-this.map.transform.x, this.map.transform.y, 0);
    rotateMap
        .makeRotationZ(Math.PI);

    scene.matrix = new THREE.Matrix4();
    scene.matrix
        .premultiply(rotateMap)
        .premultiply(translateCenter)
        .premultiply(scale)
        .premultiply(translateMap);
  }
  makePerspectiveMatrix(fovy, aspect, near, far) {
    const out = new THREE.Matrix4();
    const f = 1.0 / Math.tan(fovy / 2),
      nf = 1 / (near - far);
    const newMatrix = [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
    out.elements = newMatrix;
    return out;
  }

  projectFlat(lnglat) {
    return this.map.lngLatToGeodeticCoord(lnglat);
  }
  getCenter() {
    return this.map.getCenter();
  }
  getCenterFlat() {
    return this.projectFlat(this.getCenter());
  }
  addOverLayer() {
    const canvasContainer = document.getElementById(this.container);
    this.canvasContainer = canvasContainer;
    this.renderDom = document.createElement('div');
    this.renderDom.style.cssText += 'position: absolute;top: 0; z-index:1;height: 100%;width: 100%;pointer-events: none;';
    this.renderDom.id = 'l7_canvaslayer';
    canvasContainer.appendChild(this.renderDom);
  }
}
