/**
 * MapboxService
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
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapServiceEvent,
  MapStyle,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { inject, injectable } from 'inversify';
import mapboxgl, { IControl, Map } from 'mapbox-gl';

// tslint:disable-next-line:no-submodule-imports
import 'mapbox-gl/dist/mapbox-gl.css';
import { IMapboxInstance } from '../../typings/index';
import Viewport from './Viewport';
window.mapboxgl = mapboxgl;
const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};
import { MapTheme } from './theme';
let mapdivCount = 0;
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;
const MAPBOX_API_KEY =
  'pk.eyJ1IjoibHp4dWUiLCJhIjoiYnhfTURyRSJ9.Ugm314vAKPHBzcPmY1p4KQ';
/**
 * AMapService
 */
@injectable()
export default class MapboxService
  implements IMapService<Map & IMapboxInstance> {
  public map: Map & IMapboxInstance;

  @inject(TYPES.MapConfig)
  private readonly config: Partial<IMapConfig>;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;
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
    this.markerContainer.setAttribute('tabindex', '-1');
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

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getCanvasContainer() as HTMLElement;
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

  public zoomIn(option?: any, eventData?: any): void {
    this.map.zoomIn(option, eventData);
  }
  public zoomOut(option?: any, eventData?: any): void {
    this.map.zoomOut(option, eventData);
  }
  public setPitch(pitch: number) {
    return this.map.setPitch(pitch);
  }

  public panTo(p: [number, number]): void {
    this.map.panTo(p);
  }

  public panBy(pixel: [number, number]): void {
    this.panTo(pixel);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void {
    this.map.fitBounds(bound, fitBoundsOptions as mapboxgl.FitBoundsOptions);
  }

  public setMaxZoom(max: number): void {
    this.map.setMaxZoom(max);
  }

  public setMinZoom(min: number): void {
    this.map.setMinZoom(min);
  }
  public setMapStatus(option: Partial<IStatusOptions>): void {
    if (option.doubleClickZoom === true) {
      this.map.doubleClickZoom.enable();
    }
    if (option.doubleClickZoom === false) {
      this.map.doubleClickZoom.disable();
    }
    if (option.dragEnable === false) {
      this.map.dragPan.disable();
    }
    if (option.dragEnable === true) {
      this.map.dragPan.enable();
    }
    if (option.rotateEnable === false) {
      this.map.dragRotate.disable();
    }
    if (option.rotateEnable === true) {
      this.map.dragRotate.enable();
    }
    if (option.keyboardEnable === false) {
      this.map.keyboard.disable();
    }
    if (option.keyboardEnable === true) {
      this.map.keyboard.enable();
    }
    if (option.zoomEnable === false) {
      this.map.scrollZoom.disable();
    }
    if (option.zoomEnable === true) {
      this.map.scrollZoom.enable();
    }
  }

  public setZoomAndCenter(zoom: number, center: [number, number]): void {
    this.map.flyTo({
      zoom,
      center,
    });
  }

  public setMapStyle(style: any): void {
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
    const {
      x = 0,
      y = 0,
      z = 0,
    } = window.mapboxgl.MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
  }
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    const modelAsMercatorCoordinate = window.mapboxgl.MercatorCoordinate.fromLngLat(
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
      token = MAPBOX_API_KEY,
      rotation = 0,
      mapInstance,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    /**
     * TODO: 使用 mapbox v0.53.x 版本 custom layer，需要共享 gl context
     * @see https://github.com/mapbox/mapbox-gl-js/blob/master/debug/threejs.html#L61-L64
     */

    // 判断全局 mapboxgl 对象的加载
    if (!mapInstance && !window.mapboxgl) {
      // 用户有时传递进来的实例是继承于 mapbox 实例化的，不一定是 mapboxgl 对象。
      this.logger.error(this.configService.getSceneWarninfo('SDK'));
    }

    if (
      token === MAPBOX_API_KEY &&
      style !== 'blank' &&
      !window.mapboxgl.accessToken &&
      !mapInstance // 如果用户传递了 mapInstance，应该不去干预实例的 accessToken。
    ) {
      this.logger.warn(this.configService.getSceneWarninfo('MapToken'));
    }

    // 判断是否设置了 accessToken
    if (!mapInstance && !window.mapboxgl.accessToken) {
      // 用户有时传递进来的实例是继承于 mapbox 实例化的，不一定是 mapboxgl 对象。
      window.mapboxgl.accessToken = token;
    }

    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatAmapContainer(id);
      // @ts-ignore
      this.map = new window.mapboxgl.Map({
        container: this.$mapContainer,
        style: this.getMapStyle(style),
        attributionControl,
        bearing: rotation,
        ...rest,
      });
    }
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

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.map.getCanvas();
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
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

  // private creatAmapContainer(id: string | HTMLDivElement) {
  //   let $wrapper = id as HTMLDivElement;
  //   if (typeof id === 'string') {
  //     $wrapper = document.getElementById(id) as HTMLDivElement;
  //   }
  //   return $wrapper;
  // }
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
    $amapdiv.id = 'l7_mapbox_div' + mapdivCount++;
    $wrapper.appendChild($amapdiv);
    return $amapdiv;
  }
  private getMapStyle(name: MapStyle) {
    if (typeof name !== 'string') {
      return name;
    }
    return MapTheme[name] ? MapTheme[name] : name;
  }
}
