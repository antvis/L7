import { Container } from 'inversify';

export enum PositionType {
  'TOPRIGHT' = 'topright',
  'TOPLEFT' = 'topleft',
  'BOTTOMRIGHT' = 'bottomright',
  'BOTTOMLEFT' = 'bottomleft',
  'TOPCENTER' = 'topcenter',
  'BOTTOMCENTER' = 'bottomcenter',
  'LEFTCENTER' = 'leftcenter',
  'RIGHTCENTER' = 'rightcenter',
  'LEFTTOP' = 'lefttop',
  'RIGHTTOP' = 'righttop',
  'LEFTBOTTOM' = 'leftbottom',
  'RIGHTBOTTOM' = 'rightbottom',
}

export type PositionName =
  | 'topright'
  | 'topleft'
  | 'bottomright'
  | 'bottomleft'
  | 'topcenter'
  | 'bottomcenter'
  | 'leftcenter'
  | 'rightcenter'
  | 'lefttop'
  | 'righttop'
  | 'leftbottom'
  | 'rightbottom';

export interface IControlServiceCfg {
  container: HTMLElement;
}
export interface IControlCorners {
  [key: string]: HTMLElement;
}
export interface IControl<O = any> {
  controlOption: O;
  setOptions: (newOption: Partial<O>) => void;
  addTo(sceneContainer: Container): void;
  onAdd(): HTMLElement;
  onRemove(): void;
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
