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
  IMercator,
  IPoint,
  IViewport,
  MapServiceEvent,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { inject, injectable } from 'inversify';
import mapboxgl, { IControl, Map } from 'mapbox-gl';
import { IMapboxInstance } from '../../typings/index';
import { MapTheme } from './theme';
import Viewport from './Viewport';

const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'move',
  camerachange: 'move',
};

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

/**
 * AMapService
 */
@injectable()
export default class MapboxService
  implements IMapService<Map & IMapboxInstance> {
  public map: Map & IMapboxInstance;

  @inject(TYPES.MapConfig)
  private readonly config: Partial<IMapConfig>;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IEventEmitter)
  private eventEmitter: any;
  private viewport: Viewport;
  private markerContainer: HTMLElement;
  private cameraChangedCallback: (viewport: IViewport) => void;
  private $mapContainer: HTMLElement | null;

  // init
  public addMarkerContainer(): void {
    const container = this.map.getCanvasContainer();
    this.markerContainer = DOM.create('div', 'l7-marker-container', container);
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  //  map event
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      // 统一事件名称
      this.map.on(EventMap[type] || type, handle);
    }
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
    return 'mapbox';
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
    this.map.setStyle(this.getMapStyle(style));
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

  public lngLatToMercator(
    lnglat: [number, number],
    altitude: number,
  ): IMercator {
    const { x = 0, y = 0, z = 0 } = mapboxgl.MercatorCoordinate.fromLngLat(
      lnglat,
      altitude,
    );
    return { x, y, z };
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      lnglat,
      altitude,
    );
    // @ts-ignore
    const meters = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits();
    const modelMatrix = mat4.create();

    mat4.translate(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(
        modelAsMercatorCoordinate.x - origin.x,
        modelAsMercatorCoordinate.y - origin.y,
        modelAsMercatorCoordinate.z || 0 - origin.z,
      ),
    );

    mat4.scale(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(meters * scale[0], -meters * scale[1], meters * scale[2]),
    );

    mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
    mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);

    return (modelMatrix as unknown) as number[];
  }

  public async init(): Promise<void> {
    const {
      id = 'map',
      attributionControl = false,
      style = 'light',
      token = 'pk.eyJ1IjoieGlhb2l2ZXIiLCJhIjoiY2pxcmc5OGNkMDY3cjQzbG42cXk5NTl3YiJ9.hUC5Chlqzzh0FFd_aEc-uQ',
      rotation = 0,
      ...rest
    } = this.config;
    this.$mapContainer = document.getElementById(id);

    this.viewport = new Viewport();

    /**
     * TODO: 使用 mapbox v0.53.x 版本 custom layer，需要共享 gl context
     * @see https://github.com/mapbox/mapbox-gl-js/blob/master/debug/threejs.html#L61-L64
     */
    mapboxgl.accessToken = token;
    // @ts-ignore
    this.map = new mapboxgl.Map({
      container: id,
      style: this.getMapStyle(style),
      attributionControl,
      bearing: rotation,
      ...rest,
    });
    this.map.on('load', this.handleCameraChanged);
    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();
  }

  public destroy() {
    this.eventEmitter.removeAllListeners();
    if (this.map) {
      this.map.remove();
      this.$mapContainer = null;
      this.removeLogoControl();
    }
  }
  public emit(name: string, ...args: any[]) {
    this.eventEmitter.emit(name, ...args);
  }
  public once(name: string, ...args: any[]) {
    this.eventEmitter.once(name, ...args);
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

  private getMapStyle(name: string) {
    return MapTheme[name] ? MapTheme[name] : name;
  }
}
