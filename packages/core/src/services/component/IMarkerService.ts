import { Container, injectable } from 'inversify';
import { ILngLat, IMapService, IPoint } from '../map/IMapService';
import { IPopup } from './IPopupService';
export interface IMarkerScene {
  getMapService(): IMapService<unknown>;
  [key: string]: any;
}

export interface IMarkerServiceCfg {
  container: HTMLElement;
}
export interface IMarker {
  addTo(scene: Container): void;
  remove(): void;
  setLnglat(lngLat: ILngLat | IPoint): this;
  getLnglat(): ILngLat;
  getElement(): HTMLElement;
  setPopup(popup: IPopup): void;
  togglePopup(): this;
}
export interface IMarkerService {
  container: HTMLElement;
  addMarker(Marker: IMarker): void;
  addMarkers(): void;
  removeMarker(Marker: IMarker): void;
  init(scene: Container): void;
  destroy(): void;
}
