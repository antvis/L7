import { mat4, vec4 } from 'gl-matrix';
import { getDistanceScales } from '../../utils/project';
import type { ICameraService } from '../camera/ICameraService';
import type { ICoordinateSystemService } from './ICoordinateSystemService';
import { CoordinateSystem } from './ICoordinateSystemService';

const VECTOR_TO_POINT_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];

export default class CoordinateSystemService implements ICoordinateSystemService {
  constructor(private cameraService: ICameraService) {}

  public needRefresh: boolean = true;

  /**
   * 1. Web 墨卡托坐标系
   * 2. 偏移经纬度，用于解决高精度抖动问题
   * 3. 瓦片坐标，用于数据瓦片
   * 4. 常规世界坐标系，用于常规 2D/3D 可视化场景
   * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/doml91
   */
  private coordinateSystem: CoordinateSystem;

  /**
   * 屏幕中心点 [lng, lat]
   */
  private viewportCenter: [number, number];

  /**
   * 屏幕中心点的最终投影结果，在 CPU 侧计算后传入 Shader
   * @see https://zhuanlan.zhihu.com/p/57469121
   */
  private viewportCenterProjection: [number, number, number, number];

  /**
   * 像素单位 -> 经纬度 [x, y, z]
   */
  private pixelsPerDegree: [number, number, number];

  /**
   * 像素单位 -> 经纬度 [lng, lat] 使用泰勒级数展开
   * 通过墨卡托坐标系下的差值估计世界坐标系下的差值
   * @see https://zhuanlan.zhihu.com/p/57469121
   */
  private pixelsPerDegree2: [number, number, number];

  /**
   * 像素单位 -> 米
   */
  private pixelsPerMeter: [number, number, number];

  /**
   * 重新计算当前坐标系参数
   * TODO: 使用 memoize 缓存参数以及计算结果
   */
  public refresh(offsetCenter?: [number, number]): void {
    // if (!this.needRefresh) {
    //   return;
    // }
    const zoom = this.cameraService.getZoom();
    const center = offsetCenter ? offsetCenter : this.cameraService.getCenter();

    // 计算像素到米以及经纬度之间的转换
    const { pixelsPerMeter, pixelsPerDegree } = getDistanceScales({
      // longitude: center[0],
      latitude: center[1],
      zoom,
    });
    this.viewportCenter = center;
    this.viewportCenterProjection = [0, 0, 0, 0];
    this.pixelsPerMeter = pixelsPerMeter;
    this.pixelsPerDegree = pixelsPerDegree;
    this.pixelsPerDegree2 = [0, 0, 0];

    if (this.coordinateSystem === CoordinateSystem.LNGLAT) {
      // 继续使用相机服务计算的 VP 矩阵
      this.cameraService.setViewProjectionMatrix(undefined);
    } else if (this.coordinateSystem === CoordinateSystem.LNGLAT_OFFSET) {
      this.calculateLnglatOffset(center, zoom);
    }
    this.needRefresh = false;

    // TODO: 判断是否应用瓦片 & 常规坐标系
  }

  public getCoordinateSystem(): CoordinateSystem {
    return this.coordinateSystem;
  }

  public setCoordinateSystem(coordinateSystem: CoordinateSystem) {
    this.coordinateSystem = coordinateSystem;
  }

  public getViewportCenter(): [number, number] {
    return this.viewportCenter;
  }

  public getViewportCenterProjection(): [number, number, number, number] {
    return this.viewportCenterProjection;
  }

  public getPixelsPerDegree(): [number, number, number] {
    return this.pixelsPerDegree;
  }

  public getPixelsPerDegree2(): [number, number, number] {
    return this.pixelsPerDegree2;
  }

  public getPixelsPerMeter(): [number, number, number] {
    return this.pixelsPerMeter;
  }

  private calculateLnglatOffset(
    center: [number, number],
    zoom: number,
    scale?: number,
    flipY?: boolean,
  ) {
    // http://uber-common.github.io/viewport-mercator-project/docs/api-reference/web-mercator-utils#code-classlanguage-textgetdistancescalesviewportcode
    const {
      pixelsPerMeter: ppm,
      pixelsPerDegree: ppd,
      pixelsPerDegree2,
    } = getDistanceScales({
      // longitude: center[0],
      latitude: center[1],
      zoom,
      scale,
      flipY,
      highPrecision: true,
    });

    let viewMatrix = this.cameraService.getViewMatrix();
    const projectionMatrix = this.cameraService.getProjectionMatrix();
    let viewProjectionMatrix = mat4.multiply(
      [] as unknown as mat4,
      projectionMatrix as unknown as mat4,
      viewMatrix as unknown as mat4,
    );

    // 经纬度投影到 Web 墨卡托坐标系
    const positionPixels = this.cameraService.projectFlat(
      [Math.fround(center[0]), Math.fround(center[1])],
      Math.pow(2, zoom),
    );

    // Web 墨卡托坐标系通过 VP 矩阵变换到世界坐标系
    this.viewportCenterProjection = vec4.transformMat4(
      [] as unknown as vec4,
      [positionPixels[0], positionPixels[1], 0.0, 1.0],
      viewProjectionMatrix as unknown as mat4,
    ) as unknown as [number, number, number, number];

    // Always apply uncentered projection matrix if available (shader adds center)
    viewMatrix = this.cameraService.getViewMatrixUncentered() || viewMatrix;

    // Zero out 4th coordinate ("after" model matrix) - avoids further translations
    viewProjectionMatrix = mat4.multiply(
      [] as unknown as mat4,
      projectionMatrix as unknown as mat4,
      viewMatrix as unknown as mat4,
    );
    viewProjectionMatrix = mat4.multiply(
      [] as unknown as mat4,
      viewProjectionMatrix,
      VECTOR_TO_POINT_MATRIX as unknown as mat4,
    );

    // 重新计算相机 VP 矩阵
    this.cameraService.setViewProjectionMatrix(viewProjectionMatrix as unknown as number[]);

    this.pixelsPerMeter = ppm;
    this.pixelsPerDegree = ppd;
    this.pixelsPerDegree2 = pixelsPerDegree2;
  }
}
