import { Container } from 'inversify';
import { ILngLat, IMapService } from '../map/IMapService';

export interface IPopup {
  addTo(scene: Container): this;
  remove(): void;
  setLnglat(lngLat: ILngLat): this;
  getLnglat(): ILngLat;
  setHTML(html: string): this;
  setText(text: string): this;
  setMaxWidth(maxWidth: string): this;
  isOpen(): boolean;
}
export interface IPopupService {
  addPopup(popup: IPopup): void;
  removePopup(popup: IPopup): void;
  init(scene: Container): void;
  initPopup(): void;
  destroy(): void;
}
