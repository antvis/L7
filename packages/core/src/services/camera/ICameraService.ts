import type { IMapCamera } from '../map/IMapService';

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
  getModelMatrix(): number[];
  getViewMatrix(): number[];
  getViewMatrixUncentered(): number[];
  getViewProjectionMatrixUncentered(): number[];
  getViewProjectionMatrix(): number[];
  getZoom(): number;
  getZoomScale(): number;
  getFocalDistance(): number;
  getCenter(): [number, number];
  projectFlat(lngLat: [number, number], scale?: number | undefined): [number, number];
}

export interface ICameraService extends Omit<IViewport, 'syncWithMapCamera'> {
  init(): void;
  update(viewport: IViewport): void;
  getCameraPosition(): number[];
  setViewProjectionMatrix(viewProjectionMatrix: number[] | undefined): void;
}
