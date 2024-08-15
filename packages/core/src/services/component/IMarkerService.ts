import type { anchorType, IBounds } from '@antv/l7-utils';
import type { L7Container } from '../../inversify.config';
import type { ILngLat, IMapService, IPoint } from '../map/IMapService';
import type { IPopup } from './IPopupService';
export interface IMarkerScene {
  getMapService(): IMapService<unknown>;
  [key: string]: any;
}

export interface IMarkerServiceCfg {
  container: HTMLElement;
}
export interface IMarkerOption {
  element: HTMLElement | undefined;
  anchor: anchorType;
  color: string;
  offsets: number[];
  draggable: boolean;
  overflowHide?: boolean;
  extData?: any;
  style?: CSSStyleDeclaration;
}

export interface IMarkerContainerAndBounds {
  containerWidth: number;
  containerHeight: number;
  bounds: IBounds;
}

export interface IMarker {
  addTo(scene: L7Container): void;
  remove(): void;
  setLnglat(lngLat: ILngLat | IPoint): this;
  getLnglat(): ILngLat;
  getElement(): HTMLElement;
  getExtData(): any;
  setExtData(data: any): void;
  setPopup(popup: IPopup): void;
  togglePopup(): this;
  openPopup(): this;
  closePopup(): this;
  setElement(el: HTMLElement): this;
  getMarkerLayerContainerSize: () => IMarkerContainerAndBounds | void;
}
export interface IMarkerService {
  container: HTMLElement;
  addMarkerLayer(Marker: IMarkerLayer): void;
  removeMarkerLayer(Marker: IMarkerLayer): void;
  addMarker(Marker: IMarker): void;
  addMarkers(): void;
  addMarkerLayers(): void;
  removeMarker(Marker: IMarker): void;
  removeAllMarkers(): void;
  init(scene: L7Container): void;
  destroy(): void;
}

export interface IMarkerLayer {
  addMarker(marker: IMarker): void;
  getMarkers(): IMarker[];
  addTo(scene: L7Container): void;
  removeMarker(marker: IMarker): void;
  clear(): void;
  destroy(): void;
}
