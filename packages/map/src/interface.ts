import { LngLatBoundsLike } from './geo/lng_lat_bounds';

export interface IMapOptions {
  hash: boolean;
  style?: any;
  container?: HTMLElement | string;
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
  interactive: boolean;
  scrollZoom: boolean;
  bounds?: LngLatBoundsLike;
  maxBounds?: LngLatBoundsLike;
  fitBoundsOptions?: any;
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
