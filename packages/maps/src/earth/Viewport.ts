import { IMapCamera, IViewport } from '@antv/l7-core';
import { mat4, vec3 } from 'gl-matrix';
import WebMercatorViewport from 'viewport-mercator-project';

export default class Viewport implements IViewport {
  private viewport: WebMercatorViewport;

  private projectionMatrix: mat4 = mat4.create();
  private modelMatrix: mat4 = mat4.create();
  private viewMatrix: mat4 = mat4.create();
  private viewProjectionMatrix: mat4 = mat4.create();
  private ViewProjectionMatrixUncentered: mat4 = mat4.create();
  private viewUncenteredMatrix: mat4 = mat4.create();

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>) {
    const aspect = 1;
    const near = 0.1;
    const far = 10000;
    const fov = 40;

    // 计算透视投影矩阵 projectionMatrix
    mat4.perspective(this.projectionMatrix, fov, aspect, near, far);
    // 计算相机矩阵 viewMatrix
    const eye = vec3.fromValues(100, 100, 100);
    const up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(this.viewMatrix, eye, vec3.fromValues(0, 0, 0), up);
    this.viewUncenteredMatrix = mat4.clone(this.viewMatrix);

    mat4.multiply(
      this.viewProjectionMatrix,
      this.projectionMatrix,
      this.viewMatrix,
    );
    mat4.multiply(
      this.ViewProjectionMatrixUncentered,
      this.projectionMatrix,
      this.viewMatrix,
    );

    // console.log('this.modelMatrix');
    // setInterval(() => {
    //   mat4.rotateY(this.modelMatrix, this.modelMatrix, 0.001);
    // }, 20);
  }

  public getZoom(): number {
    return 4;
  }

  public getZoomScale(): number {
    return Math.pow(2, this.getZoom());
  }

  public getCenter(): [number, number] {
    return [0, 0];
  }

  public getProjectionMatrix(): number[] {
    return this.projectionMatrix as number[];
  }

  public getModelMatrix(): number[] {
    return this.modelMatrix as number[];
  }

  public getViewMatrix(): number[] {
    return this.viewMatrix as number[];
  }

  public getViewMatrixUncentered(): number[] {
    return this.viewMatrix as number[];
  }
  public getViewProjectionMatrix(): number[] {
    return this.viewProjectionMatrix as number[];
  }

  public getViewProjectionMatrixUncentered(): number[] {
    return this.viewProjectionMatrix as number[];
  }
  public getFocalDistance() {
    return 1;
  }

  public projectFlat(
    lngLat: [number, number],
    scale?: number | undefined,
  ): [number, number] {
    return this.viewport.projectFlat(lngLat, scale);
  }
}
