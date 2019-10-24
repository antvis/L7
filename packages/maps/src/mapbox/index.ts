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
import { inject, injectable } from 'inversify';
import mapboxgl, { Map } from 'mapbox-gl';
import Viewport from './Viewport';

mapboxgl.accessToken =
  'pk.eyJ1IjoieGlhb2l2ZXIiLCJhIjoiY2pxcmc5OGNkMDY3cjQzbG42cXk5NTl3YiJ9.hUC5Chlqzzh0FFd_aEc-uQ';
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

let counter = 1;

/**
 * AMapService
 */
@injectable()
export default class MapboxService implements IMapService {
  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  private map: Map & IMapboxInstance;

  private $mapContainer: HTMLElement | null;
  private $link: HTMLLinkElement;

  private viewport: Viewport;

  private cameraChangedCallback: (viewport: IViewport) => void;

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
  public pixelToLngLat(pixel: [number, number]): ILngLat {
    return this.map.unproject(pixel);
  }
  public lngLatToPixel(lnglat: [number, number]): IPoint {
    return this.map.project(lnglat);
  }
  public containerToLngLat(pixel: [number, number]): ILngLat {
    throw new Error('Method not implemented.');
  }
  public lngLatToContainer(lnglat: [number, number]): IPoint {
    throw new Error('Method not implemented.');
  }

  public async init(mapConfig: IMapConfig): Promise<void> {
    const { id, ...rest } = mapConfig;

    this.$mapContainer = document.getElementById(id);
    this.$mapContainer!.classList.add(`${counter++}`);

    this.viewport = new Viewport();

    /**
     * TODO: 使用 mapbox v0.53.x 版本 custom layer，需要共享 gl context
     * @see https://github.com/mapbox/mapbox-gl-js/blob/master/debug/threejs.html#L61-L64
     */
    // @ts-ignore
    this.map = new mapboxgl.Map({
      container: id,
      ...rest,
    });

    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();

    this.$link = document.createElement('link');
    this.$link.href =
      'https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.1/mapbox-gl.css';
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
}
