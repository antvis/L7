import { Bounds, ILngLat, IPoint, Point } from '@antv/l7-core';

export default interface IMapController {
  /**
   * 当前缩放等级
   */
  getZoom(): number;

  /**
   * 中心点经纬度
   */
  getCenter(): ILngLat;

  /**
   * 仰角
   */
  getPitch(): number;

  /**
   * 逆时针旋转角度
   */
  getRotation(): number;

  /**
   * 获取当前地图可视区域 `[西南角、东北角]`
   */
  getBounds(): Bounds;

  /**
   * 放大地图
   */
  zoomIn(): void;

  /**
   * 缩小地图
   */
  zoomOut(): void;

  /**
   * 地图平移到指定点 `[x, y]`
   */
  panTo(p: Point): void;

  /**
   * 地图平移到指定点 `[x, y]`
   */
  panBy(pixel: Point): void;

  /**
   * 调整地图适合指定区域
   */
  fitBounds(bound: Bounds): void;

  setRotation(rotation: number): void;

  setZoomAndCenter(zoom: number, center: Point): void;

  setMapStyle(style: string): void;

  pixelToLngLat(pixel: Point): ILngLat;

  lngLatToPixel(lnglat: Point): IPoint;

  containerToLngLat(pixel: Point): ILngLat;

  lngLatToContainer(lnglat: Point): IPoint;
}
