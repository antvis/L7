import { Container } from 'inversify';
export enum PositionType {
  'TOPRIGHT' = 'topright',
  'TOPLEFT' = 'topleft',
  'BOTTOMRIGHT' = 'bottomright',
  'BOTTOMLEFT' = 'bottomleft',
}

export type PositionName =
  | 'topright'
  | 'topleft'
  | 'bottomright'
  | 'bottomleft';
export interface IControlOption {
  name: string;
  position: PositionName;
  [key: string]: any;
}
export interface IControlServiceCfg {
  container: HTMLElement;
}
export interface IControlCorners {
  [key: string]: HTMLElement;
}
export interface IControl {
  controlOption: IControlOption;
  setPosition(pos: PositionType): void;
  addTo(sceneContainer: Container): void;
  onAdd(): HTMLElement;
  hide(): void;
  show(): void;
  remove(): void;
}
export interface IControlService {
  container: HTMLElement;
  controlCorners: IControlCorners;
  controlContainer: HTMLElement;
  addControls(): void;
  init(cfg: IControlServiceCfg, sceneContainer: Container): void;
  addControl(ctr: IControl, sceneContainer: Container): void;
  getControlByName(name: string | number): IControl | undefined;
  removeControl(ctr: IControl): void;
  destroy(): void;
}
