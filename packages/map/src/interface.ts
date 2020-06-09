export interface IMapOptions {
  container?: HTMLElement | string;
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  interactive: boolean;
  scrollZoom: boolean;
  minZoom: number;
  maxZoom: number;
  minPitch: number;
  maxPitch: number;
  boxZoom: boolean;
  dragRotate: boolean;
  dragPan: boolean;
  keyboard: boolean;
  doubleClickZoom: boolean;
  touchZoomRotate: boolean;
  touchPitch: boolean;
  trackResize: boolean;
  renderWorldCopies: boolean;
  bearingSnap: number;
  clickTolerance: number;
  pitchWithRotate: boolean;
}
