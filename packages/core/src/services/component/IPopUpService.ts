import { ILngLat, IMapService } from '../map/IMapService';
import { IMarkerScene } from './IMarkerService';
export interface IPopup {
  addTo(scene: IMarkerScene): this;
  remove(): void;
  setLnglat(lngLat: ILngLat): this;
  getLnglat(): ILngLat;
  setHTML(html: string): this;
  setText(text: string): this;
  setMaxWidth(maxWidth: string): this;
  isOpen(): boolean;
}
