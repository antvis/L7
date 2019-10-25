/**
 * MapboxService
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
  MapType,
  TYPES,
} from '@l7/core';
import { DOM } from '@l7/utils';
import { inject, injectable } from 'inversify';
import mapboxgl, { IControl, Map } from 'mapbox-gl';
import { IMapboxInstance } from '../../typings/index';
import Viewport from './Viewport';
const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'move',
  camerachange: 'move',
};

mapboxgl.accessToken =
  'pk.eyJ1IjoieGlhb2l2ZXIiLCJhIjoiY2pxcmc5OGNkMDY3cjQzbG42cXk5NTl3YiJ9.hUC5Chlqzzh0FFd_aEc-uQ';
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

/**
 * AMapService
 */
@injectable()
export default class MapboxService implements IMapService {
  public map: Map & IMapboxInstance;
  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;
  private viewport: Viewport;
  private markerContainer: HTMLElement;
  private cameraChangedCallback: (viewport: IViewport) => void;
  private $mapContainer: HTMLElement | null;
  private $link: HTMLLinkElement;

  // init
  public addMarkerContainer(): void {
    const container = this.map.getCanvasContainer();
    this.markerContainer = DOM.create('div', 'l7_marker', container);
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  //  map event
  public on(type: string, handle: (...args: any[]) => void): void {
    this.map.on(EventMap[type] || type, handle);
  }
  public off(type: string, handle: (...args: any[]) => void): void {
    this.map.off(EventMap[type] || type, handle);
  }

  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getSize(): [number, number] {
    const size = this.map.transform;
    return [size.width, size.height];
  }
  // get mapStatus method

  public getType() {
    return MapType.mapbox;
  }
  public getZoom(): number {
    return this.map.getZoom();
  }

  public getCenter(): ILngLat {
    return this.map.getCenter();
  }

  public getPitch(): number {
    return this.map.getPitch();
  }

  public getRotation(): number {
    return this.map.getBearing();
  }

  public getBounds(): Bounds {
    return this.map.getBounds().toArray() as Bounds;
  }

  public getMinZoom(): number {
    return this.map.getMinZoom();
  }

  public getMaxZoom(): number {
    return this.map.getMaxZoom();
  }

  public setRotation(rotation: number): void {
    this.map.setBearing(rotation);
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
    this.panTo(pixel);
  }

  public fitBounds(bound: Bounds): void {
    this.map.fitBounds(bound);
  }

  public setMaxZoom(max: number): void {
    this.map.setMaxZoom(max);
  }

  public setMinZoom(min: number): void {
    this.map.setMinZoom(min);
  }

  public setZoomAndCenter(zoom: number, center: [number, number]): void {
    this.map.flyTo({
      zoom,
      center,
    });
  }

  public setMapStyle(style: string): void {
    this.map.setStyle(style);
  }
  // TODO: 计算像素坐标
  public pixelToLngLat(pixel: [number, number]): ILngLat {
    return this.map.unproject(pixel);
  }

  public lngLatToPixel(lnglat: [number, number]): IPoint {
    return this.map.project(lnglat);
  }

  public containerToLngLat(pixel: [number, number]): ILngLat {
    return this.map.unproject(pixel);
  }

  public lngLatToContainer(lnglat: [number, number]): IPoint {
    return this.map.project(lnglat);
  }

  public async init(mapConfig: IMapConfig): Promise<void> {
    const { id, attributionControl = false, ...rest } = mapConfig;
    this.$mapContainer = document.getElementById(id);

    this.viewport = new Viewport();

    /**
     * TODO: 使用 mapbox v0.53.x 版本 custom layer，需要共享 gl context
     * @see https://github.com/mapbox/mapbox-gl-js/blob/master/debug/threejs.html#L61-L64
     */
    // @ts-ignore
    this.map = new mapboxgl.Map({
      container: id,
      attributionControl,
      ...rest,
    });
    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();

    this.$link = document.createElement('link');
    this.$link.href =
      'https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.1/mapbox-gl.css';
    this.removeLogoControl();
    this.$link.rel = 'stylesheet';
    document.head.appendChild(this.$link);
  }

  public destroy() {
    document.head.removeChild(this.$link);
    this.$mapContainer = null;
    this.map.remove();
  }

  public getMapContainer() {
    return this.$mapContainer;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }
  // 同步不同底图的配置项
  private initMapConig(): void {
    throw new Error('Method not implemented.');
  }
  private handleCameraChanged = () => {
    // @see https://github.com/mapbox/mapbox-gl-js/issues/2572
    const { lat, lng } = this.map.getCenter().wrap();

    // resync
    this.viewport.syncWithMapCamera({
      bearing: this.map.getBearing(),
      center: [lng, lat],
      viewportHeight: this.map.transform.height,
      pitch: this.map.getPitch(),
      viewportWidth: this.map.transform.width,
      zoom: this.map.getZoom(),
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });

    // set coordinate system
    if (this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD) {
      this.coordinateSystemService.setCoordinateSystem(
        CoordinateSystem.LNGLAT_OFFSET,
      );
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }

    this.cameraChangedCallback(this.viewport);
  };
  private removeLogoControl(): void {
    // @ts-ignore
    const controls = this.map._controls as IControl[];
    const logoCtr = controls.find((ctr: IControl) => {
      if (ctr.hasOwnProperty('_updateLogo')) {
        return true;
      }
    });
    if (logoCtr) {
      this.map.removeControl(logoCtr);
    }
  }
}
