import { ILngLat, IMapService } from '../map/IMapService';
export interface IMarkerScene {
  getMapService(): IMapService<unknown>;
  [key: string]: any;
}
export interface IMarker {
  addTo(scene: IMarkerScene): void;
  remove(): void;
  setLnglat(lngLat: ILngLat): this;
  getLnglat(): ILngLat;
  getElement(): HTMLElement;
  togglePopup(): this;
}
