import type { IControl } from 'mapbox-gl';

export enum MapType {
  'GAODE' = 'GAODE',
  'MAPBOX' = 'MAPBOX',
  'DEFAULT' = 'DEFAUlTMAP',
  'SIMPLE' = 'SIMPLE',
  'GLOBEL' = 'GLOBEL',
}

export interface IAMapEvent {
  camera: {
    fov: number;
    near: number;
    far: number;
    height: number;
    pitch: number;
    rotation: number;
    aspect: number;
    position: { x: number; y: number };
  };
}

interface CustomCoords {
  getCameraParams(): void;
  getCenter(): void;
  getMVPMatrix(): void;
  [other: string]: any;
}

export interface IAMapInstance {
  get(key: string): unknown;
  getZooms?(): number[];
  customCoords?: CustomCoords;
}

export interface IMapboxInstance {
  _controls: IControl[];
  transform: {
    width: number;
    height: number;
  };
}

export interface IEventEmitter<EventTypes extends string | symbol = string | symbol> {
  emit(event: EventTypes, ...args: any[]): boolean;
  /**
   * Add a listener for a given event.
   */
  on(event: EventTypes, handle: (...args: any[]) => void, context?: any): this;

  off(event: EventTypes, handle: (...args: any[]) => void, context?: any, once?: boolean): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: EventTypes): this;
}
