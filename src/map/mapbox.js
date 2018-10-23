import Base from '../core/base';
import { Matrix4 } from '../core/three';// Todo Math
const MAXZOOM = 0;
export class MapBox extends Base {
  getDefaultCfg() {
    return {
      resizeEnable: true,
      viewMode: '3D'
    };
  }
  constructor(container, cfg) {
    super(cfg);
    this.container = container;
    this.initMap();
    this.map.on('load', () => {
      this.addOverLayer();
      this.emit('mapLoad');
    });
  }
  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHp4dWUiLCJhIjoiYnhfTURyRSJ9.Ugm314vAKPHBzcPmY1p4KQ';
    this.set('container', this.container);
    this.map = new mapboxgl.Map(this._attrs);
  }
  addOverLayer() {
    const canvasContainer = this.map.getCanvasContainer();
    this.canvasContainer = canvasContainer;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'canvas-layer';
    this.canvas.id = 'canvaslayer';
    canvasContainer.appendChild(this.canvas);
    this._reSizeCanvas();
  }
  asyncCamera(renderCamera, cameraNode, layerNode) {
    this.updateCamera(renderCamera, cameraNode, layerNode);
    this.map.on('move', () => { this.updateCamera(renderCamera, cameraNode, layerNode); });
    this.map.on('resize', () => { this._reSizeCanvas(); });
  }
  // updateCamera(renderCamera, cameraNode, layerNode) {
  //   const camera = this.getCameraOptions();
  //   const scale = Math.pow(2, (this.map.getZoom() - MAXZOOM));
  //   const { near, far, width, height, pitch, rotation, cameraToCenterDistance, x, y } = camera;
  //   // cameraToCenterDistance = cameraToCenterDistance * scale;
  //   const cameraTarget = [ 0, 0, 0 ];
  //   // const cameraUp = [ -Math.cos(pitch) * Math.sin(rotation), Math.cos(pitch) * Math.cos(rotation), Math.sin(pitch) * cameraToCenterDistance ];
  //   // const cameraUp = [ -Math.cos(pitch) * Math.sin(rotation)  * cameraToCenterDistance, Math.cos(pitch) * Math.cos(rotation) * cameraToCenterDistance, Math.sin(pitch) ];
  //   // const scale = Math.pow(2, this.map.getZoom());
  //   const cameraTranslateZ = mat4.create();
  //   const cameraRotateX = mat4.create();
  //   const cameraRotateZ = mat4.create();
  //   const cameraWorldMatrix = mat4.create();
  //   mat4.fromTranslation(cameraTranslateZ, [ 0, 0, cameraToCenterDistance ]);
  //   mat4.fromXRotation(cameraRotateX, pitch);
  //   mat4.fromZRotation(cameraRotateZ, rotation);
  //   mat4.mul(cameraWorldMatrix, cameraTranslateZ, cameraWorldMatrix);
  //   mat4.mul(cameraWorldMatrix, cameraRotateX, cameraWorldMatrix);
  //   mat4.mul(cameraWorldMatrix, cameraRotateZ, cameraWorldMatrix);


  // // modle
  //   const worldmatrix = mat4.create();
  //   const scaleMat = mat4.create();
  //   const translateMap = mat4.create();
  //   const rotateMap = mat4.create();
  //   const translateCenter = mat4.create();
  //   mat4.fromScaling(scaleMat, [ scale, scale, scale ]);
  //   mat4.fromTranslation(translateMap, [ -x, y, 0 ]);
  //   mat4.fromTranslation(translateCenter, [ 256, -256, 0 ]);
  //   mat4.fromZRotation(rotateMap, Math.PI);

  //   // mat4.mul(worldmatrix,rotateMap,worldmatrix);
  //   // mat4.mul(worldmatrix,translateCenter,worldmatrix);
  //   // mat4.mul(worldmatrix,cameraRotateZ,worldmatrix);
  //   mat4.mul(worldmatrix, scaleMat, worldmatrix);
  //   mat4.mul(worldmatrix, translateMap, worldmatrix);

  //   renderCamera.setPerspective(45, width, height, near, far);
  //   cameraNode.setModelMatrix(cameraWorldMatrix);
  //   layerNode.setModelMatrix(worldmatrix);
  //   // console.log(layerNode.children[0]);

  //   // cameraNode.lookAt(cameraTarget,cameraUp);
  //   cameraNode.lookAt(cameraTarget, [ 0, 0, 1 ]);
  //   renderCamera.render();

  // }
  _resize() {
    this._reSizeCanvas();
  }
  _reSizeCanvas() {
    const canvas = this.map.getCanvas();
    this.canvas.style.cssText = canvas.style.cssText;
    this.canvas.width = canvas.width;
    this.canvas.height = canvas.height;
  }
  getCameraOptions() {
    // fov,  near, far, height, pitch, rotation, position
    const fov = 0.6435011087932844;
    // const altitude = 1.5;
    const Radian = Math.PI / 180;
    const pitch = this.map.getPitch() * Radian;
    const rotation = -this.map.getBearing() * Radian;
    const cameraToCenterDistance = 0.5 / Math.tan(fov / 2) * this.map.transform.height;
    const halfFov = fov / 2;
    const groundAngle = Math.PI / 2 + this.map.transform._pitch;
    const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);
    const furthestDistance = Math.cos(Math.PI / 2 - this.map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;
    const far = furthestDistance * 1.01;


      // Calculate z value of the farthest fragment that should be rendered.
    const { x, y, width, height } = this.map.transform;
    return {
      fov, near: 0.01, far, cameraToCenterDistance, x, y, width, height, pitch, rotation
    };
  }
}
