/**
 * inspired by threebox & Mapbox examples
 * @see https://github.com/peterqliu/threebox/blob/master/src/Threebox.js
 * @see https://github.com/peterqliu/threebox/blob/master/examples/Object3D.html
 */
import { IMercator } from '@antv/l7-core';
import {
  AnimationMixer,
  Camera,
  Matrix4,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import BaseLayer from '../core/BaseLayer';
const DEG2RAD = Math.PI / 180;
export default class ThreeJSLayer extends BaseLayer<{
  onAddMeshes: (threeScene: Scene, layer: ThreeJSLayer) => void;
}> {
  public name: string = 'ThreeJSLayer';
  public type: string = 'custom';

  private scene: Scene;
  private camera: Camera;
  private renderer: WebGLRenderer;
  private animateMixer: AnimationMixer[] = [];

  // 地图中点墨卡托坐标
  private center: IMercator;

  // 初始状态相机变换矩阵
  private cameraTransform: Matrix4;

  /**
   * 根据模型
   */
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number = 0,
    rotation: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
  ): Matrix4 {
    return new Matrix4().fromArray(
      this.mapService.getModelMatrix(
        lnglat,
        altitude,
        rotation,
        scale,
        this.center,
      ),
    );
  }

  public buildModels() {
    const canvas = this.rendererService.getCanvas();
    const gl = this.rendererService.getGLContext();
    if (canvas && gl) {
      const center = this.mapService.getCenter();
      this.center = this.mapService.lngLatToMercator(
        [center.lng, center.lat],
        0,
      );
      const { x, y, z } = this.center;
      this.cameraTransform = new Matrix4().makeTranslation(x, y, z);

      this.renderer = new WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
      });

      // L7 负责 clear
      this.renderer.autoClear = false;
      // 是否需要 gamma correction?
      this.renderer.gammaFactor = 2.2;
      this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = PCFSoftShadowMap;

      this.scene = new Scene();
      this.camera = new PerspectiveCamera(45, 1, 1, 2000000);

      const config = this.getLayerConfig();
      if (config && config.onAddMeshes) {
        config.onAddMeshes(this.scene, this);
      }
    }
  }
  public renderModels() {
    return this.mapService.constructor.name === 'AMapService'
      ? this.renderAMapModels()
      : this.renderMapboxModels();
  }
  public renderMapboxModels() {
    // const { width, height } = this.rendererService.getViewportSize();
    // this.renderer.setSize(width, height, false);

    const gl = this.rendererService.getGLContext();
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    // 同步相机
    const mercatorMatrix = new Matrix4().fromArray(
      // @ts-ignore
      this.mapService.map.transform.customLayerMatrix(),
    );

    this.camera.projectionMatrix = mercatorMatrix.multiply(
      this.cameraTransform,
    );
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.rendererService.setBaseState();
    this.animateMixer.forEach((mixer: AnimationMixer) => {
      mixer.update(this.getTime());
    });
    return this;
  }

  public renderAMapModels() {
    const gl = this.rendererService.getGLContext();
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // @ts-ignore
    const mapCamera = this.mapService.map.getCameraState();
    const camera = this.camera;
    let { pitch, rotation } = mapCamera;
    const { fov, near, far, height, aspect } = mapCamera;
    pitch *= DEG2RAD;
    rotation *= DEG2RAD;
    // @ts-ignore
    camera.fov = (180 * fov) / Math.PI;
    // @ts-ignore
    camera.aspect = aspect;
    // @ts-ignore
    camera.near = near;
    // @ts-ignore
    camera.far = far;
    // @ts-ignore
    camera.updateProjectionMatrix();
    camera.position.z = height * Math.cos(pitch);
    camera.position.x = height * Math.sin(pitch) * Math.sin(rotation);
    camera.position.y = -height * Math.sin(pitch) * Math.cos(rotation);
    camera.up.x = -Math.cos(pitch) * Math.sin(rotation);
    camera.up.y = Math.cos(pitch) * Math.cos(rotation);
    camera.up.z = Math.sin(pitch);
    camera.lookAt(0, 0, 0);
    camera.position.x += mapCamera.position.x;
    camera.position.y += -mapCamera.position.y;
    this.renderer.state.reset();
    this.renderer.autoClear = false;
    this.renderer.render(this.scene, this.camera);
    this.animateMixer.forEach((mixer: AnimationMixer) => {
      mixer.update(this.getTime());
    });
    return this;
  }

  public addAnimateMixer(mixer: AnimationMixer) {
    this.animateMixer.push(mixer);
  }
  protected getConfigSchema() {
    return {
      properties: {
        // opacity: {
        //   type: 'altitude',
        //   minimum: 0,
        //   maximum: 100,
        // },
      },
    };
  }
}
