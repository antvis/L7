import type {
  Bounds,
  ILngLat,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapStyleConfig,
  Point,
} from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { MercatorCoordinate } from '@antv/l7-map';
import { DOM } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
import Viewport from '../lib/web-mercator-viewport';
import BaseMapService from '../utils/BaseMapService';
import './logo.css';
import TMapLoader from './maploader';

const TMAP_API_KEY: string = 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77';
const BMAP_VERSION: string = '1.exp';

const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'center_changed',
  camerachange: ['drag', 'pan', 'rotate', 'pitch', 'zoom'],
  zoomchange: 'zoom',
  dragging: 'drag',
};

// TODO: 基于抽象类 BaseMap 实现，补全缺失方法，解决类型问题
export default class TMapService extends BaseMapService<TMap.Map> {
  // @ts-ignore
  protected viewport: IViewport = null;
  protected evtCbProxyMap: Map<string, Map<(...args: any) => any, (...args: any) => any>> =
    new Map();

  public handleCameraChanged = () => {
    // Trigger map change event
    this.emit('mapchange');
    // resync
    const map = this.map;
    // @ts-ignore
    const { lng, lat } = map.getCenter();
    const option = {
      center: [lng, lat],
      // @ts-ignore
      viewportHeight: map.getContainer().clientHeight,
      // @ts-ignore
      viewportWidth: map.getContainer().clientWidth,
      // @ts-ignore
      bearing: map.getHeading(),
      // @ts-ignore
      pitch: map.getPitch(),
      // @ts-ignore
      zoom: map.getZoom() - 1,
    };

    this.viewport.syncWithMapCamera(option as any);
    this.updateCoordinateSystemService();
    this.cameraChangedCallback(this.viewport);
  };

  public async init(): Promise<void> {
    this.viewport = new Viewport();

    // TODO: Handle initial config
    const {
      id,
      mapInstance,
      center = [121.30654632240122, 31.25744185633306],
      token = TMAP_API_KEY,
      version = BMAP_VERSION,
      libraries = [],
      minZoom = 3,
      maxZoom = 18,
      rotation = 0,
      pitch = 0,
      mapSize = 10000,
      logoVisible = true,
      ...rest
    } = this.config;

    if (!(window.TMap || mapInstance)) {
      await TMapLoader.load({
        key: token,
        version,
        libraries,
      });
    }

    if (mapInstance) {
      // If there's already a map instance, maybe not setting any other configurations
      this.map = mapInstance as any;
      this.$mapContainer = this.map.getContainer();
      if (logoVisible === false) {
        this.hideLogo();
      }
    } else {
      if (!id) {
        throw Error('No container id specified');
      }
      const mapContainer = DOM.getContainer(id)!;

      const map = new TMap.Map(mapContainer, {
        maxZoom,
        minZoom,
        rotation,
        pitch,
        showControl: false,
        // Tencent use (Lat, Lng) while center is (Lng, Lat)
        center: new TMap.LatLng(center[1], center[0]),
        ...rest,
      });

      // @ts-ignore
      this.map = map;
      // @ts-ignore
      this.$mapContainer = map.getContainer();
      if (logoVisible === false) {
        this.hideLogo();
      }
    }

    // Set tencent map canvas element position as absolute
    // @ts-ignore
    this.map.canvasContainer.style.position = 'absolute';
    // @ts-ignore
    this.map.drawContainer.classList.add('tencent-map');

    // Set tencent map control layer dom index
    // @ts-ignore
    const controlParentContainer = this.map.controlManager.controlContainer?.parentNode;
    if (controlParentContainer) {
      controlParentContainer.style.zIndex = 2;
    }

    this.simpleMapCoord.setSize(mapSize);

    // May be find an integrated event replacing following events
    this.map.on('drag', this.handleCameraChanged);
    this.map.on('pan', this.handleCameraChanged);
    this.map.on('rotate', this.handleCameraChanged);
    this.map.on('pitch', this.handleCameraChanged);
    this.map.on('zoom', this.handleCameraChanged);

    // Trigger camera change after init
    this.handleCameraChanged();
  }

  public destroy(): void {
    this.map.destroy();
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  public addMarkerContainer(): void {
    const container = this.map.getContainer();
    this.markerContainer = DOM.create('div', 'l7-marker-container', container);
    this.markerContainer.setAttribute('tabindex', '-1');
    this.markerContainer.style.zIndex = '2';
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
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

  public once(): void {
    throw new Error('Method not implemented.');
  }

  // get dom
  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getSize(): [number, number] {
    // @ts-ignore
    return [this.map.width, this.map.height];
  }

  // get map status method
  public getMinZoom(): number {
    // @ts-ignore
    return this.map.transform._minZoom;
  }

  public getMaxZoom(): number {
    // @ts-ignore
    return this.map.transform._maxZoom;
  }

  // get map params
  public getType() {
    return 'tmap';
  }

  public getZoom(): number {
    return this.map.getZoom();
  }
  public getCenter(): ILngLat {
    const { lng, lat } = this.map.getCenter();
    return {
      lng,
      lat,
    };
  }
  public getPitch(): number {
    return this.map.getPitch();
  }

  public getRotation(): number {
    return this.map.getRotation();
  }

  public getBounds(): Bounds {
    const ne = this.map.getBounds().getNorthEast();
    const sw = this.map.getBounds().getSouthWest();
    return [
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ];
  }

  public getMapContainer(): HTMLElement {
    return this.map.getContainer();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getContainer()?.getElementsByTagName('canvas')[0];
  }

  public getCanvasOverlays() {
    return this.getMapCanvasContainer()?.nextSibling?.firstChild as HTMLElement;
  }

  public getMapStyleConfig(): MapStyleConfig {
    // return this.getMap()
    throw new Error('Method not implemented.');
  }

  public setBgColor(color: string): void {
    this.bgColor = color;
  }

  public setMapStyle(styleId: any): void {
    this.map.setMapStyleId(styleId);
  }

  // control with raw map
  public setRotation(rotation: number): void {
    this.map.setRotation(rotation);
  }

  public zoomIn(): void {
    this.map.setZoom(this.getZoom() + 1);
  }

  public zoomOut(): void {
    this.map.setZoom(this.getZoom() - 1);
  }

  public panTo([lng, lat]: Point): void {
    this.map.panTo(new TMap.LatLng(lat, lng));
  }

  public panBy(x: number, y: number): void {
    this.map.panBy([x, y]);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void {
    const [sw, ne] = bound;
    const swLatLng = new TMap.LatLng(sw[1], sw[0]);
    const neLatLng = new TMap.LatLng(ne[1], ne[0]);
    const bounds = new TMap.LatLngBounds(swLatLng, neLatLng);
    // @ts-ignore
    this.map.fitBounds(bounds, fitBoundsOptions);
  }

  public setZoomAndCenter(zoom: number, [lng, lat]: Point): void {
    this.map.setCenter(new TMap.LatLng(lat, lng));
    this.map.setZoom(zoom);
  }

  public setCenter([lng, lat]: [number, number]): void {
    this.map.setCenter(new TMap.LatLng(lat, lng));
  }

  public setPitch(pitch: number): any {
    this.map.setPitch(pitch);
  }

  public setZoom(zoom: number): any {
    this.map.setZoom(zoom);
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    (Object.keys(option) as Array<keyof IStatusOptions>).map((status) => {
      switch (status) {
        case 'doubleClickZoom':
          this.map.setDoubleClickZoom(!!option.doubleClickZoom);
          break;
        case 'dragEnable':
          this.map.setDraggable(!!option.dragEnable);
          break;
        case 'rotateEnable':
          // @ts-ignore
          this.map.setRotatable(!!option.rotateEnable);
          break;
        case 'zoomEnable':
          this.map.setDoubleClickZoom(!!option.zoomEnable);
          this.map.setScrollable(!!option.zoomEnable);
          break;
        case 'keyboardEnable':
        case 'resizeEnable':
        case 'showIndoorMap':
          throw Error('Options may bot be supported');
        default:
      }
    });
  }

  // coordinates methods
  public meterToCoord(
    [centerLon, centerLat]: [number, number],
    [outerLon, outerLat]: [number, number],
  ) {
    const metreDistance = TMap.geometry.computeDistance([
      new TMap.LatLng(centerLat, centerLon),
      new TMap.LatLng(outerLat, outerLon),
    ]);

    const [x1, y1] = this.lngLatToCoord!([centerLon, centerLat]);
    const [x2, y2] = this.lngLatToCoord!([outerLon, outerLat]);
    const coordDistance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDistance / metreDistance;
  }

  public pixelToLngLat([x, y]: Point): ILngLat {
    // Since tecent map didn't provide the reverse method for transforming from pixel to lnglat
    // It had to be done by calculate the relative distance in container coordinates
    const { lng: clng, lat: clat } = this.map.getCenter();
    const { x: centerPixelX, y: centerPixelY } = this.lngLatToPixel([clng, clat]);
    const { x: centerContainerX, y: centerContainerY } = this.lngLatToContainer([clng, clat]);
    const { lng, lat } = this.map.unprojectFromContainer(
      new TMap.Point(centerContainerX + (x - centerPixelX), centerContainerY + (y - centerPixelY)),
    );
    return this.containerToLngLat([lng, lat]);
  }

  public lngLatToPixel([lng, lat]: Point): IPoint {
    // @ts-ignore
    const { x, y } = this.map.projectToWorldPlane(new TMap.LatLng(lat, lng));
    return { x, y };
  }

  public containerToLngLat([x, y]: [number, number]): ILngLat {
    const { lng, lat } = this.map.unprojectFromContainer(new TMap.Point(x, y));
    return { lng, lat };
  }

  public lngLatToContainer([lng, lat]: [number, number]): IPoint {
    // @ts-ignore
    const { x, y } = this.map.projectToContainer(new TMap.LatLng(lat, lng));
    return { x, y };
  }

  public lngLatToCoord?([lng, lat]: [number, number]): [number, number] {
    // TODO: Perhaps need to check the three.js coordinates
    const { x, y } = this.lngLatToPixel([lng, lat]);
    return [x, -y];
  }

  public lngLatToCoords?(list: number[][] | number[][][]): any {
    return list.map((item) =>
      Array.isArray(item[0])
        ? this.lngLatToCoords!(item as Array<[number, number]>)
        : this.lngLatToCoord!(item as [number, number]),
    );
  }

  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    // Use built in mercator tools due to Tencent not provided related methods
    const { x = 0, y = 0, z = 0 } = MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
  ): number[] {
    const flat = this.viewport.projectFlat(lnglat);
    // @ts-ignore
    const modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(flat[0], flat[1], altitude));
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(scale[0], scale[1], scale[2]));

    mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
    mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);

    return modelMatrix as unknown as number[];
  }

  public getCustomCoordCenter?(): [number, number] {
    throw new Error('Method not implemented.');
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.getMapCanvasContainer() as HTMLCanvasElement;
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  // Method on earth mode
  public rotateY?(): void {
    throw new Error('Method not implemented.');
  }

  private hideLogo() {
    const container = this.map.getContainer();
    if (!container) {
      return;
    }
    DOM.addClass(container, 'tmap-contianer--hide-logo');
  }
}
