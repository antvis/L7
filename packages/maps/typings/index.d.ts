/// <reference path="../../../node_modules/@types/amap-js-api/index.d.ts" />

import { IControl } from 'mapbox-gl';

interface Window {
  onLoad: () => void;
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

interface IAMapInstance {
  get(key: string): unknown;
}

interface IMapboxInstance {
  _controls: IControl[];
  transform: {
    width: number;
    height: number;
  };
}
