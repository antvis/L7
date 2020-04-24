import { ScaleTypeName, StyleAttributeOption } from '@antv/l7';
export interface IDistrictLayerOption {
  zIndex: number;
  data?: Array<{ [key: string]: any }>;
  depth: 0 | 1 | 2;
  label: {
    enable: boolean;
    color: string;
    field: string;
    size: number;
    stroke: string;
    strokeWidth: number;
    textAllowOverlap: boolean;
    opacity: number;
  };
  fill: {
    scale: ScaleTypeName | null;
    field: string | null;
    values: StyleAttributeOption;
  };
  stroke: string;
  strokeWidth: number;
  coastlineStroke: string;
  coastlineWidth: number;
  nationalStroke: string;
  nationalWidth: number;
  popup: {
    enable: boolean;
    triggerEvent: 'mousemove' | 'click';
  };
}
