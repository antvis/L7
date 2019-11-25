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
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import { IAMapEvent, IAMapInstance } from '../../typings/index';
import { MapTheme } from './theme';
import Viewport from './Viewport';

const AMAP_API_KEY: string = '15cd8a57710d40c9b7c0e3cc120f1200';
const AMAP_VERSION: string = '1.4.15';
/**
 * 确保多个场景只引入一个高德地图脚本
 */
const AMAP_SCRIPT_ID: string = 'amap-script';
/**
 * 高德地图脚本是否加载完毕
 */
let amapLoaded = false;
/**
 * 高德地图脚本加载成功等待队列，成功之后依次触发
 */
let pendingResolveQueue: Array<() => void> = [];
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

/**
 * AMapService
 */
@injectable()
export default class AMapService implements IMapService {
  /**
   * 原始地图实例
   */
  public map: AMap.Map & IAMapInstance;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;
  @inject(TYPES.IEventEmitter)
  private eventEmitter: any;
  private markerContainer: HTMLElement;
  private $mapContainer: HTMLElement | null;

  private viewport: Viewport;

  private cameraChangedCallback: (viewport: IViewport) => void;

  public addMarkerContainer(): void {
    const mapContainer = this.map.getContainer();
    if (mapContainer !== null) {
      const amap = mapContainer.getElementsByClassName(
        'amap-maps',
      )[0] as HTMLElement;
      this.markerContainer = DOM.create('div', 'l7-marker-container', amap);
    }
  }
  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  //  map event
  public on(type: string, handler: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handler);
    } else {
      this.map.on(type, handler);
    }
  }
  public off(type: string, handler: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handler);
    } else {
      this.map.off(type, handler);
    }
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
    // 统一返回 Mapbox 缩放等级
    return this.map.getZoom() - 1;
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
    // 统一返回逆时针旋转角度
    return 360 - this.map.getRotation();
  }

  public getBounds(): Bounds {
    // @ts-ignore
    const amapBound = this.map.getBounds().toBounds();
    const NE = amapBound.getNorthEast();
    const SW = amapBound.getSouthWest();
    // 兼容 Mapbox，统一返回西南、东北
    return [
      [SW.getLng(), SW.getLat()],
      [NE.getLng(), NE.getLat()],
    ];
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
      token = AMAP_API_KEY,
      ...rest
    } = mapConfig;
    // 高德地图创建独立的container；

    // @ts-ignore
    this.$mapContainer = this.creatAmapContainer(id);
    // tslint:disable-next-line:typedef
    await new Promise((resolve) => {
      const resolveMap = () => {
        // @ts-ignore
        this.map = new AMap.Map(this.$mapContainer, {
          mapStyle: this.getMapStyle(style),
          zooms: [minZoom, maxZoom],
          viewMode: '3D',
          ...rest,
        });

        // 监听地图相机事件
        this.map.on('camerachange', this.handleCameraChanged);
        resolve();
      };

      if (!document.getElementById(AMAP_SCRIPT_ID)) {
        // 异步加载高德地图
        // @see https://lbs.amap.com/api/javascript-api/guide/abc/load
        // @ts-ignore
        window.initAMap = (): void => {
          amapLoaded = true;
          resolveMap();

          if (pendingResolveQueue.length) {
            pendingResolveQueue.forEach((r) => r());
            pendingResolveQueue = [];
          }
        };
        const url: string = `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${AMAP_API_KEY}&plugin=Map3D&callback=initAMap`;
        const $jsapi = document.createElement('script');
        $jsapi.id = AMAP_SCRIPT_ID;
        $jsapi.charset = 'utf-8';
        $jsapi.src = url;
        document.head.appendChild($jsapi);
      } else {
        if (amapLoaded) {
          resolveMap();
        } else {
          pendingResolveQueue.push(resolveMap);
        }
      }
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
    this.map.destroy();
    // @ts-ignore
    delete window.initAMap;
    const $jsapi = document.getElementById(AMAP_SCRIPT_ID);
    if ($jsapi) {
      document.head.removeChild($jsapi);
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
      //   // TODO:偏移坐标系高德地图不支持 pitch bear 同步
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
  private creatAmapContainer(id: string | HTMLDivElement) {
    let $wrapper = id as HTMLDivElement;
    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    }
    const $amapdiv = document.createElement('div');
    $amapdiv.style.cssText += `
      position: absolute;
      top: 0;
      z-index:2;
      height: 100%;
      width: 100%;
    `;
    $amapdiv.id = 'l7_amap_div';
    $wrapper.appendChild($amapdiv);
    return $amapdiv;
  }
}
