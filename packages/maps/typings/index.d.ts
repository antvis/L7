/// <reference types="amap-js-api" />
import { IControl } from 'mapbox-gl';

interface Window {
  initAMap: () => void;
}
interface IAMapEvent {
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
  [other:string]:any
}
interface IAMapInstance {
  get(key: string): unknown;
  getZooms?(): number[];
  customCoords?: CustomCoords;
}

interface IMapboxInstance {
  _controls: IControl[];
  transform: {
    width: number;
    height: number;
  };
}
interface IEventEmitter<EventTypes extends string | symbol = string | symbol> {
  emit(event: EventTypes, ...args: any[]): boolean;
  /**
   * Add a listener for a given event.
   */
  on(event: EventTypes, handle: (...args: any[]) => void, context?: any): this;

  off(
    event: EventTypes,
    handle: (...args: any[]) => void,
    context?: any,
    once?: boolean,
  ): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: EventTypes): this;
}
