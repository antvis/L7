import { IViewport } from '../camera/ICameraService';
export type Point = [number, number];
export type Bounds = [[number, number], [number, number]];
export interface ILngLat {
  lng: number;
  lat: number;
}
export interface IPoint {
  x: number;
  y: number;
}
export interface IMapService {
  init(config: Partial<IMapConfig>): void;
  onCameraChanged(callback: (viewport: IViewport) => void): void;
  // get map status method
  getZoom(): number;
  getCenter(): ILngLat;
  getPitch(): number;
  getRotation(): number;
  getBounds(): Bounds;

  // set Map status

  setRotation(rotation: number): void;
  zoomIn(): void;
  zoomOut(): void;
  panTo(p: Point): void;
  panBy(pixel: Point): void;
  fitBounds(bound: Bounds): void;
  setZoomAndCenter(zoom: number, center: Point): void;
  setMapStyle(style: string): void;

  // conversion Method
  pixelToLngLat(pixel: Point): ILngLat;
  lngLatToPixel(lnglat: Point): IPoint;
  containerToLngLat(pixel: Point): ILngLat;
  lngLatToContainer(lnglat: Point): IPoint;
}
export enum MapType {
  amap = 'amap',
  mapbox = 'mapbox',
}

/**
 * 地图初始化配置项
 */
export interface IMapConfig {
  type: MapType | keyof typeof MapType;

  /**
   * 容器 DOM id
   */
  id: string;

  /**
   * 中心点
   */
  center?: [number, number];

  /**
   * 地图倾角
   */
  pitch?: number;

  /**
   * 地图旋转角度
   */
  bearing?: number;

  /**
   * 缩放等级
   */
  zoom?: number;

  /**
   * 底图样式
   */
  style?: string;
}

/**
 * 地图相机参数
 * @see
 */
export interface IMapCamera {
  // Perspective 相机常规参数
  // @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  aspect: number;
  fov: number;
  near: number;
  far: number;

  viewportWidth: number;
  viewportHeight: number;

  // 地图相机特有参数
  // @see https://docs.mapbox.com/mapbox-gl-js/api/#map
  pitch: number;
  bearing: number;
  zoom: number;
  center: [number, number];
  // 相机高度
  cameraHeight: number;
  // 偏移原点，例如 P20 坐标系下
  offsetOrigin: [number, number];
}
