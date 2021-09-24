import { IMapCamera, IViewport } from '@antv/l7-core';
import { mat4, vec3 } from 'gl-matrix';
import WebMercatorViewport from 'viewport-mercator-project';

export default class Viewport implements IViewport {
  private xzReg: number = -Math.PI * 0.6;
  private yReg: number = Math.PI * 0.3;
  private earthRadius = 200;
  private earthZoom: number = 1;

  private eye: vec3 = vec3.create();

  private viewport: WebMercatorViewport;

  private projectionMatrix: mat4 = mat4.create();
  private modelMatrix: mat4 = mat4.create();
  private viewMatrix: mat4 = mat4.create();
  private viewProjectionMatrix: mat4 = mat4.create();
  private ViewProjectionMatrixUncentered: mat4 = mat4.create();
  private viewUncenteredMatrix: mat4 = mat4.create();

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>) {
    const { viewportHeight = 1, viewportWidth = 1 } = mapCamera;
    const aspect = viewportWidth / viewportHeight;
    const near = 0.1;
    const far = 10000;
    const fov = 20;

    // 计算透视投影矩阵 projectionMatrix
    mat4.perspective(this.projectionMatrix, fov, aspect, near, far);
    // 计算相机矩阵 viewMatrix
    const x = this.earthRadius * Math.cos(this.xzReg);
    const z = this.earthRadius * Math.sin(this.xzReg);
    const y = this.earthRadius * Math.sin(this.yReg);

    // const eye = vec3.fromValues(100, 100, 100);
    this.eye = vec3.fromValues(x, y, z);
    vec3.normalize(this.eye, this.eye);
    vec3.multiply(
      this.eye,
      this.eye,
      vec3.fromValues(this.earthRadius, this.earthRadius, this.earthRadius),
    );

    vec3.scale(this.eye, this.eye, this.earthZoom);

    const crossY = vec3.create();
    vec3.cross(crossY, this.eye, vec3.fromValues(0, 1, 0));

    const up = vec3.fromValues(0, 1, 0);
    vec3.cross(up, crossY, this.eye);

    mat4.lookAt(this.viewMatrix, this.eye, vec3.fromValues(0, 0, 0), up);
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
  }

  public rotateY(r: number) {
    this.xzReg += r * Math.min(this.earthZoom * this.earthZoom, 1);
  }

  public rotateX(r: number) {
    this.yReg += r * Math.min(this.earthZoom * this.earthZoom, 1);
  }

  public scaleZoom(z: number) {
    this.earthZoom += z;
    this.earthZoom = Math.max(this.earthZoom, 0.6);
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
