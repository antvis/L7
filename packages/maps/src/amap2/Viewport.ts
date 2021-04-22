import { IMapCamera, IViewport } from '@antv/l7-core';
import { mat4, vec3 } from 'gl-matrix';

export default class Viewport implements IViewport {
  private projectionMatrix: mat4 = mat4.create();
  private viewMatrix: mat4 = mat4.create();
  private viewProjectionMatrix: mat4 = mat4.create();
  private ViewProjectionMatrixUncentered: mat4 = mat4.create();
  private viewUncenteredMatrix: mat4 = mat4.create();
  private zoom: number;
  private center: number[];

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>) {
    const {
      zoom = 1,
      center = [0, 0],
      offsetOrigin = [0, 0],
      cameraPosition = [0, 0, 0],
      up = [0, 1, 0],
      lookAt = [0, 0, 0],
      aspect = 1,
      near = 0.1,
      far = 1000,
      fov = 0,
    } = mapCamera;
    this.zoom = zoom;
    this.center = center;

    // 计算透视投影矩阵 projectionMatrix
    mat4.perspective(this.projectionMatrix, fov, aspect, near, far);

    // 计算相机矩阵 viewMatrix
    const eyePoint = vec3.fromValues(...cameraPosition);
    const lookAtPoint = vec3.fromValues(...lookAt);
    const upDirect = vec3.fromValues(...up);
    mat4.lookAt(this.viewMatrix, eyePoint, lookAtPoint, upDirect);

    this.viewUncenteredMatrix = mat4.clone(this.viewMatrix);

    // 移动相机位置
    mat4.translate(
      this.viewMatrix,
      this.viewMatrix,
      vec3.fromValues(-offsetOrigin[0], offsetOrigin[1], 0),
    );

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

  public getZoom(): number {
    return this.zoom;
  }

  public getZoomScale(): number {
    // 512 尺寸下的缩放：2 ^ 19
    return 524288;
  }

  public getCenter(): [number, number] {
    const [lng, lat] = this.center;
    return [lng, lat];
  }

  public getProjectionMatrix(): number[] {
    // @ts-ignore
    return this.projectionMatrix;
  }

  public getViewMatrix(): number[] {
    // @ts-ignore
    return this.viewMatrix;
  }

  public getViewMatrixUncentered(): number[] {
    // @ts-ignore
    return this.viewUncenteredMatrix;
  }
  public getViewProjectionMatrix(): number[] {
    // @ts-ignore
    return this.viewProjectionMatrix;
  }

  public getViewProjectionMatrixUncentered(): number[] {
    // @ts-ignore
    return this.ViewProjectionMatrixUncentered;
  }

  public getFocalDistance() {
    return 1;
  }

  /**
   * P20 坐标系，固定 scale
   */
  public projectFlat(
    lngLat: [number, number],
    scale?: number | undefined,
  ): [number, number] {
    const maxs = 85.0511287798;
    const lat = Math.max(Math.min(maxs, lngLat[1]), -maxs);
    // tslint:disable-next-line:no-bitwise
    const zoomScale = 256 << 20;
    let d = Math.PI / 180;
    let x = lngLat[0] * d;
    let y = lat * d;
    y = Math.log(Math.tan(Math.PI / 4 + y / 2));
    const a = 0.5 / Math.PI;
    const b = 0.5;
    const c = -0.5 / Math.PI;
    d = 0.5;
    x = zoomScale * (a * x + b) - 215440491;
    y = -(zoomScale * (c * y + d) - 106744817);
    return [x, y];
  }
}
