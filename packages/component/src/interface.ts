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
  /**
   * Default marker options applied to markers added to this layer when not overridden per-marker.
   * Example: { color: '#ff0000', style: { width: '24px', height: '24px' }, className: 'my-marker' }
   */
  markerOption?: Partial<{
    color?: string;
    style?: { [key: string]: any };
    className?: string;
  }>;
}
