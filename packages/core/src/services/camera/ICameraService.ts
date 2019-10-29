import { IMapCamera } from '../map/IMapService';

// 后续传入 Shader 的变量
export const CameraUniform = {
  ProjectionMatrix: 'u_ProjectionMatrix',
  ViewMatrix: 'u_ViewMatrix',
  ViewProjectionMatrix: 'u_ViewProjectionMatrix',
  Zoom: 'u_Zoom',
  ZoomScale: 'u_ZoomScale',
  FocalDistance: 'u_FocalDistance',
  CameraPosition: 'u_CameraPosition',
};

export interface IViewport {
  syncWithMapCamera(mapCamera: Partial<IMapCamera>): void;
  getProjectionMatrix(): number[];
  getViewMatrix(): number[];
  getViewMatrixUncentered(): number[];
  getViewProjectionMatrix(): number[];
  getZoom(): number;
  getZoomScale(): number;
  getFocalDistance(): number;
  getCenter(): [number, number];
  projectFlat(
    lngLat: [number, number],
    scale?: number | undefined,
  ): [number, number];
}

export interface ICameraService extends Omit<IViewport, 'syncWithMapCamera'> {
  init(): void;
  update(viewport: IViewport): void;
  setViewProjectionMatrix(viewProjectionMatrix: number[] | undefined): void;
  jitterProjectionMatrix(x: number, y: number): void;
  clearJitterProjectionMatrix(): void;
}
