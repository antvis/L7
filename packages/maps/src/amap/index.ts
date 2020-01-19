/**
 * AMapService
 */
import {
  Bounds,
  CoordinateSystem,
  ICoordinateSystemService,
  IGlobalConfigService,
  ILngLat,
  ILogService,
  IMapConfig,
  IMapService,
  IPoint,
  IViewport,
  MapServiceEvent,
  MapStyle,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import { IAMapEvent, IAMapInstance } from '../../typings/index';
import { MapTheme } from './theme';
import Viewport from './Viewport';
let mapdivCount = 0;

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
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12; // 暂时关闭 fix 统一不同坐标系，不同底图的高度位置

/**
 * AMapService
 */
@injectable()
export default class AMapService
  implements IMapService<AMap.Map & IAMapInstance> {
  /**
   * 原始地图实例
   */
  public map: AMap.Map & IAMapInstance;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  @inject(TYPES.MapConfig)
  private readonly config: Partial<IMapConfig>;

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
    return 'amap';
  }
  public getZoom(): number {
    // 统一返回 Mapbox 缩放等级
    return this.map.getZoom() - 1;
  }

  public setZoom(zoom: number): void {
    return this.map.setZoom(zoom);
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
    const center = this.getCenter();
    const maxlng =
      center.lng > NE.getLng() || center.lng < SW.getLng()
        ? 180 - NE.getLng()
        : NE.getLng();
    const minlng = center.lng < SW.getLng() ? SW.getLng() - 180 : SW.getLng();
    // 兼容 Mapbox，统一返回西南、东北
    return [
      [minlng, SW.getLat()],
      [maxlng, NE.getLat()],
    ];
  }

  public getMinZoom(): number {
    const zooms = this.map.get('zooms') as [number, number];
    return zooms[0] - 1;
  }
  public getMaxZoom(): number {
    const zooms = this.map.get('zooms') as [number, number];
    return zooms[1] - 1;
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
      lng: lngLat?.getLng(),
      lat: lngLat?.getLat(),
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

  public async init(): Promise<void> {
    const {
      id,
      style = 'light',
      minZoom = 0,
      maxZoom = 18,
      token = AMAP_API_KEY,
      mapInstance,
      plugin = [],
      ...rest
    } = this.config;
    // 高德地图创建独立的container；
    // tslint:disable-next-line:typedef
    await new Promise((resolve) => {
      const resolveMap = () => {
        if (mapInstance) {
          this.map = mapInstance as AMap.Map & IAMapInstance;
          this.$mapContainer = this.map.getContainer();
          setTimeout(() => {
            this.map.on('camerachange', this.handleCameraChanged);
            resolve();
          }, 30);
        } else {
          this.$mapContainer = this.creatAmapContainer(
            id as string | HTMLDivElement,
          );

          const map = new AMap.Map(this.$mapContainer, {
            mapStyle: this.getMapStyle(style as string),
            zooms: [minZoom, maxZoom],
            viewMode: '3D',
            ...rest,
          });
          // 监听地图相机事件
          map.on('camerachange', this.handleCameraChanged);
          // @ts-ignore
          this.map = map;
          setTimeout(() => {
            resolve();
          }, 10);
        }
      };
      if (!amapLoaded && !mapInstance) {
        if (token === AMAP_API_KEY) {
          this.logger.warn(this.configService.getSceneWarninfo('MapToken'));
        }
        amapLoaded = true;
        this.loadAMapScript(
          `https://webapi.amap.com/maps?v=${AMAP_VERSION}&key=${token}&plugin=Map3D${plugin.join(
            ',',
          )}`,
        ).then(() => {
          resolveMap();
          if (pendingResolveQueue.length) {
            pendingResolveQueue.forEach((r) => r());
            pendingResolveQueue = [];
          }
        });
      } else {
        if ((amapLoaded && window.AMap) || mapInstance) {
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
      if (this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD) {
        this.coordinateSystemService.setCoordinateSystem(
          CoordinateSystem.P20_OFFSET,
        );
      } else {
        this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20);
      }
      this.cameraChangedCallback(this.viewport);
    }
  };

  private getMapStyle(name: string): string {
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
      height: 100%;
      width: 100%;
    `;
    $amapdiv.id = 'l7_amap_div' + mapdivCount++;
    $wrapper.appendChild($amapdiv);
    return $amapdiv;
  }
  private loadAMapScript(src: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
