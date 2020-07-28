import { anchorType } from '@antv/l7-utils';
import { Container } from 'inversify';
import { ILngLat, IMapService } from '../map/IMapService';

export interface IPopupOption {
  closeButton: boolean;
  closeOnClick: boolean;
  maxWidth: string;
  anchor: anchorType[any];
  className: string;
  offsets: number[];
  stopPropagation: boolean;
}
export interface IPopup {
  addTo(scene: Container): this;
  remove(): void;
  setLnglat(lngLat: ILngLat): this;
  getLnglat(): ILngLat;
  setHTML(html: string): this;
  setText(text: string): this;
  setMaxWidth(maxWidth: string): this;
  isOpen(): boolean;
  open(): void;
  close(): void;
}
export interface IPopupService {
  addPopup(popup: IPopup): void;
  removePopup(popup: IPopup): void;
  init(scene: Container): void;
  initPopup(): void;
  destroy(): void;
}
