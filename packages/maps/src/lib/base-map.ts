import type {
  Bounds,
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
  L7Container,
  MapStyleConfig,
  MapStyleName,
} from '@antv/l7-core';
import { CoordinateSystem } from '@antv/l7-core';
import { EventEmitter } from 'eventemitter3';
import type { ISimpleMapCoord } from '../utils/simpleMapCoord';
import { SimpleMapCoord } from '../utils/simpleMapCoord';

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

export default abstract class BaseMap<T> implements IMapService<T> {
  public version: string = 'DEFAUlTMAP';

  public map: T;

  public simpleMapCoord: ISimpleMapCoord = new SimpleMapCoord();

  // 背景色
  public bgColor: string = 'rgba(0.0, 0.0, 0.0, 0.0)';

  protected abstract viewport: IViewport;

  protected readonly config: Partial<IMapConfig>;

  protected readonly configService: IGlobalConfigService;

  protected readonly coordinateSystemService: ICoordinateSystemService;

  protected eventEmitter: any;

  protected markerContainer: HTMLElement;

  protected $mapContainer: HTMLElement | null;

  constructor(container: L7Container) {
    this.config = container.mapConfig;
    this.configService = container.globalConfigService;
    this.coordinateSystemService = container.coordinateSystemService;
    this.eventEmitter = new EventEmitter();
  }

  protected cameraChangedCallback?: (viewport: IViewport) => void;

  public abstract getType(): string;

  public setBgColor(color: string) {
    this.bgColor = color;
  }

  public abstract addMarkerContainer(): void;

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  public getOverlayContainer(): HTMLElement | undefined {
    return undefined;
  }

  public getCanvasOverlays(): HTMLElement | null | undefined {
    return undefined;
  }

  public abstract on(type: string, handle: (...args: any[]) => void): void;

  public abstract off(type: string, handle: (...args: any[]) => void): void;

  public abstract getContainer(): HTMLElement | null;

  public abstract getMapCanvasContainer(): HTMLElement;

  public abstract getSize(): [number, number];

  public abstract getZoom(): number;

  public abstract setZoom(zoom: number): void;

  public abstract getCenter(): ILngLat;

  public abstract setCenter(lnglat: [number, number]): void;

  public abstract getPitch(): number;

  public abstract getRotation(): number;

  public abstract getBounds(): Bounds;

  public abstract getMinZoom(): number;

  public abstract getMaxZoom(): number;

  public abstract setRotation(rotation: number): void;

  public abstract zoomIn(option?: any, eventData?: any): void;

  public abstract zoomOut(option?: any, eventData?: any): void;

  public abstract setPitch(pitch: number): void;

  public abstract panTo(p: [number, number]): void;

  public abstract panBy(x: number, y: number): void;

  public abstract fitBounds(bound: Bounds, fitBoundsOptions?: any): void;

  public abstract setMaxZoom(max: number): void;

  public abstract setMinZoom(min: number): void;

  public abstract setMapStatus(option: Partial<IStatusOptions>): void;

  public abstract setZoomAndCenter(zoom: number, center: [number, number]): void;

  public abstract setMapStyle(name: MapStyleName): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public meterToCoord(center: [number, number], outer: [number, number]) {
    return 1.0;
  }

  public abstract pixelToLngLat(pixel: [number, number]): ILngLat;

  public abstract lngLatToPixel(lnglat: [number, number]): IPoint;

  public abstract containerToLngLat(pixel: [number, number]): ILngLat;

  public abstract lngLatToContainer(lnglat: [number, number]): IPoint;

  public abstract lngLatToMercator(lnglat: [number, number], altitude: number): IMercator;

  public abstract getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[];

  public abstract getMapStyle(): string;

  public abstract getMapStyleConfig(): MapStyleConfig;

  public getMapStyleValue(name: MapStyleName): any {
    return this.getMapStyleConfig()[name] ?? name;
  }

  public abstract init(): Promise<void>;

  public destroy() {
    this.eventEmitter.removeAllListeners();
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

  public abstract exportMap(type: 'jpg' | 'png'): string;

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  protected abstract handleCameraChanged: () => void;

  protected creatMapContainer(id: string | HTMLDivElement) {
    let $wrapper: HTMLDivElement;

    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    } else {
      $wrapper = id;
    }

    return $wrapper;
  }

  public updateView(viewOption: Partial<IMapCamera>) {
    this.emit('mapchange');
    this.viewport.syncWithMapCamera({
      bearing: viewOption.bearing,
      center: viewOption.center,
      viewportHeight: viewOption.viewportHeight,
      pitch: viewOption.pitch,
      viewportWidth: viewOption.viewportWidth,
      zoom: viewOption.zoom,
    });
    this.updateCoordinateSystemService();
    this.cameraChangedCallback?.(this.viewport);
  }

  protected updateCoordinateSystemService() {
    const { offsetCoordinate = true } = this.config;
    // set coordinate system
    if (this.viewport.getZoom() > LNGLAT_OFFSET_ZOOM_THRESHOLD && offsetCoordinate) {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT_OFFSET);
    } else {
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.LNGLAT);
    }
  }
}
