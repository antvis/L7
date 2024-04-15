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
import GMapLoader from './maploader';

const GMAP_API_KEY: string = 'AIzaSyDBDCfl4pvuDtaazdCog3LmhA7CQLhmcRE';

const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'center_changed',
  camerachange: ['drag', 'pan', 'rotate', 'tilt', 'zoom_changed'],
  zoomchange: 'zoom_changed',
  dragging: 'drag',
};

// TODO: 基于抽象类 BaseMap 实现，补全缺失方法，解决类型问题
export default class TMapService extends BaseMapService<any> {
  // @ts-ignore
  protected viewport: IViewport = null;
  protected evtCbProxyMap: Map<string, Map<(...args: any) => any, (...args: any) => any>> =
    new Map();

  public handleCameraChanged = () => {
    this.emit('mapchange');
    const map = this.map;

    const { lng, lat } = map.getCenter();

    const option = {
      center: [lng(), lat()],

      viewportHeight: map.getDiv().clientHeight,

      viewportWidth: map.getDiv().clientWidth,

      bearing: map.getHeading(),

      pitch: map.getTilt(),

      zoom: map.getZoom() - 1,
    };

    this.viewport.syncWithMapCamera(option as any);
    this.updateCoordinateSystemService();
    this.cameraChangedCallback(this.viewport);
  };

  public async init(): Promise<void> {
    this.viewport = new Viewport();

    const {
      id,
      mapInstance,
      center = [121.30654632240122, 31.25744185633306],
      token = GMAP_API_KEY,
      minZoom = 3,
      maxZoom = 18,
      logoVisible = true,
      ...rest
    } = this.config;

    if (!(window.google?.maps?.Map || mapInstance)) {
      await GMapLoader.load({
        key: token,
      });
    }

    if (mapInstance) {
      // If there's already a map instance, maybe not setting any other configurations
      this.map = mapInstance as any;
      this.$mapContainer = this.map.getDiv();
      if (logoVisible === false) {
        this.hideLogo();
      }
    } else {
      if (!id) {
        throw Error('No container id specified');
      }
      const mapContainer = DOM.getContainer(id)!;

      const map = new google.maps.Map(mapContainer, {
        maxZoom,
        minZoom,
        zoomControl: false,
        fullscreenControl: false,
        center: new google.maps.LatLng(center[1], center[0]),
        ...rest,
      });

      this.map = map;

      this.$mapContainer = map.getDiv();
      if (logoVisible === false) {
        this.hideLogo();
      }
    }

    // TODO: 拖动快的时候，事件失效
    google.maps.event.addListener(this.map, 'drag', this.handleCameraChanged);

    google.maps.event.addListener(this.map, 'pan', this.handleCameraChanged);

    google.maps.event.addListener(this.map, 'rotate', this.handleCameraChanged);

    // 空闲时间
    google.maps.event.addListener(this.map, 'idle', this.handleCameraChanged);

    google.maps.event.addListener(this.map, 'zoom_changed', this.handleCameraChanged);

    this.handleCameraChanged();
  }

  public destroy(): void {
    this.map.setMap(null);
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  public addMarkerContainer(): void {
    // const container = this.map.getDiv();
    // this.markerContainer = DOM.create('div', 'l7-marker-container', container);
    // this.markerContainer.setAttribute('tabindex', '-1');
    // this.markerContainer.style.zIndex = '2';
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  public getCanvasOverlays() {
    // TODO: 由于 Google Map 的 loaded 提前触发，导致 Google Map 的 DOM 结构无法获取
    return this.map.getDiv() as HTMLElement;
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
    return this.map.getDiv();
  }

  public getSize(): [number, number] {
    return [this.map.width, this.map.height];
  }

  // get map status method
  public getMinZoom(): number {
    return this.map.transform._minZoom;
  }

  public getMaxZoom(): number {
    return this.map.transform._maxZoom;
  }

  // get map params
  public getType() {
    return 'googlemap';
  }

  public getZoom(): number {
    return this.map.getZoom();
  }
  public getCenter(): ILngLat {
    const { lng, lat } = this.map.getCenter();
    return {
      lng: lng(),
      lat: lat(),
    };
  }
  public getPitch(): number {
    return this.map.getTilt();
  }

  public getRotation(): number {
    const rotation = this.map.getHeading();
    return rotation;
  }

  public getBounds(): Bounds {
    // TODO
    // 官网解释：如果地图尚未初始化，或者尚未设置中心位置且未设置缩放，则结果为 undefine
    const bounds = this.map.getBounds();
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();
    return [
      [sw.lng(), sw.lat()],
      [ne.lng(), ne.lat()],
    ];
  }

  public getMapContainer(): HTMLElement {
    return this.map.getDiv();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getDiv()?.getElementsByTagName('canvas')[0];
  }

  public getMapStyleConfig(): MapStyleConfig {
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
    this.map.setHeading(rotation);
  }

  public zoomIn(): void {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom + 1);
  }

  public zoomOut(): void {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom - 1);
  }

  public panTo([lng, lat]: Point): void {
    this.map.panTo({ lat, lng });
  }

  public panBy(x: number, y: number): void {
    this.map.panBy(x, y);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void {
    const [sw, ne] = bound;

    const bounds = new google.maps.LatLngBounds(
      { lat: sw[1], lng: sw[0] },
      { lat: ne[1], lng: ne[0] },
    );
    this.map.fitBounds(bounds, fitBoundsOptions);
  }

  public setZoomAndCenter(zoom: number, [lng, lat]: Point): void {
    this.map.setZoom(zoom);
    this.map.setCenter({ lat: lat, lng: lng });
  }

  public setCenter([lng, lat]: [number, number]): void {
    this.map.setCenter({ lat: lat, lng: lng });
  }

  public setPitch(pitch: number): any {
    this.map.setTilt(pitch);
  }

  public setZoom(zoom: number): any {
    this.map.setZoom(zoom);
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    (Object.keys(option) as Array<keyof IStatusOptions>).map((status) => {
      switch (status as keyof IStatusOptions) {
        case 'doubleClickZoom':
          this.map.setOptions({
            gestureHandling: option.doubleClickZoom ? 'auto' : 'none',
          });
          break;
        case 'dragEnable':
          this.map.setOptions({ draggable: option.dragEnable });
          break;
        case 'rotateEnable':
          // Google Map 默认支持旋转，无需额外设置
          break;
        case 'zoomEnable':
          this.map.setOptions({ zoomControl: option.zoomEnable });
          break;
        case 'keyboardEnable':
        case 'resizeEnable':
        case 'showIndoorMap':
          throw Error('Options may not be supported');
        default:
      }
    });
  }

  // coordinates methods
  public meterToCoord(
    [centerLon, centerLat]: [number, number],
    [outerLon, outerLat]: [number, number],
  ) {
    // @ts-ignore
    // https://developers.google.com/maps/documentation/javascript/reference/geometry?hl=zh-cn#spherical.computeDistanceBetween
    const metreDistance = google.maps.geometry.spherical.computeDistanceBetween([
      new google.maps.LatLng(centerLat, centerLon),

      new google.maps.LatLng(outerLat, outerLon),
    ]);

    const [x1, y1] = this.lngLatToCoord!([centerLon, centerLat]);
    const [x2, y2] = this.lngLatToCoord!([outerLon, outerLat]);
    const coordDistance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDistance / metreDistance;
  }

  public pixelToLngLat([x, y]: Point): ILngLat {
    const { lng: clng, lat: clat } = this.map.getCenter();
    const { x: centerPixelX, y: centerPixelY } = this.lngLatToPixel([clng(), clat()]);
    const { x: centerContainerX, y: centerContainerY } = this.lngLatToContainer([clng(), clat()]);
    const { lng, lat } = this.map.unprojectFromContainer(
      new google.maps.Point(
        centerContainerX + (x - centerPixelX),
        centerContainerY + (y - centerPixelY),
      ),
    );
    return this.containerToLngLat([lng, lat]);
  }

  public lngLatToPixel([lng, lat]: Point): IPoint {
    const latLng = new google.maps.LatLng(lat, lng);
    const point = this.map.getProjection().fromLatLngToPoint(latLng);
    return { x: point.x, y: point.y };
  }

  public containerToLngLat([x, y]: [number, number]): ILngLat {
    const pixelCoordinate = new google.maps.Point(x, y);
    const lngLat = this.map.getProjection()?.fromPointToLatLng(pixelCoordinate);
    return { lng: lngLat.lng(), lat: lngLat.lat() };
  }

  public lngLatToContainer([lng, lat]: [number, number]): IPoint {
    const latLng = new google.maps.LatLng(lat, lng);
    const pixel = this.map.getProjection()?.fromLatLngToContainerPixel?.(latLng);
    return { x: pixel.x, y: pixel.y };
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
    const container = this.map.getDiv();
    if (!container) {
      return;
    }
    DOM.addClass(container, 'tmap-contianer--hide-logo');
  }
}
