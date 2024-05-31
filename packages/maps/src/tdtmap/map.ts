import BaseMapService from '../utils/BaseMapService';

import type {
  Bounds,
  ILngLat,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  Point,
} from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { MercatorCoordinate } from '@antv/l7-map';
import Viewport from '../lib/web-mercator-viewport';
import { load } from './maploader';

let mapdivCount: number = 0;

const EventMap: {
  [key: string]: any;
} = {
  zoomchange: ['Ge'],
};

// TODO: 基于抽象类 BaseMap 实现，补全缺失方法，解决类型问题
export default class TdtMapService extends BaseMapService<any> {
  protected viewport: IViewport | null = null;
  protected evtCbProxyMap: Map<string, Map<(...args: any) => any, (...args: any) => any>> =
    new Map();
  // @ts-ignore
  private sceneContainer: HTMLElement;
  // 不直接用自带的marker的div，因为会收到天地图缩放时visibility变成hidden的影响
  public addMarkerContainer(): void {
    const container = this.map.getContainer();
    const div = (this.markerContainer = document.createElement('div'));
    container.appendChild(div);
    // div.classList.add('l7-marker-container');
    // div.classList.add('leaflet-layer');
    // div.classList.add('leaflet-zoom-animated');
    div.setAttribute('tabindex', '-1');
    div.id = 'tdt-L7-marker';
    div.style.position = 'absolute';
    div.style.left = '';
    div.style.top = '';
    div.style.zIndex = '600';
    div.style.width = '0px';
    div.style.height = '0px';
    div.style.overflow = 'visible';
    return;
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }
  private resize(ev: any) {
    this.sceneContainer.style.width = ev.newSize.x + 'px';
    this.sceneContainer.style.height = ev.newSize.y + 'px';
  }
  private update() {
    const bounds = this.map.getBounds();
    const { x, y } = this.map.lngLatToLayerPoint({
      lng: bounds.getSouthWest().lng,
      lat: bounds.getNorthEast().lat,
    });
    this.sceneContainer.style.transition = '';
    this.sceneContainer.style.transformOrigin = 'center';
    this.sceneContainer.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(1)`;
    //更新marker容器的位置 实现平移
    this.markerContainer.style.transition = '';
    this.markerContainer.style.transformOrigin = 'center';
    this.markerContainer.style.transform = `translate3d(${-x}px, ${-y}px, 0px) scale(1)`;
    // @ts-ignore
    this.sceneContainer._tdt_pos = new T.Point(x, y);
    this.handleCameraChanged();
  }

  private getZoomScale(toZoom: number, fromZoom: number): number {
    // TODO replace with universal implementation after refactoring projections
    const crs = this.map.options.IW;
    fromZoom = fromZoom === undefined ? this.map.getZoom() : fromZoom;
    return crs.scale(toZoom) / crs.scale(fromZoom);
  }
  private zoomStartUpdate(ev: any) {
    // T._Q :DomUtil
    // this.map.options.IW.qW:map.project
    // GQ:multiply aQ:add DQ:substract
    // 都是混淆后的方法,后续需要考虑讲这些方法都实现了,避免api更新后方法名发生改变
    const center = ev.center;
    const zoom = ev.zoom;
    const scale = this.getZoomScale(zoom, this.map.getZoom());

    // @ts-ignore
    const position = T._Q.getPosition(this.sceneContainer);
    const viewHalf = this.map.getSize().GQ(0.5);
    const currentCenterPoint = this.map.options.IW.qW(this.map.getCenter(), zoom);
    const destCenterPoint = this.map.options.IW.qW(center, zoom);
    const centerOffset = destCenterPoint.DQ(currentCenterPoint);
    // @ts-ignore
    const topLeftOffset = new T.Point(viewHalf.x, viewHalf.y).GQ(-scale);
    topLeftOffset.aQ(position);
    topLeftOffset.aQ(viewHalf);
    topLeftOffset.DQ(centerOffset);
    this.sceneContainer.style.transform = `translate3d(${topLeftOffset.x}px,${topLeftOffset.y}px,0px) scale(${scale})`;
    this.sceneContainer.style.transformOrigin = '0 0';
    this.sceneContainer.style.transition = 'transform 0.25s cubic-bezier(0,0,0.25,1)';

    this.handleCameraChanged();
  }
  public getOverlayContainer(): HTMLElement | undefined {
    const overlayPane = this.map.getPanes()?.overlayPane;
    const container = document.createElement('div');
    overlayPane.parentElement.appendChild(container);
    container.id = 'tdt-L7';
    const size = this.map.getSize();
    container.style.zIndex = '200'; //置于上层
    container.style.width = `${size.x}px`;
    container.style.height = `${size.y}px`;
    // @ts-ignore
    this.sceneContainer = container;
    return container;
  }
  protected handleCameraChanged = () => {
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
      minZoom = 1,
      maxZoom = 18,
      zoom = 3,
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

      this.$mapContainer = this.creatMapContainer(id as string | HTMLDivElement);
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
      // @ts-ignore
      const control = new window.T.Control.Zoom();
      map.addControl(control);
    }

    const container = this.map.getContainer();
    const tdtPanes = container.querySelector('.tdt-pane');
    tdtPanes.style.zIndex = 1;
    this.handleCameraChanged();
    this.map.on('move', this.update, this);
    //对应leaflet中的zoomanim
    this.map.on('Ge', this.zoomStartUpdate, this);
    this.map.on('resize', this.resize, this);
  }

  public destroy(): void {
    return;
  }

  // MapEvent
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      const onProxy = (eventName: string) => {
        let cbProxyMap = this.evtCbProxyMap.get(eventName);

        if (!cbProxyMap) {
          this.evtCbProxyMap.set(eventName, (cbProxyMap = new Map()));
        }

        if (cbProxyMap.get(handle)) {
          return;
        }

        const handleProxy = (...args: any[]) => {
          if (args[0] && typeof args[0] === 'object' && !args[0].lngLat && !args[0].lnglat) {
            args[0].lngLat = args[0].latlng || args[0].latLng;
            args[0].map = this.map;
          }
          handle(...args);
        };

        cbProxyMap.set(handle, handleProxy);
        this.map.on(eventName, handleProxy);
      };

      if (Array.isArray(EventMap[type])) {
        EventMap[type].forEach((eventName: string) => {
          onProxy(eventName || type);
        });
      } else {
        onProxy(EventMap[type] || type);
      }
    }
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handle);
      return;
    }

    const offProxy = (eventName: string) => {
      const handleProxy = this.evtCbProxyMap.get(type)?.get(handle);
      if (!handleProxy) {
        return;
      }
      this.evtCbProxyMap.get(eventName)?.delete(handle);
      this.map.off(eventName, handleProxy);
    };

    if (Array.isArray(EventMap[type])) {
      EventMap[type].forEach((eventName: string) => {
        offProxy(eventName || type);
      });
    } else {
      offProxy(EventMap[type] || type);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // @ts-ignore
    const lngLat = window.T.LngLat(lnglat[0], lnglat[1]);
    this.map.centerAndZoom(lngLat, this.map.getZoom());
  }

  public setZoomAndCenter(zoom: number, center: [number, number]) {
    // @ts-ignore
    const lngLat = window.T.LngLat(center[0], center[1]);
    this.map.centerAndZoom(lngLat, zoom);
  }

  public getPitch(): number {
    return 0;
  }

  public getRotation(): number {
    return 0;
  }

  public setRotation(rotation: number): void {
    this.map.setBearing(rotation);
  }

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

  public fitBounds(bound: Bounds): void {
    const [sw, ne] = bound;
    // @ts-ignore
    this.map.setViewport([new window.T.LngLat(sw[0], sw[1]), new window.T.LngLat(ne[0], ne[1])]);
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

  public getModelMatrix(): number[] {
    throw new Error('Method not implemented.');
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
    const pixelCoord = this.lngLatToPixel([lng, lat]);
    return [pixelCoord.x, pixelCoord.y];
  }

  public lngLatToCoords(list: number[][] | number[][][]): any {
    return list.map((item) =>
      Array.isArray(item[0])
        ? this.lngLatToCoords(item as Array<[number, number]>)
        : this.lngLatToCoord(item as [number, number]),
    );
  }

  public getBounds(): Bounds {
    const latlngBound = this.map.getBounds();

    const sw = latlngBound.getSouthWest(),
      ne = latlngBound.getNorthEast();
    return [
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ];
  }

  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    // Use built in mercator tools due to Tencent not provided related methods
    const { x = 0, y = 0, z = 0 } = MercatorCoordinate.fromLngLat(lnglat, altitude);
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
