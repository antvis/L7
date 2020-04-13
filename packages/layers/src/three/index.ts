/**
 * inspired by threebox & Mapbox examples
 * @see https://github.com/peterqliu/threebox/blob/master/src/Threebox.js
 * @see https://github.com/peterqliu/threebox/blob/master/examples/Object3D.html
 */
import { IMercator } from '@antv/l7-core';
import { Camera, Matrix4, Scene, WebGLRenderer } from 'three';
import BaseLayer from '../core/BaseLayer';

export default class ThreeJSLayer extends BaseLayer<{
  onAddMeshes: (threeScene: Scene, layer: ThreeJSLayer) => void;
}> {
  public name: string = 'ThreeJSLayer';

  private scene: Scene;
  private camera: Camera;
  private renderer: WebGLRenderer;

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
      this.renderer.gammaOutput = true;
      this.renderer.gammaFactor = 2.2;

      this.scene = new Scene();
      // 后续同步 L7 相机
      this.camera = new Camera();

      const config = this.getLayerConfig();
      if (config && config.onAddMeshes) {
        config.onAddMeshes(this.scene, this);
      }
    }
  }

  public renderModels() {
    const { width, height } = this.rendererService.getViewportSize();
    this.renderer.setSize(width, height, false);

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
    return this;
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
