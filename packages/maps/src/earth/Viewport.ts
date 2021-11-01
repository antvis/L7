import { IMapCamera, IViewport } from '@antv/l7-core';
import { mat4, vec3 } from 'gl-matrix';
import WebMercatorViewport from 'viewport-mercator-project';

export interface IEarthCamera {
  viewportHeight: number;
  viewportWidth: number;
}

export default class Viewport implements IViewport {
  // TODO: 初始化相机的姿态 看向地球
  private xzReg: number = -Math.PI * 0.6;
  private yReg: number = Math.PI * 0.2;
  // 默认的地球相机半径、地球相机缩放层级
  private earthCameraRadius: number = 200;
  private earthCameraZoom: number = 1;

  private cameraPosition: vec3 = vec3.create();

  private viewport: WebMercatorViewport;

  private projectionMatrix: mat4 = mat4.create();
  private modelMatrix: mat4 = mat4.create();
  private viewMatrix: mat4 = mat4.create();
  private viewProjectionMatrix: mat4 = mat4.create();
  private ViewProjectionMatrixUncentered: mat4 = mat4.create();
  private viewUncenteredMatrix: mat4 = mat4.create();

  public syncWithMapCamera(mapCamera: Partial<IEarthCamera>) {
    const { viewportHeight = 1, viewportWidth = 1 } = mapCamera;
    const aspect = viewportWidth / viewportHeight;
    const near = 0.1;
    const far = 10000;
    const fov = 20;

    // 计算透视投影矩阵 projectionMatrix
    mat4.perspective(this.projectionMatrix, fov, aspect, near, far);
    // 计算相机矩阵 viewMatrix
    const x = this.earthCameraRadius * Math.cos(this.xzReg);
    const z = this.earthCameraRadius * Math.sin(this.xzReg);
    const y = this.earthCameraRadius * Math.sin(this.yReg);

    this.cameraPosition = vec3.fromValues(x, y, z);
    vec3.normalize(this.cameraPosition, this.cameraPosition);
    vec3.multiply(
      this.cameraPosition,
      this.cameraPosition,
      vec3.fromValues(
        this.earthCameraRadius,
        this.earthCameraRadius,
        this.earthCameraRadius,
      ),
    );

    vec3.scale(this.cameraPosition, this.cameraPosition, this.earthCameraZoom);

    const crossY = vec3.create();
    vec3.cross(crossY, this.cameraPosition, vec3.fromValues(0, 1, 0));

    const up = vec3.fromValues(0, 1, 0);
    vec3.cross(up, crossY, this.cameraPosition);

    const target = vec3.fromValues(0, 0, 0);
    mat4.lookAt(this.viewMatrix, this.cameraPosition, target, up);
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

  /**
   * 旋转方法 Y 轴
   * @param r
   */
  public rotateY(r: number) {
    this.xzReg += r * Math.min(this.earthCameraZoom * this.earthCameraZoom, 1);
  }

  /**
   * 旋转方法 X 轴
   * @param r
   */
  public rotateX(r: number) {
    this.yReg += r * Math.min(this.earthCameraZoom * this.earthCameraZoom, 1);
  }

  /**
   * 缩放方法
   * @param z
   */
  public scaleZoom(z: number) {
    this.earthCameraZoom += z;
    this.earthCameraZoom = Math.max(this.earthCameraZoom, 0.6);
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
