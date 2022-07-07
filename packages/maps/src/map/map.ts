/**
 * MapboxService
 */
import {
  Bounds,
  CoordinateSystem,
  ICoordinateSystemService,
  IGlobalConfigService,
  ILngLat,
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
import { Map } from '@antv/l7-map';
import { $window, DOM } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ISimpleMapCoord, SimpleMapCoord } from '../simpleMapCoord';
import { Version } from '../version';
import Viewport from './Viewport';
const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};
import { MapTheme } from './theme';

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;
/**
 * AMapService
 */
@injectable()
export default class L7MapService implements IMapService<Map> {
  public version: string = Version.L7MAP;
  public map: Map;
  public simpleMapCoord: ISimpleMapCoord = new SimpleMapCoord();
  // 背景色
  public bgColor: string = 'rgba(0.0, 0.0, 0.0, 0.0)';

  @inject(TYPES.MapConfig)
  private readonly config: Partial<IMapConfig>;

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IEventEmitter)
  private eventEmitter: any;
  private viewport: Viewport;
  private markerContainer: HTMLElement;
  private cameraChangedCallback: (viewport: IViewport) => void;
  private $mapContainer: HTMLElement | null;
  public setBgColor(color: string) {
    this.bgColor = color;
  }

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
    this.eventEmitter.off(type, handle);
  }

  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getCanvasContainer() as HTMLElement;
  }

  public getSize(): [number, number] {
    if (this.version === Version.SIMPLE) {
      return this.simpleMapCoord.getSize();
    }
    const size = this.map.transform;
    return [size.width, size.height];
  }
  // get mapStatus method

  public getType() {
    return 'default';
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

  public panBy(x: number = 0, y: number = 0): void {
    this.panTo([x, y]);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: any): void {
    this.map.fitBounds(bound, fitBoundsOptions);
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
    if (option.dragEnable === true) {
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

  public meterToCoord(center: [number, number], outer: [number, number]) {
    return 1.0;
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
    throw new Error('not implement');
  }
  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    throw new Error('not implement');
  }

  public async init(): Promise<void> {
    const {
      id = 'map',
      attributionControl = false,
      style = 'light',
      rotation = 0,
      mapInstance,
      version = 'L7MAP',
      mapSize = 10000,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    this.version = version;
    this.simpleMapCoord.setSize(mapSize);
    // console.log('this.config.center', this.config.center)
    if (version === Version.SIMPLE && rest.center) {
      rest.center = this.simpleMapCoord.unproject(
        rest.center as [number, number],
      );
    }
    // console.log(this.simpleMapCoord.project(this.config.center as [number, number]))
    // console.log(this.simpleMapCoord.unproject([500, 500]))
    // console.log(this.simpleMapCoord.project([0, 0]))
    // console.log(this.simpleMapCoord.unproject([5000, 5000]))

    // console.log(this.simpleMapCoord.unproject([200, 200]))
    // console.log(this.simpleMapCoord.unproject([1000, 1000]))

    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
    } else {
      this.$mapContainer = this.creatAmapContainer(id);
      // @ts-ignore
      this.map = new Map({
        container: this.$mapContainer,
        style: this.getMapStyle(style),
        bearing: rotation,
        ...rest,
      });
    }

    this.map.on('load', this.handleCameraChanged);
    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged();
  }

  // 初始化小程序地图
  public async initMiniMap(): Promise<void> {
    const {
      id = 'map',
      attributionControl = false,
      style = 'light',
      rotation = 0,
      mapInstance,
      canvas = null,
      hasBaseMap = false,
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    this.$mapContainer = canvas;

    this.map = new Map({
      container: this.$mapContainer as HTMLElement,
      style: this.getMapStyle(style),
      bearing: rotation,
      // @ts-ignore
      canvas,
      ...rest,
    });

    if (!hasBaseMap) {
      // 没有地图底图的模式
      this.map.on('load', this.handleCameraChanged);
      this.map.on('move', this.handleCameraChanged);

      // 不同于高德地图，需要手动触发首次渲染
      this.handleCameraChanged();
    } else {
      // 存在地图底图的模式（ L7Mini ）
      const center = this.map.getCenter();
      // 不同于高德地图，需要手动触发首次渲染
      this.handleMiniCameraChanged(
        center.lng,
        center.lat,
        this.map.getZoom(),
        this.map.getBearing(),
        this.map.getPitch(),
      );
      $window.document.addEventListener('mapCameaParams', (event: any) => {
        const {
          e: { longitude, latitude, scale, bearing, pitch },
        } = event;
        this.handleMiniCameraChanged(
          longitude,
          latitude,
          scale - 1.25,
          bearing,
          pitch,
        );
      });
    }
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

  // TODO: 处理小程序中有底图模式下的相机跟新
  private handleMiniCameraChanged = (
    lng: number,
    lat: number,
    zoom: number,
    bearing: number,
    pitch: number,
  ) => {
    const { offsetCoordinate = true } = this.config;

    // resync
    this.viewport.syncWithMapCamera({
      // bearing: this.map.getBearing(),
      bearing,
      center: [lng, lat],
      viewportHeight: this.map.transform.height,
      // pitch: this.map.getPitch(),
      pitch,
      viewportWidth: this.map.transform.width,
      zoom,
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });
    // set coordinate system
    if (
      this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD &&
      offsetCoordinate
    ) {
      this.coordinateSystemService.setCoordinateSystem(
        CoordinateSystem.LNGLAT_OFFSET,
      );
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }

    this.cameraChangedCallback(this.viewport);
  };

  private handleCameraChanged = () => {
    const { lat, lng } = this.map.getCenter();
    const { offsetCoordinate = true } = this.config;
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
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
    if (
      this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD &&
      offsetCoordinate
    ) {
      this.coordinateSystemService.setCoordinateSystem(
        CoordinateSystem.LNGLAT_OFFSET,
      );
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }

    this.cameraChangedCallback(this.viewport);
  };

  private creatAmapContainer(id: string | HTMLDivElement) {
    let $wrapper = id as HTMLDivElement;
    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    }
    return $wrapper;
  }
  private getMapStyle(name: MapStyle) {
    if (typeof name !== 'string') {
      return name;
    }
    return MapTheme[name] ? MapTheme[name] : name;
  }
}
