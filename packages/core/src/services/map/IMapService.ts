import { Container } from 'inversify';
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

export type MapStyle = string | { [key: string]: any };
export interface IMapWrapper {
  setContainer(container: Container, id: string | HTMLDivElement): void;
}

export interface IMapService<RawMap = {}> {
  map: RawMap;
  init(): void;
  destroy(): void;
  onCameraChanged(callback: (viewport: IViewport) => void): void;
  // init map
  addMarkerContainer(): void;
  getMarkerContainer(): HTMLElement;
  // MapEvent // 定义事件类型

  on(type: string, handler: (...args: any[]) => void): void;
  off(type: string, handler: (...args: any[]) => void): void;
  once(type: string, handler: (...args: any[]) => void): void;
  // get dom
  getContainer(): HTMLElement | null;
  getSize(): [number, number];
  // get map status method
  getMinZoom(): number;
  getMaxZoom(): number;
  // get map params
  getType(): string;
  getZoom(): number;
  getCenter(): ILngLat;
  getPitch(): number;
  getRotation(): number;
  getBounds(): Bounds;
  getMapContainer(): HTMLElement | null;

  // control with raw map
  setRotation(rotation: number): void;
  zoomIn(): void;
  zoomOut(): void;
  panTo(p: Point): void;
  panBy(pixel: Point): void;
  setPitch(pitch: number): void;
  fitBounds(bound: Bounds): void;
  setZoomAndCenter(zoom: number, center: Point): void;
  setZoom(zoom: number): void;
  setMapStyle(style: string): void;

  // coordinates methods
  pixelToLngLat(pixel: Point): ILngLat;
  lngLatToPixel(lnglat: Point): IPoint;
  containerToLngLat(pixel: Point): ILngLat;
  lngLatToContainer(lnglat: Point): IPoint;
}

export const MapServiceEvent = ['mapload'];

/**
 * 地图初始化配置项
 */
export interface IMapConfig<RawMap = {}> {
  /**
   * 地图实例
   */
  mapInstance?: RawMap;
  /**
   * 高德地图API插件
   */
  plugin?: string[];
  /**
   * 容器 DOM id
   */
  id: string | HTMLDivElement;

  /**
   * 地图
   */
  token?: string;

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
  rotation?: number;

  /**
   * 缩放等级
   */
  zoom?: number;

  /**
   * 底图样式
   */
  style?: MapStyle;
  /**
   * 最小缩放等级
   */
  minZoom?: number;

  /**
   * 最大缩放等级
   */
  maxZoom?: number;

  attributionControl?: boolean;
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
