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
import { CoordinateSystem, MapServiceEvent } from '@antv/l7-core';
import type { EventEmitterStatic } from 'eventemitter3';
import { EventEmitter } from 'eventemitter3';
import { SimpleMapCoord } from '../utils/simpleMapCoord';

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;

export default abstract class BaseMap<T> implements IMapService<T> {
  /**
   * 地图实例
   */
  public map: T;

  /**
   * @deprecated
   * TODO: 基类型不需要实现，只是自定义 Map 使用非地理坐标系才会用到
   */
  public simpleMapCoord = new SimpleMapCoord();

  /**
   * 背景色
   */
  public bgColor = 'rgba(0.0, 0.0, 0.0, 0.0)';

  protected abstract viewport: IViewport;

  protected readonly config: Partial<IMapConfig<T>>;

  protected readonly configService: IGlobalConfigService;

  protected readonly coordinateSystemService: ICoordinateSystemService;

  protected eventEmitter: InstanceType<EventEmitterStatic>;

  protected markerContainer: HTMLElement;

  protected mapContainer: HTMLElement | null;

  protected cameraChangedCallback?: (viewport: IViewport) => void;

  /**
   * 在地图实例初始化之前缓存的事件处理器，init 完成后自动重放绑定
   */
  protected pendingHandlers: Array<{ type: string; handler: (...args: any[]) => void }> = [];

  /**
   * 事件代理映射: 原生 eventName -> (原始 handler -> 代理 handler)
   * off 时以原生 eventName 为键精确解绑（修复 tmap/tdtmap 历史以 L7 type 为键
   * 导致 off 空操作的泄漏 bug，与 P1b 同类）
   */
  protected evtCbProxyMap: globalThis.Map<
    string,
    globalThis.Map<(...args: any[]) => void, (...args: any[]) => void>
  > = new globalThis.Map();

  constructor(container?: L7Container) {
    this.config = container?.mapConfig as Partial<IMapConfig<T>>;
    this.configService = container?.globalConfigService;
    this.coordinateSystemService = container?.coordinateSystemService;
    this.eventEmitter = new EventEmitter();
  }

  public abstract init(): Promise<void>;

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  protected abstract handleCameraChanged: () => void;

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

  protected creatMapContainer(id: string | HTMLDivElement) {
    let $wrapper: HTMLDivElement;

    if (typeof id === 'string') {
      $wrapper = document.getElementById(id) as HTMLDivElement;
    } else {
      $wrapper = id;
    }

    return $wrapper;
  }

  public abstract getMapStyle(): string;

  public abstract getMapStyleConfig(): MapStyleConfig;

  public getMapStyleValue(name: MapStyleName): any {
    return this.getMapStyleConfig()[name] ?? name;
  }

  public abstract getType(): string;

  public setBgColor(color: string) {
    this.bgColor = color;
  }

  public abstract getContainer(): HTMLElement | null;

  public getMapContainer() {
    return this.mapContainer;
  }

  public abstract getMapCanvasContainer(): HTMLElement;

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

  /**
   * L7 事件名 -> 原生事件名映射（单值或数组）。
   * 子类按需 override，返回本适配器特定的事件名映射表。
   */
  protected getEventMap(): Record<string, any> {
    return {};
  }

  /**
   * 构造代理 handler，默认对事件参数做 lngLat 归一化
   * （latlng || lngLat || lnglat -> lngLat）。
   * 子类可 override 以注入额外字段（如 tdtmap 注入 args[0].map）。
   */
  protected buildProxy(handle: (...args: any[]) => void): (...args: any[]) => void {
    return (...args: any[]) => {
      const e = args[0];
      if (e && typeof e === 'object' && !e.lngLat) {
        e.lngLat = e.latlng || e.lngLat || e.lnglat;
      }
      handle(...args);
    };
  }

  /**
   * 向原生 map 注册监听。默认 this.map.on(eventName, proxy)。
   * 子类可 override（如 tmap mouseover 走 container.addEventListener）。
   */
  protected registerNative(eventName: string, proxy: (...args: any[]) => void): void {
    (this.map as any).on(eventName, proxy);
  }

  /**
   * 从原生 map 注销监听。默认 this.map.off(eventName, proxy)。
   */
  protected unregisterNative(eventName: string, proxy: (...args: any[]) => void): void {
    (this.map as any).off(eventName, proxy);
  }

  /**
   * 绑定事件：MapServiceEvent 走 eventEmitter；原生事件经 EventMap 解析后注册代理。
   * map 未就绪时缓存到 pendingHandlers，init 后由 bindPendingEvents() 重放。
   */
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
      return;
    }
    if (!this.map) {
      this.pendingHandlers.push({ type, handler: handle });
      return;
    }
    const mapped = this.getEventMap()[type] || type;
    const nativeNames: string[] = Array.isArray(mapped) ? mapped : [mapped];
    for (const nativeName of nativeNames) {
      let mapForType = this.evtCbProxyMap.get(nativeName);
      if (!mapForType) {
        mapForType = new globalThis.Map();
        this.evtCbProxyMap.set(nativeName, mapForType);
      }
      if (!mapForType.has(handle)) {
        const proxy = this.buildProxy(handle);
        mapForType.set(handle, proxy);
        this.registerNative(nativeName, proxy);
      }
    }
  }

  /**
   * 解绑事件：以原生 eventName 为键精确移除代理（修复历史 off-key 泄漏）。
   */
  public off(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handle);
      return;
    }
    if (!this.map) {
      this.pendingHandlers = this.pendingHandlers.filter(
        (item) => !(item.type === type && item.handler === handle),
      );
      return;
    }
    const mapped = this.getEventMap()[type] || type;
    const nativeNames: string[] = Array.isArray(mapped) ? mapped : [mapped];
    for (const nativeName of nativeNames) {
      const mapForType = this.evtCbProxyMap.get(nativeName);
      if (mapForType) {
        const proxy = mapForType.get(handle);
        if (proxy) {
          this.unregisterNative(nativeName, proxy);
          mapForType.delete(handle);
        }
        if (mapForType.size === 0) {
          this.evtCbProxyMap.delete(nativeName);
        }
      }
    }
  }

  /**
   * 地图实例初始化完成后，重放缓存的事件绑定
   * 子类在 init() 末尾应调用此方法
   */
  protected bindPendingEvents(): void {
    if (this.pendingHandlers.length === 0) return;
    const handlers = this.pendingHandlers.slice();
    this.pendingHandlers = [];
    handlers.forEach(({ type, handler }) => {
      this.on(type, handler);
    });
  }

  public emit(name: string, ...args: any[]) {
    this.eventEmitter.emit(name, ...args);
  }

  public once(name: string, handler: (...args: any[]) => void) {
    this.eventEmitter.once(name, handler);
  }

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

  public abstract exportMap(type: 'jpg' | 'png'): string;

  public destroy() {
    this.eventEmitter.removeAllListeners();
  }
}
