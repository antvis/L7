import BaseMapService from '../utils/BaseMapService';

import {
  Bounds,
  ILngLat,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapServiceEvent,
  Point,
} from '@antv/l7-core';
import { MercatorCoordinate } from '@antv/l7-map';
import Viewport from '../utils/Viewport';
import { load } from './maploader';

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
  protected viewport: IViewport | null = null;
  // @ts-ignore
  private sceneContainer: HTMLElement;
  private origin: { x: number; y: number };

  // init
  public addMarkerContainer(): void {}

  // @ts-ignore
  public getMarkerContainer(): HTMLElement {}

  public getOverlayContainer(): HTMLElement | undefined {
    const overlayPane = this.map.getPanes()?.overlayPane;
    const container = document.createElement('div');
    overlayPane.appendChild(container);
    const size = this.map.getSize();
    container.style.width = `${size.x}px`;
    container.style.height = `${size.y}px`;
    // @ts-ignore
    this.sceneContainer = container;
    return container;
  }

  private update() {
    const bounds = this.map.getBounds();
    const { x, y } = this.map.lngLatToLayerPoint({
      lng: bounds.getSouthWest().lng,
      lat: bounds.getNorthEast().lat,
    });

    this.sceneContainer.style.transform = `translate3d(${x}px, ${y}px, 0px)`;

    this.handleCameraChanged();
  }

  protected handleCameraChanged = (e?: any) => {
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
      bearing: 360,
      // @ts-ignore
      pitch: 0,
      // @ts-ignore
      zoom: map.getZoom() - 1,
    };
    if (this.viewport) {
      this.viewport.syncWithMapCamera(option as any);
      this.updateCoordinateSystemService();
      this.cameraChangedCallback(this.viewport);
    }
  };

  public async init(): Promise<void> {
    this.viewport = new Viewport();

    const {
      id,
      mapInstance,
      center = [121.30654632240122, 31.25744185633306],
      token = 'b15e548080c79819617367d3f6095c69',
      version = '4.0',
      minZoom = 1,
      maxZoom = 18,
      logoVisible = true,
      zoom = 3,
      ...rest
    } = this.config;

    // @ts-ignore
    if (!window.T) {
      await load({ tk: token });
    }

    if (mapInstance) {
      this.map = mapInstance;
      // @ts-ignore
      this.map.centerAndZoom(new window.T.LngLat(center[0], center[1]), zoom);
      this.$mapContainer = this.map.getContainer();
      // @ts-ignore
      const point = new window.T.LngLat(center[0], center[1]);
      this.map.centerAndZoom(point, zoom);
      this.setMinZoom(minZoom);
      this.setMaxZoom(maxZoom);
    } else {
      if (!id) {
        throw Error('No container id specified');
      }

      this.$mapContainer = this.creatMapContainer(
        id as string | HTMLDivElement,
      );
      // @ts-ignore
      const map = new T.Map(this.$mapContainer, {
        // @ts-ignore
        center: window.T.LngLat(center[0], center[1]),
        minZoom,
        maxZoom,
        zoom,
        projection: 'EPSG:900913',
      });
      this.map = map;
    }

    const container = this.map.getContainer();
    // tdt-pane的zindex是400，去掉
    const tdtPanes = container.querySelector('.tdt-pane');
    tdtPanes.style.zIndex = 1;
    this.handleCameraChanged();
    const bounds = this.map.getBounds();
    this.origin = this.map.lngLatToLayerPoint({
      lng: bounds.getSouthWest().lng,
      lat: bounds.getNorthEast().lat,
    });



    this.map.on('move', this.update, this);
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

  public setRotation(rotation: number): void {
    this.map.setBearing(360);
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
      this.map.disableKeyboard();
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

  public meterToCoord(center: [number, number], outer: [number, number]) {
    const metreDistance = this.getMap().getDistance(
      new BMapGL.Point(...center),
      new BMapGL.Point(...outer),
    );

    const [x1, y1] = this.lngLatToCoord(center);
    const [x2, y2] = this.lngLatToCoord(outer);
    const coordDistance = Math.sqrt(
      Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2),
    );

    return coordDistance / metreDistance;
  }

  public pixelToLngLat([x, y]: Point): ILngLat {
    const lngLat = this.map.layerPointToLngLat({ x, y });
    return { lng: lngLat.lng, lat: lngLat.lat };
  }

  public lngLatToPixel([lng, lat]: Point): IPoint {
    const pixel = this.map.lngLatToLayerPoint({ lng, lat });
    return {
      x: pixel.x,
      y: pixel.y,
    };
  }

  public containerToLngLat([x, y]: [number, number]): ILngLat {
    const point = this.map.containerPointToLngLat({ x, y });
    return {
      lng: point.lng,
      lat: point.lat,
    };
  }

  public lngLatToContainer([lng, lat]: [number, number]): IPoint {
    const overlayPixel = this.map.lngLatToContainerPoint({ lat, lng });
    return {
      x: overlayPixel.x,
      y: overlayPixel.y,
    };
  }

  public lngLatToCoord([lng, lat]: [number, number]): [number, number] {
    const { x, y } = this.getMap().pointToPixel(new BMapGL.Point(lng, lat));
    return [x, -y];
  }

  public lngLatToCoords(list: number[][] | number[][][]): any {
    return list.map((item) =>
      Array.isArray(item[0])
        ? this.lngLatToCoords(item as Array<[number, number]>)
        : this.lngLatToCoord(item as [number, number]),
    );
  }

  public lngLatToMercator(
    lnglat: [number, number],
    altitude: number,
  ): IMercator {
    // Use built in mercator tools due to Tencent not provided related methods
    const {
      x = 0,
      y = 0,
      z = 0,
    } = MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
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

  // public exportMap() {}
  //
  // private hideLogo() {}
}
