import BaseMapService from '../utils/BaseMapService';

import {
  Bounds,
  ILngLat,
  IMercator,
  IStatusOptions,
  IViewport,
  MapServiceEvent,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import Viewport from '../utils/Viewport';

let mapdivCount: number = 0;

const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'moving',
  camerachange: 'moving',
  zoomchange: 'zoomend',
  dragging: 'drag',
};

export default class TdtMapService extends BaseMapService<any> {
  protected viewport: IViewport = null;

  // init
  public addMarkerContainer(): void {}

  // @ts-ignore
  public getMarkerContainer(): HTMLElement {}

  public getOverlayContainer(): HTMLElement | undefined {
    return undefined;
  }

  public async init(): Promise<void> {
    this.viewport = new Viewport();

    const {
      id,
      mapInstance,
      center = [121.30654632240122, 31.25744185633306],
      token = '',
      version = '4.0',
      minZoom = 3,
      maxZoom = 18,
      rotation = 0,
      pitch = 0,
      mapSize = 10000,
      logoVisible = true,
      ...rest
    } = this.config;

    if (mapInstance) {
      // @ts-ignore
      if (!(window.T.Map || mapInstance)) {
      }
    } else {
      if (!id) {
        throw Error('No container id specified');
      }
      const mapContainer = DOM.getContainer(id)!;
      // @ts-ignore
      const map = new window.T.Map(mapContainer, {
        maxZoom,
        minZoom,
        rotation,
        pitch,
        showControl: false,
        // Tencent use (Lat, Lng) while center is (Lng, Lat)
        center: new window.T.LatLng(center[0], center[1]),
        ...rest,
      });
    }
  }

  public destroy(): void {}

  // MapEvent
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      if (Array.isArray(EventMap[type])) {
        EventMap[type].forEach((eventName: string) => {
          this.map.on(eventName || type, handle);
        });
      } else {
        this.map.on(EventMap[type] || type, handle);
      }
    }
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    this.map.off(EventMap[type] || type, handle);
    this.eventEmitter.off(type, handle);
  }

  public once(type: string, handler: (...args: any[]) => void): void {
    throw new Error('Method not implemented.');
  }

  // get dom

  public getMapContainer(): HTMLElement {
    return this.map.getContainer();
  }

  public getType() {
    return 'tdtmap';
  }

  public getMapCanvasContainer(): HTMLElement {
    // tdt-container
    return this.map.getContainer()?.getElementsByClassName('tdt-container')[0];
  }

  // get mapStatus method
  public getSize(): [number, number] {
    const size = this.map.getSize();
    return [size.x, size.y];
  }

  // get mapStatus method

  public getZoom(): number {
    return this.map.getZoom();
  }

  public setZoom(zoom: number) {
    return this.map.setZoom(zoom);
  }

  public getCenter(): ILngLat {
    return this.map.getCenter();
  }

  public setCenter(lnglat: [number, number]): void {
    this.map.setCenter(lnglat);
  }

  public getPitch(): number {
    return 0;
  }

  public getRotation(): number {
    return 0;
  }

  public getBounds(): Bounds {
    const ne = this.map.getBounds().getNorthEast();
    const sw = this.map.getBounds().getSouthWest();
    return [
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ];
  }

  public getMinZoom(): number {}

  public getMaxZoom(): number {}

  public setRotation(rotation: number): void {
    this.map.setBearing(0);
  }

  //

  public zoomIn(option?: any, eventData?: any): void {
    this.map.zoomIn(option, eventData);
  }

  public zoomOut(option?: any, eventData?: any): void {
    this.map.zoomOut(option, eventData);
  }

  public panTo(p: [number, number]): void {
    this.map.panTo(p);
  }

  public panBy(x: number = 0, y: number = 0): void {
    // @ts-ignore
    this.map.panBy([x, y]);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: any): void {
    const [sw, ne] = bound;
    // @ts-ignore
    const bounds = new window.T.LngLatBounds(sw, ne);
    this.map.setMaxBounds(bounds);
  }

  public setMaxZoom(max: number): void {
    this.map.setMaxZoom(max);
  }

  public setMinZoom(min: number): void {
    this.map.setMinZoom(min);
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    if (option.doubleClickZoom === true) {
      this.map.enableDoubleClickZoom();
    }
    if (option.doubleClickZoom === false) {
      this.map.disableDoubleClickZoom();
    }
    if (option.dragEnable === false) {
      this.map.disableDrag();
    }
    if (option.dragEnable === true) {
      this.map.enableDrag();
    }

    if (option.keyboardEnable === false) {
      this.map.disableKeyboard;
    }
    if (option.keyboardEnable === true) {
      this.map.enableKeyboard();
    }
    if (option.zoomEnable === false) {
      this.map.disableScrollWheelZoom();
    }
    if (option.zoomEnable === true) {
      this.map.enableScrollWheelZoom();
    }
  }

  // coordinates methods

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[] {
    return [];
  }

  public lngLatToMercator(
    lnglat: [number, number],
    altitude: number,
  ): IMercator {
    return undefined;
  }

  public getCustomCoordCenter?(): [number, number] {
    throw new Error('Method not implemented.');
  }

  protected creatMapContainer(id: string | HTMLDivElement) {
    let $wrapper = id as HTMLDivElement;
    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    }
    const $tdtmapdiv = document.createElement('div');
    $tdtmapdiv.style.cssText += `
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    `;
    $tdtmapdiv.id = 'l7_tdt_div' + mapdivCount++;
    $wrapper.appendChild($tdtmapdiv);
    return $tdtmapdiv;
  }

  public exportMap() {

  }

  private hideLogo() {}

  public handleCameraChanged() {
    this.emit('mapchange');
    const map = this.map;
    const { lng, lat } = this.map.getCenter();
    const option = {
      center: [lng, lat],
      // @ts-ignore
      viewportHeight: map.getContainer().clientHeight,
      // @ts-ignore
      viewportWidth: map.getContainer().clientWidth,
      // @ts-ignore
      bearing: 0,
      // @ts-ignore
      pitch: 0,
      // @ts-ignore
      zoom: map.getZoom() - 1,
    };
    this.viewport.syncWithMapCamera(option as any);
    this.updateCoordinateSystemService();
    this.cameraChangedCallback(this.viewport);
  }
}
