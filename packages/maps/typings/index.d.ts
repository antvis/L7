/// <reference path="../../../node_modules/@types/amap-js-api/index.d.ts" />
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
    position: {x: number; y: number;};
  }
}

interface IAMapInstance {
  on(eventName: string, handler: (event: IAMapEvent) => void): void;
  getZoom(): number;
  getCenter(): {lat: number; lng: number};
  [key:string]: Function;
}

interface IMapboxInstance {
  transform: {
    width: number;
    height: number;
  }
}
