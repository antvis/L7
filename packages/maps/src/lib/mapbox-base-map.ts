/**
 * MapboxBaseMap - Mapbox 家族（map / mapbox / maplibre / earth）适配器共享基类
 *
 * 将原先分散在 BaseMapService 中的 ~30 个 Mapbox API 具体实现集中到此中间基类，
 * 让四个 Mapbox 系适配器统一继承自 BaseMap -> MapboxBaseMap -> 具体适配器，
 * 取代各自直接 extends BaseMapService 的旧结构。
 *
 * 类型契约:
 *  `MapboxBaseMap<T> extends BaseMap<Map & T>` -> `implements IMapService<Map & T>`
 *  T 表示适配器在 Mapbox 通用 `Map` 之上的额外能力交集:
 *    - map / earth 传 `Map`                      (交集后仍为 Map)
 *    - mapbox / maplibre 传 `Map & IMapboxInstance`
 *
 * 子类仍需自行实现的抽象方法: init / lngLatToMercator / getModelMatrix
 * 可选 override:
 *    - handleCameraChanged (默认提供 Mapbox 相机同步实现, earth 覆盖)
 *    - getMapStyle / getType / getSize / addMarkerContainer / on / off / ...
 */
import type {
  Bounds,
  ILngLat,
  IMapService,
  IMercator,
  IPoint,
  IStatusOptions,
} from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { type Map } from '../mapbase';
import { MapTheme } from '../utils/theme';
import BaseMap from './base-map';

// L7 事件名 -> Mapbox 底层事件名映射
const EventMap: { [key: string]: any } = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};

export default abstract class MapboxBaseMap<T>
  extends BaseMap<Map & T>
  implements IMapService<Map & T>
{
  public version: string = 'DEFAULT';

  /**
   * Zoom 偏移量，用于对齐不同地图的显示层级
   * 子类可以覆盖此值以指定特定的偏移量
   * @default 0
   */
  protected zoomOffset: number = 0;

  // 事件代理映射: 原始 handler -> 代理 handler (用于 off 时精确解绑)
  protected evtCbProxyMap: globalThis.Map<
    string,
    globalThis.Map<(...args: any[]) => void, (...args: any[]) => void>
  > = new globalThis.Map();

  // ====== 子类必须实现的抽象方法 (沿用 BaseMap 的 abstract 声明) ======
  public abstract init(): Promise<void>;
  public abstract lngLatToMercator(lnglat: [number, number], altitude: number): IMercator;
  public abstract getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number],
    origin: IMercator,
  ): number[];

  // ====== marker 容器 ======
  public addMarkerContainer(): void {
    const container = this.map.getCanvasContainer();
    this.markerContainer = DOM.create('div', 'l7-marker-container', container);
    this.markerContainer.setAttribute('tabindex', '-1');
  }

  // ====== map 事件 (代理机制: 保留原 handler -> proxy 映射, 用于精确 off) ======
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
      return;
    }
    if (!this.map) {
      // 地图尚未初始化，缓存事件，init 完成后重放
      this.pendingHandlers.push({ type, handler: handle });
      return;
    }
    const mapped = EventMap[type] || type;
    let mapForType = this.evtCbProxyMap.get(mapped);
    if (!mapForType) {
      mapForType = new globalThis.Map();
      this.evtCbProxyMap.set(mapped, mapForType);
    }
    if (!mapForType.has(handle)) {
      const proxy = (...args: any[]) => {
        try {
          handle(...args);
        } catch (e) {
          // 吞掉 handler 异常, 避免破坏地图内部 emitter
          console.error('Error in map event handler', e);
        }
      };
      mapForType.set(handle, proxy);
      this.map.on(mapped, proxy);
    }
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handle);
      return;
    }
    if (!this.map) {
      // 地图尚未初始化，从缓存中移除
      this.pendingHandlers = this.pendingHandlers.filter(
        (item) => !(item.type === type && item.handler === handle),
      );
      return;
    }
    const mapped = EventMap[type] || type;
    const mapForType = this.evtCbProxyMap.get(mapped);
    if (mapForType) {
      const proxy = mapForType.get(handle);
      if (proxy) {
        this.map.off(mapped, proxy);
        mapForType.delete(handle);
      }
      if (mapForType.size === 0) {
        this.evtCbProxyMap.delete(mapped);
      }
    }
  }

  // ====== map 容器 / 尺寸 ======
  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getCanvasContainer() as HTMLElement;
  }

  public getSize(): [number, number] {
    if (this.version === 'SIMPLE') {
      return this.simpleMapCoord.getSize();
    }
    const size = this.map.transform;
    return [size.width, size.height];
  }

  public getType() {
    return 'default';
  }

  // ====== 相机 getters / setters ======
  public getZoom(): number {
    return this.map.getZoom() - this.zoomOffset;
  }

  public setZoom(zoom: number) {
    return this.map.setZoom(zoom + this.zoomOffset);
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
    this.map.panBy([x, y]);
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
    // @ts-ignore
    this.map?.setStyle(this.getMapStyleValue(style));
  }

  // ====== 坐标转换 ======
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

  // ====== 样式 ======
  public getMapStyle(): string {
    try {
      // @ts-ignore
      const styleUrl = this.map.getStyle().sprite ?? '';
      // 将 Mapbox 返回的样式字符串转成传入 style 保持一致
      if (/^mapbox:\/\/sprites\/zcxduo\/\w+\/\w+$/.test(styleUrl)) {
        return styleUrl?.replace(/\/\w+$/, '').replace(/sprites/, 'styles');
      }
      return styleUrl;
    } catch {
      return '';
    }
  }

  public getMapStyleConfig() {
    return MapTheme;
  }

  // ====== 截图导出 ======
  public exportMap(type: 'jpg' | 'png'): string {
    // @ts-ignore
    const renderCanvas = this.map?.getCanvas();
    const layersPng =
      type === 'jpg' ? renderCanvas?.toDataURL('image/jpeg') : renderCanvas?.toDataURL('image/png');
    return layersPng || '';
  }

  // ====== 相机同步回调 (默认 mapbox 实现, earth 覆盖) ======
  protected handleCameraChanged = (e?: any) => {
    const { lat, lng } = this.map.getCenter();
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // resync
    this.viewport.syncWithMapCamera({
      bearing: this.map.getBearing(),
      center: [lng, lat],
      viewportHeight: this.map.transform.height,
      pitch: this.map.getPitch(),
      viewportWidth: this.map.transform.width,
      zoom: this.map.getZoom() - this.zoomOffset,
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    });

    this.updateCoordinateSystemService();
    this.cameraChangedCallback?.(this.viewport);
  };

  public destroy() {
    super.destroy();
    if (this.map) {
      this.map.remove();
      this.mapContainer = null;
    }
  }
}
