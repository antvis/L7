import { IViewport } from '../camera/ICameraService';

export interface IMapService {
  init(config: Partial<IMapConfig>): void;
  onCameraChanged(callback: (viewport: IViewport) => void): void;
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
