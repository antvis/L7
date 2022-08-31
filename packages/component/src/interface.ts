export type ControlEvent = 'show' | 'hide' | 'add' | 'remove' | string;

export interface IMarkerStyleOption {
  element?: (...args: any[]) => any;
  style: { [key: string]: any } | ((...args: any[]) => any);
  className: string;
  field?: string;
  method?: 'sum' | 'max' | 'min' | 'mean';
  radius: number;
  maxZoom: number;
  minZoom: number;
  zoom: number;
}

export interface IMarkerLayerOption {
  cluster: boolean;
  clusterOption: Partial<IMarkerStyleOption>;
}
