/**
 * AMapService
 */
import {
  Bounds,
  CoordinateSystem,
  ICoordinateSystemService,
  ILngLat,
  IMapConfig,
  IMapService,
  IPoint,
  IViewport,
  MapServiceEvent,
  MapType,
  TYPES,
} from '@l7/core';
import { DOM } from '@l7/utils';
import { inject, injectable } from 'inversify';
import { IAMapEvent, IAMapInstance } from '../../typings/index';
import { MapTheme } from './theme';
import Viewport from './Viewport';

const AMAP_API_KEY: string = '15cd8a57710d40c9b7c0e3cc120f1200';
const AMAP_VERSION: string = '1.4.15';
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

/**
 * AMapService
 */
@injectable()
export default class AMapService implements IMapService {
  public map: AMap.Map & IAMapInstance;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;
  @inject(TYPES.IEventEmitter)
  private eventEmitter: IEventEmitter;
  private markerContainer: HTMLElement;
  private $mapContainer: HTMLElement | null;
  private $jsapi: HTMLScriptElement;

  private viewport: Viewport;

  private cameraChangedCallback: (viewport: IViewport) => void;

  // init
  public addMarkerContainer(): void {
    const mapContainer = this.map.getContainer();
    if (mapContainer !== null) {
      const amap = mapContainer.getElementsByClassName(
        'amap-maps',
      )[0] as HTMLElement;
      this.markerContainer = DOM.create('div', 'l7_marker', amap);
    }
  }
  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  //  map event
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      this.map.on(type, handle);
    }
  }
  public off(type: string, handle: (...args: any[]) => void): void {
    this.map.off(type, handle);
  }

  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getSize(): [number, number] {
    const size = this.map.getSize();
    return [size.getWidth(), size.getHeight()];
  }

  public getType() {
    return MapType.amap;
  }
  public getZoom(): number {
    return this.map.getZoom();
  }
  public getCenter(): ILngLat {
    const center = this.map.getCenter();
    return {
      lng: center.getLng(),
      lat: center.getLat(),
    };
  }

  public getPitch(): number {
    return this.map.getPitch();
  }

  public getRotation(): number {
    return this.map.getRotation();
  }

  public getBounds(): Bounds {
    // @ts-ignore
    const amapBound = this.map.getBounds().toBounds();
    const NE = amapBound.getNorthEast();
    const SW = amapBound.getSouthWest();
    return [[NE.getLng(), NE.getLat()], [SW.getLng(), SW.getLat()]];
  }

  public getMinZoom(): number {
    const zooms = this.map.get('zooms') as [number, number];
    return zooms[0];
  }
  public getMaxZoom(): number {
    const zooms = this.map.get('zooms') as [number, number];
    return zooms[1];
  }
  public setRotation(rotation: number): void {
    return this.map.setRotation(rotation);
  }

  public zoomIn(): void {
    this.map.zoomIn();
  }

  public zoomOut(): void {
    this.map.zoomOut();
  }

  public panTo(p: [number, number]): void {
    this.map.panTo(p);
  }
  public panBy(pixel: [number, number]): void {
    this.map.panTo(pixel);
  }
  public fitBounds(extent: Bounds): void {
    this.map.setBounds(
      new AMap.Bounds([extent[0][0], extent[0][1], extent[1][0], extent[1][1]]),
    );
  }
  public setZoomAndCenter(zoom: number, center: [number, number]): void {
    this.map.setZoomAndCenter(zoom, center);
  }
  public setMapStyle(style: string): void {
    this.map.setMapStyle(this.getMapStyle(style));
  }
  public pixelToLngLat(pixel: [number, number]): ILngLat {
    const lngLat = this.map.pixelToLngLat(new AMap.Pixel(pixel[0], pixel[1]));
    return { lng: lngLat.getLng(), lat: lngLat.getLat() };
  }
  public lngLatToPixel(lnglat: [number, number]): IPoint {
    const p = this.map.lnglatToPixel(new AMap.LngLat(lnglat[0], lnglat[1]));
    return {
      x: p.getX(),
      y: p.getY(),
    };
  }
  public containerToLngLat(pixel: [number, number]): ILngLat {
    const ll = new AMap.Pixel(pixel[0], pixel[1]);
    const lngLat = this.map.containerToLngLat(ll);
    return {
      lng: lngLat.getLng(),
      lat: lngLat.getLat(),
    };
  }
  public lngLatToContainer(lnglat: [number, number]): IPoint {
    const ll = new AMap.LngLat(lnglat[0], lnglat[1]);
    const pixel = this.map.lngLatToContainer(ll);
    return {
      x: pixel.getX(),
      y: pixel.getY(),
    };
  }

  public async init(mapConfig: IMapConfig): Promise<void> {
    const {
      id,
      style = 'light',
      minZoom = 0,
      maxZoom = 18,
      ...rest
    } = mapConfig;

    this.$mapContainer = document.getElementById(id);

    // this.eventEmitter = container.get(TYPES.IEventEmitter);

    // tslint:disable-next-line:typedef
    await new Promise((resolve) => {
      // 异步加载高德地图
      // @see https://lbs.amap.com/api/javascript-api/guide/abc/load
      window.onload = (): void => {
        // @ts-ignore
        this.map = new AMap.Map(id, {
          mapStyle: this.getMapStyle(style),
          zooms: [minZoom, maxZoom],
          viewMode: '3D',
          ...rest,
        });

        // 监听地图相机时间
        this.map.on('camerachange', this.handleCameraChanged);
        this.emit('mapload');
        resolve();
      };

      const url: string = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_API_KEY}&plugin=Map3D&callback=onload`;
      this.$jsapi = document.createElement('script');
      this.$jsapi.charset = 'utf-8';
      this.$jsapi.src = url;
      document.head.appendChild(this.$jsapi);
    });

    this.viewport = new Viewport();
  }
  public emit(name: string, ...args: any[]) {
    this.eventEmitter.emit(name, ...args);
  }

  public once(name: string, ...args: any[]) {
    this.eventEmitter.once(name, ...args);
  }

  public destroy() {
    this.eventEmitter.removeAllListeners();
    if (this.map) {
      this.map.destroy();
      document.head.removeChild(this.$jsapi);
    }
  }

  public getMapContainer() {
    return this.$mapContainer;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  private handleCameraChanged = (e: IAMapEvent): void => {
    const {
      fov,
      near,
      far,
      height,
      pitch,
      rotation,
      aspect,
      position,
    } = e.camera;
    const { lng, lat } = this.getCenter();
    if (this.cameraChangedCallback) {
      // resync viewport
      this.viewport.syncWithMapCamera({
        aspect,
        // AMap 定义 rotation 为顺时针方向，而 Mapbox 为逆时针
        // @see https://docs.mapbox.com/mapbox-gl-js/api/#map#getbearing
        bearing: 360 - rotation,
        far,
        fov,
        cameraHeight: height,
        near,
        pitch,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: this.map.getZoom() - 1,
        center: [lng, lat],
        offsetOrigin: [position.x, position.y],
      });

      // set coordinate system
      // if (this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD) {
      //   // TODO:偏移坐标系高德地图不支持 pith bear 同步
      //   this.coordinateSystemService.setCoordinateSystem(
      //     CoordinateSystem.P20_OFFSET,
      //   );
      // } else {
      //   this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20);
      // }
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20);
      this.cameraChangedCallback(this.viewport);
    }
  };

  private getMapStyle(name: string) {
    return MapTheme[name] ? MapTheme[name] : name;
  }
}
