import { ScaleTypeName, StyleAttributeOption } from '@antv/l7';
export interface ILabelOption {
  enable: boolean;
  color: string;
  field: string;
  size: number;
  stroke: string;
  strokeWidth: number;
  textAllowOverlap: boolean;
  opacity: number;
}
export type adcodeType = string[] | string | number | number[];
export interface IDistrictLayerOption {
  zIndex: number;
  data?: Array<{ [key: string]: any }>;
  joinBy: [string, string];
  adcode: adcodeType;
  depth: 0 | 1 | 2 | 3;
  label: Partial<ILabelOption>;
  fill: Partial<{
    scale: ScaleTypeName | null;
    field: string | null;
    values: StyleAttributeOption;
    style: any;
    activeColor: string;
  }>;
  autoFit: boolean;
  stroke: string;
  strokeWidth: number;
  provinceStroke: string;
  cityStroke: string;
  provinceStrokeWidth: number;
  cityStrokeWidth: number;
  countyStroke: string;
  countyStrokeWidth: number;

  coastlineStroke: string;
  coastlineWidth: number;
  nationalStroke: string;
  nationalWidth: number;
  chinaNationalStroke: string;
  chinaNationalWidth: number;
  popup: Partial<{
    enable: boolean;
    triggerEvent: 'mousemove' | 'click';
    Html: (properties: any) => string;
  }>;
}
