import {
  Bounds,
  ICameraOptions,
  ILngLat,
  IPoint,
  IStatusOptions,
  Point,
} from '@antv/l7-core';

export default interface IMapController {
  /**
   * 当前缩放等级
   */
  getZoom(): number;

  /**
   * 中心点经纬度
   */
  getCenter(options?: ICameraOptions): ILngLat;

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
  panBy(x: number, y: number): void;

  /**
   * 调整地图适合指定区域
   */
  fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void;

  getContainer(): HTMLElement | null;
  getSize(): [number, number];
  // get map status method
  getMinZoom(): number;
  getMaxZoom(): number;
  // get map params
  getType(): string;
  getMapContainer(): HTMLElement | null;
  getMapCanvasContainer(): HTMLElement;

  // control with raw map
  setRotation(rotation: number): void;
  setZoomAndCenter(zoom: number, center: Point): void;
  setCenter(center: [number, number], options?: ICameraOptions): void;
  setPitch(pitch: number): void;
  setZoom(zoom: number): void;
  setMapStyle(style: any): void;
  setMapStatus(option: Partial<IStatusOptions>): void;

  // coordinates methods
  pixelToLngLat(pixel: Point): ILngLat;
  lngLatToPixel(lnglat: Point): IPoint;
  containerToLngLat(pixel: Point): ILngLat;
  lngLatToContainer(lnglat: Point): IPoint;
  exportMap(type: 'jpg' | 'png'): string;
}
