import {
  IPopupOption,
  ScaleTypeName,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7';
export type anchorType =
  | 'right'
  | 'top-right'
  | 'left'
  | 'bottom-right'
  | 'left'
  | 'top-left'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'center';
export interface ILabelOption {
  enable: boolean;
  color: string;
  field: string;
  size: number;
  stroke: string;
  strokeWidth: number;
  textAllowOverlap: boolean;
  padding: [number, number];
  strokeOpacity: number;
  fontWeight: number;
  spacing: number;
  textAnchor: anchorType;
  textOffset: [number, number];
  opacity: number;
  filter: AttributeType;
}

export interface IAttributeOption {
  field: StyleAttributeField;
  values: StyleAttributeOption;
}

export type AttributeType = IAttributeOption | string | number;
export interface IPopupOptions {
  enable: boolean;
  openTriggerEvent: TriggeEventType;
  closeTriggerEvent: TriggeEventType;
  triggerLayer: 'fill' | 'bubble';
  option?: Partial<IPopupOption>;
  Html: (properties: any) => string;
}

export interface IFillOptions {
  scale: ScaleTypeName | null;
  // field: string | null;
  color: AttributeType;
  values: StyleAttributeOption;
  style: any;
  activeColor: string | boolean;
  filter: AttributeType;
}
export type TriggeEventType =
  | 'mousemove'
  | 'click'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseout'
  | 'dblclick'
  | 'contextmenu'
  | 'mouseup';

export type DrillUpTriggeEventType =
  | 'mousemove'
  | 'unclick'
  | 'unmousedown'
  | 'undblclick'
  | 'uncontextmenu'
  | 'unmouseup';
export interface IBubbleOption {
  enable: boolean;
  shape: AttributeType;
  size: AttributeType;
  color: AttributeType;
  filter: AttributeType;
  scale: {
    field: string;
    type: ScaleTypeName;
  };
  style: {
    opacity: number;
    stroke: string;
    strokeWidth: number;
  };
}
export type adcodeType = string[] | string | number | number[];
export interface IDistrictLayerOption {
  zIndex: number;
  visible: boolean;
  geoDataLevel: 1 | 2;
  data?: Array<{ [key: string]: any }>;
  joinBy: [string, string];
  adcode: adcodeType;
  depth: 0 | 1 | 2 | 3;
  label: Partial<ILabelOption>;
  bubble: Partial<IBubbleOption>;
  fill: Partial<IFillOptions>;
  showBorder: boolean;
  autoFit: boolean;
  stroke: string;
  strokeVisible: boolean;
  strokeWidth: number;
  provinceStroke: string;
  provinceStrokeVisible: boolean;
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
  popup: Partial<IPopupOptions>;
}
interface IDrawOption {
  joinBy: [string, string];
  label: Partial<ILabelOption>;
  bubble: Partial<IBubbleOption>;
  fill: Partial<IFillOptions>;
}
export interface IDrillDownOption {
  drillDepth: 0 | 1 | 2;
  geoDataLevel: 1 | 2;
  customTrigger: boolean;
  drillDownTriggerEvent: TriggeEventType;
  drillUpTriggerEvent: TriggeEventType & DrillUpTriggeEventType;
  provinceData?: Array<{ [key: string]: any }>;
  cityData?: Array<{ [key: string]: any }>;
  countyData?: Array<{ [key: string]: any }>;
  joinBy: [string, string];
  label: Partial<ILabelOption>;
  bubble: Partial<IBubbleOption>;
  fill: Partial<IFillOptions>;
  popup: Partial<IPopupOptions>;
  province: Partial<IDrawOption>;
  city: Partial<IDrawOption>;
  county: Partial<IDrawOption>;
}
