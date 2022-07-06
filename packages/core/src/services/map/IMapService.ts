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
export interface IMercator {
  x: number;
  y: number;
  z: number;
}
export interface IStatusOptions {
  showIndoorMap: boolean;
  resizeEnable: boolean;
  dragEnable: boolean;
  keyboardEnable: boolean;
  doubleClickZoom: boolean;
  zoomEnable: boolean;
  rotateEnable: boolean;
}
export type MapStyle = string | { [key: string]: any };
export interface IMapWrapper {
  setContainer(
    container: Container,
    id: string | HTMLDivElement,
    canvas?: HTMLCanvasElement,
    hasBaseMap?: boolean,
  ): void;
}

interface ISimpleMapCoord {
  setSize(size: number): void;
  getSize(): [number, number];
  project(lnglat: [number, number]): [number, number];
  unproject(xy: [number, number]): [number, number];
}

export interface IMapService<RawMap = {}> {
  version?: string;
  simpleMapCoord: ISimpleMapCoord;
  map: RawMap;
  bgColor: string;
  setBgColor(color: string): void;
  init(): void;
  initMiniMap?(): void;
  initViewPort?(): void;
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
  getCenter(option?: ICameraOptions): ILngLat;
  getPitch(): number;
  getRotation(): number;
  getBounds(): Bounds;
  getMapContainer(): HTMLElement | null;
  getMapCanvasContainer(): HTMLElement;

  // control with raw map
  setRotation(rotation: number): void;
  zoomIn(option?: any, eventData?: any): void;
  zoomOut(option?: any, eventData?: any): void;
  panTo(p: Point): void;
  panBy(x: number, y: number): void;
  fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void;
  setZoomAndCenter(zoom: number, center: Point): void;
  setCenter(center: [number, number], option?: ICameraOptions): void;
  setPitch(pitch: number): void;
  setZoom(zoom: number): void;
  setMapStyle(style: any): void;
  setMapStatus(option: Partial<IStatusOptions>): void;

  // coordinates methods
  pixelToLngLat(pixel: Point): ILngLat;
  lngLatToPixel(lnglat: Point): IPoint;
  containerToLngLat(pixel: Point): ILngLat;
  lngLatToContainer(lnglat: Point): IPoint;
  lngLatToMercator(lnglat: [number, number], altitude: number): IMercator;
  getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[];
  lngLatToCoord?(lnglat: [number, number]): [number, number];
  lngLatToCoords?(
    lnglatArray: number[][][] | number[][],
  ): number[][][] | number[][] | number[][][] | number[][];
  // lngLatToCoords?(lnglatArray: any): any;
  getCustomCoordCenter?(): [number, number];
  exportMap(type: 'jpg' | 'png'): string;

  // 地球模式下的地图方法/属性
  rotateY?(
    option:
      | {
          force?: boolean;
          reg?: number;
        }
      | undefined,
  ): void;
}

export interface IEarthService<RawMap = {}> {
  version?: string;
  map: RawMap;
  bgColor: string;
  setBgColor(color: string): void;
  init(): void;
  initViewPort?(): void;
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
  getCenter(option?: ICameraOptions): ILngLat;
  getPitch(): number;
  getRotation(): number;
  getBounds(): Bounds;
  getMapContainer(): HTMLElement | null;
  getMapCanvasContainer(): HTMLElement;

  // control with raw map
  setRotation(rotation: number): void;
  zoomIn(option?: any, eventData?: any): void;
  zoomOut(option?: any, eventData?: any): void;
  panTo(p: Point): void;
  panBy(x: number, y: number): void;
  fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void;
  setZoomAndCenter(zoom: number, center: Point): void;
  setCenter(center: [number, number], option?: ICameraOptions): void;
  setPitch(pitch: number): void;
  setZoom(zoom: number): void;
  setMapStyle(style: any): void;
  setMapStatus(option: Partial<IStatusOptions>): void;

  // coordinates methods
  pixelToLngLat(pixel: Point): ILngLat;
  lngLatToPixel(lnglat: Point): IPoint;
  containerToLngLat(pixel: Point): ILngLat;
  lngLatToContainer(lnglat: Point): IPoint;
  lngLatToMercator(lnglat: [number, number], altitude: number): IMercator;
  getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[];
  lngLatToCoord?(lnglat: [number, number]): [number, number];
  lngLatToCoords?(
    lnglatArray: number[][][] | number[][],
  ): number[][][] | number[][] | number[][][] | number[][];
  // lngLatToCoords?(lnglatArray: any): any;
  getCustomCoordCenter?(): [number, number];
  exportMap(type: 'jpg' | 'png'): string;

  // 地球模式下的地图方法/属性
  rotateY?(
    option:
      | {
          force?: boolean;
          reg?: number;
        }
      | undefined,
  ): void;
}

export const MapServiceEvent = ['mapload', 'mapchange', 'mapAfterFrameChange'];

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

  offsetCoordinate?: boolean;

  offsetZoom?: number;

  [key: string]: any;
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
  cameraPosition?: [number, number, number];
  up?: [number, number, number];
  lookAt?: [number, number, number];
  // 偏移原点，例如 P20 坐标系下
  offsetOrigin: [number, number];
}
export interface ICameraOptions {
  padding:
    | number
    | [number, number, number, number]
    | {
        top?: number;
        bottom?: number;
        right?: number;
        left?: number;
      };
}
