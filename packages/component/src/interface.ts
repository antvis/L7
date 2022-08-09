import { IControlOption } from '@antv/l7-core';

export interface ILayerControlOption extends IControlOption {
  collapsed: boolean;
  autoZIndex: boolean;
  hideSingleBase: boolean;
  sortLayers: boolean;

  sortFunction: (...args: any[]) => any;
}

export interface IScaleControlOption extends IControlOption {
  maxWidth: number;
  metric: boolean;
  updateWhenIdle: boolean;
  imperial: boolean;
}

export interface IZoomControlOption extends IControlOption {
  zoomInText: string;
  zoomInTitle: string;
  zoomOutText: string;
  zoomOutTitle: string;
}

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
