/**
 * MapboxService
 */
import {
  Bounds,
  CoordinateSystem,
  ICoordinateSystemService,
  IGlobalConfigService,
  ILngLat,
  IMapCamera,
  IMapConfig,
  IMapService,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapServiceEvent,
  MapStyleConfig,
  MapStyleName,
  TYPES,
} from '@antv/l7-core';
import { Map } from '@antv/l7-map';
import { DOM } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Version } from '../version';
import { ISimpleMapCoord, SimpleMapCoord } from './simpleMapCoord';
import { MapTheme } from './theme';
const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;
/**
 * AMapService
 */
@injectable()
export default abstract class BaseMapService<T>
  implements IMapService<Map & T>
{
  public version: string = Version.DEFUALT;
  public map: Map & T;
  public simpleMapCoord: ISimpleMapCoord = new SimpleMapCoord();
  // 背景色
  public bgColor: string = 'rgba(0.0, 0.0, 0.0, 0.0)';
  protected viewport: IViewport | unknown;

  @inject(TYPES.MapConfig)
  protected readonly config: Partial<IMapConfig>;

  @inject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  @inject(TYPES.ICoordinateSystemService)
  protected readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IEventEmitter)
  protected eventEmitter: any;

  protected markerContainer: HTMLElement;
  protected cameraChangedCallback: (viewport: IViewport) => void;
  protected $mapContainer: HTMLElement | null;
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
  public getOverlayContainer(): HTMLElement | undefined {
    return undefined;
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
    this.map.setStyle(this.getMapStyleValue(style));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  public abstract lngLatToMercator(
    lnglat: [number, number],
    altitude: number,
  ): IMercator;

  public abstract getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[];

  public getMapStyle(): string {
    try {
      // @ts-ignore
      const styleUrl = this.map.getStyle().sprite ?? '';
      // 将 Mapbox 返回的样式字符串转成传入 style 保持一致
      if (/^mapbox:\/\/sprites\/zcxduo\/\w+\/\w+$/.test(styleUrl)) {
        return styleUrl?.replace(/\/\w+$/, '').replace(/sprites/, 'styles');
      }
      return styleUrl;
    } catch (e) {
      return '';
    }
  }

  public getMapStyleConfig(): MapStyleConfig {
    return MapTheme;
  }

  public getMapStyleValue(name: MapStyleName): any {
    return this.getMapStyleConfig()[name] ?? name;
  }

  public abstract init(): Promise<void>;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleCameraChanged = (e?: any) => {
    const { lat, lng } = this.map.getCenter();
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // resync
    (this.viewport as IViewport).syncWithMapCamera({
      bearing: this.map.getBearing(),
      center: [lng, lat],
      viewportHeight: this.map.transform.height,
      pitch: this.map.getPitch(),
      viewportWidth: this.map.transform.width,
      zoom: this.map.getZoom(),
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });

    this.updateCoordinateSystemService();
    this.cameraChangedCallback(this.viewport as IViewport);
  };

  protected creatMapContainer(id: string | HTMLDivElement) {
    let $wrapper = id as HTMLDivElement;
    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    }
    return $wrapper;
  }
  public updateView(viewOption: Partial<IMapCamera>) {
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // resync
    (this.viewport as IViewport).syncWithMapCamera({
      bearing: viewOption.bearing,
      center: viewOption.center,
      viewportHeight: viewOption.viewportHeight,
      pitch: viewOption.pitch,
      viewportWidth: viewOption.viewportWidth,
      zoom: viewOption.zoom,
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });
    this.updateCoordinateSystemService();
    this.cameraChangedCallback(this.viewport as IViewport);
  }

  protected updateCoordinateSystemService() {
    const { offsetCoordinate = true } = this.config;
    // set coordinate system
    if (
      (this.viewport as IViewport).getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD &&
      offsetCoordinate
    ) {
      this.coordinateSystemService.setCoordinateSystem(
        CoordinateSystem.LNGLAT_OFFSET,
      );
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }
  }
}
