import type {
  Bounds,
  ILngLat,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  Point,
} from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
import Viewport from '../lib/web-mercator-viewport';
import { MercatorCoordinate } from '../mapbase';
import BaseMapService from '../utils/BaseMapService';
import './logo.css';
import GMapLoader from './maploader';

const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'center_changed',
  camerachange: ['drag', 'pan', 'rotate', 'tilt', 'zoom_changed'],
  zoomchange: 'zoom_changed',
  dragging: 'drag',
};

export default class GMapService extends BaseMapService<any> {
  // @ts-ignore
  protected viewport: IViewport = null;

  // Google Map 和 L7 内置 Map 均使用 Web Mercator，zoom level 定义一致，无需偏移
  protected zoomOffset: number = 0;

  protected evtCbProxyMap: Map<string, Map<(...args: any) => any, (...args: any) => any>> =
    new Map();

  // 存储 Google Maps 事件监听器引用，用于移除
  private gmapListeners: Map<string, Map<(...args: any) => any, google.maps.MapsEventListener>> =
    new Map();
  // OverlayView 用于获取 MapCanvasProjection（支持 fractional zoom 计算）
  private overlayView: google.maps.OverlayView | null = null;

  /** 获取 OverlayView 的 MapCanvasProjection，仅在 onAdd 之后可用 */
  private getOverlayProjection(): google.maps.MapCanvasProjection | null {
    return this.overlayView?.getProjection() ?? null;
  }

  public handleCameraChanged = () => {
    this.syncCamera();
  };

  private syncCamera() {
    this.emit('mapchange');
    const map = this.map;
    if (!map) {
      return;
    }

    const { width, height } = this.getMapSize();
    let zoom = map.getZoom() - 1;
    let longitude: number;
    let latitude: number;
    const bearing = map.getHeading() || 0;

    // 通过 OverlayView projection 计算真实视口中心和 fractional zoom（参考 deck.gl）
    const projection = this.getOverlayProjection();
    if (projection) {
      // 用 OverlayView projection 获取当前视口中心像素对应的经纬度
      // 这在缩放动画期间比 map.getCenter() 更准确
      const centerLatLng = projection.fromContainerPixelToLatLng(
        new google.maps.Point(width / 2, height / 2),
      );
      if (centerLatLng) {
        longitude = centerLatLng.lng();
        latitude = centerLatLng.lat();
      } else {
        const center = map.getCenter();
        if (!center) return;
        longitude = center.lng();
        latitude = center.lat();
      }

      // 计算 fractional zoom
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const topRight = projection.fromLatLngToDivPixel(ne);
        const bottomLeft = projection.fromLatLngToDivPixel(sw);
        if (topRight && bottomLeft) {
          let scale: number | undefined;
          if (bearing === 0) {
            scale = height ? (bottomLeft.y - topRight.y) / height : 1;
          } else {
            const viewDiag = Math.sqrt(
              Math.pow(topRight.x - bottomLeft.x, 2) + Math.pow(topRight.y - bottomLeft.y, 2),
            );
            const mapDiag = Math.sqrt(width * width + height * height);
            scale = mapDiag ? viewDiag / mapDiag : 1;
          }
          zoom += Math.log2(scale || 1);
        }
      }
    } else {
      const center = map.getCenter();
      if (!center) return;
      longitude = center.lng();
      latitude = center.lat();
    }

    const option = {
      center: [longitude!, latitude!],
      viewportHeight: height,
      viewportWidth: width,
      bearing,
      pitch: map.getTilt() || 0,
      zoom,
    };
    if (this.viewport) {
      this.viewport.syncWithMapCamera(option as any);
      this.updateCoordinateSystemService();
      this.cameraChangedCallback(this.viewport);
    }
  }

  private getMapSize(): { width: number; height: number } {
    const container = this.map.getDiv().firstChild as HTMLElement | null;
    return {
      width: container?.offsetWidth ?? this.map.getDiv().clientWidth,
      height: container?.offsetHeight ?? this.map.getDiv().clientHeight,
    };
  }

  public async init(): Promise<void> {
    this.viewport = new Viewport();

    const {
      id,
      mapInstance,
      center = [121.30654632240122, 31.25744185633306],
      token,
      zoom = 15,
      minZoom = 3,
      maxZoom = 18,
      logoVisible = true,
      // 过滤掉 L7 特有的参数，不透传给 Google Maps
      style: _style,
      rotation: _rotation,
      pitch: _pitch,
      WebGLParams: _webglParams,
      ...rest
    } = this.config;

    if (!(window.google?.maps?.Map || mapInstance)) {
      if (!token) {
        console.warn(
          `%c${this.configService.getSceneWarninfo('MapToken')}!`,
          'color: #873bf4;font-weigh:900;font-size: 16px;',
        );
      }
      await GMapLoader.load({
        key: token || '',
      });
    }

    if (mapInstance) {
      this.map = mapInstance as any;
      this.$mapContainer = this.map.getDiv();
      if (logoVisible === false) {
        this.hideLogo();
      }
    } else {
      if (!id) {
        throw Error('No container id specified');
      }
      const mapContainer = DOM.getContainer(id)!;

      const map = new google.maps.Map(mapContainer, {
        zoom,
        maxZoom,
        minZoom,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        center: new google.maps.LatLng(center[1], center[0]),
        ...rest,
      });

      this.map = map;
      this.$mapContainer = map.getDiv();
      if (logoVisible === false) {
        this.hideLogo();
      }
    }

    // 创建 OverlayView —— 核心同步机制（参考 deck.gl）
    // draw() 在 Google Map 每次重绘时调用（包括缩放/平移动画的每一帧）
    const overlayView = new google.maps.OverlayView();
    overlayView.onAdd = () => {};
    overlayView.onRemove = () => {};
    overlayView.draw = () => {
      this.handleCameraChanged();
    };
    overlayView.setMap(this.map);
    this.overlayView = overlayView;

    // idle 兜底：动画结束后确保最终状态同步
    google.maps.event.addListener(this.map, 'idle', this.handleCameraChanged);

    this.handleCameraChanged();
    this.bindPendingEvents();
  }

  public destroy(): void {
    if (this.styleObserver) {
      this.styleObserver.disconnect();
      this.styleObserver = null;
    }

    if (this.overlayView) {
      this.overlayView.setMap(null);
      this.overlayView = null;
    }

    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
    }

    if (this.markerContainer && this.markerContainer.parentNode) {
      this.markerContainer.parentNode.removeChild(this.markerContainer);
    }
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  private styleObserver: MutationObserver | null = null;

  public addMarkerContainer(): void {
    const container = this.$mapContainer!;
    this.markerContainer = DOM.create('div', 'l7-marker-container', container);
    this.markerContainer.setAttribute('tabindex', '-1');
    this.markerContainer.style.zIndex = '2';
    this.markerContainer.style.pointerEvents = 'none';
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  public getCanvasOverlays(): HTMLElement {
    return this.$mapContainer as HTMLElement;
  }

  public getMapContainer(): HTMLElement {
    // 首次调用时设置 MutationObserver，
    // 防止 Hammer.js 在此元素上设置 touch-action: none 阻止 Google Map 原生手势
    if (!this.styleObserver && this.$mapContainer) {
      this.styleObserver = new MutationObserver(() => {
        if (this.$mapContainer!.style.touchAction === 'none') {
          this.$mapContainer!.style.touchAction = 'auto';
        }
        if (this.$mapContainer!.style.userSelect === 'none') {
          this.$mapContainer!.style.userSelect = '';
        }
      });
      this.styleObserver.observe(this.$mapContainer, {
        attributes: true,
        attributeFilter: ['style'],
      });
    }
    return this.$mapContainer as HTMLElement;
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.$mapContainer as HTMLElement;
  }

  // MapEvent — Google Maps 使用 google.maps.event.addListener/removeListener
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      if (!this.map) {
        this.pendingHandlers.push({ type, handler: handle });
        return;
      }

      const bindEvent = (eventName: string) => {
        let listenerMap = this.gmapListeners.get(eventName);
        if (!listenerMap) {
          this.gmapListeners.set(eventName, (listenerMap = new Map()));
        }
        if (listenerMap.has(handle)) {
          return;
        }

        const handleProxy = (...args: any[]) => {
          if (args[0] && typeof args[0] === 'object' && !args[0].lngLat && !args[0].lnglat) {
            args[0].lngLat = args[0].latlng || args[0].latLng;
          }
          handle(...args);
        };

        const listener = google.maps.event.addListener(this.map, eventName, handleProxy);
        listenerMap.set(handle, listener);
      };

      if (Array.isArray(EventMap[type])) {
        EventMap[type].forEach((eventName: string) => {
          bindEvent(eventName || type);
        });
      } else {
        bindEvent(EventMap[type] || type);
      }
    }
  }

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

    const unbindEvent = (eventName: string) => {
      const listenerMap = this.gmapListeners.get(eventName);
      if (!listenerMap) {
        return;
      }
      const listener = listenerMap.get(handle);
      if (listener) {
        google.maps.event.removeListener(listener);
        listenerMap.delete(handle);
      }
    };

    if (Array.isArray(EventMap[type])) {
      EventMap[type].forEach((eventName: string) => {
        unbindEvent(eventName || type);
      });
    } else {
      unbindEvent(EventMap[type] || type);
    }
  }

  public once(type: string, handle: (...args: any[]) => void): void {
    const onceHandler = (...args: any[]) => {
      handle(...args);
      this.off(type, onceHandler);
    };
    this.on(type, onceHandler);
  }

  // get dom
  public getContainer(): HTMLElement | null {
    return this.map.getDiv();
  }

  public getSize(): [number, number] {
    const container = this.map.getDiv();
    return [container.clientWidth, container.clientHeight];
  }

  // get map status method
  public getMinZoom(): number {
    return this.config.minZoom ?? 3;
  }

  public getMaxZoom(): number {
    return this.config.maxZoom ?? 18;
  }

  // get map params
  public getType() {
    return 'googlemap';
  }

  public getZoom(): number {
    return this.map.getZoom();
  }
  public getCenter(): ILngLat {
    const { lng, lat } = this.map.getCenter();
    return {
      lng: lng(),
      lat: lat(),
    };
  }
  public getPitch(): number {
    return this.map.getTilt();
  }

  public getRotation(): number {
    const rotation = this.map.getHeading();
    return rotation;
  }

  public getBounds(): Bounds {
    const bounds = this.map.getBounds();
    const ne = bounds?.getNorthEast();
    const sw = bounds?.getSouthWest();
    return [
      [sw.lng(), sw.lat()],
      [ne.lng(), ne.lat()],
    ];
  }

  public setBgColor(color: string): void {
    this.bgColor = color;
  }

  public setMapStyle(style: any): void {
    // Google Maps 使用 setOptions 设置地图样式
    if (typeof style === 'string') {
      // 如果是字符串，可能是 MapType ID
      this.map.setMapTypeId(style);
    } else if (Array.isArray(style)) {
      // 如果是数组，则是自定义样式配置
      this.map.setOptions({ styles: style });
    }
  }

  // control with raw map
  public setRotation(rotation: number): void {
    this.map.setHeading(rotation);
  }

  public zoomIn(): void {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom + 1);
  }

  public zoomOut(): void {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom - 1);
  }

  public panTo([lng, lat]: Point): void {
    this.map.panTo({ lat, lng });
  }

  public panBy(x: number, y: number): void {
    this.map.panBy(x, y);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void {
    const [sw, ne] = bound;

    const bounds = new google.maps.LatLngBounds(
      { lat: sw[1], lng: sw[0] },
      { lat: ne[1], lng: ne[0] },
    );
    this.map.fitBounds(bounds, fitBoundsOptions);
  }

  public setZoomAndCenter(zoom: number, [lng, lat]: Point): void {
    this.map.setZoom(zoom);
    this.map.setCenter({ lat: lat, lng: lng });
  }

  public setCenter([lng, lat]: [number, number]): void {
    this.map.setCenter({ lat: lat, lng: lng });
  }

  public setPitch(pitch: number): any {
    this.map.setTilt(pitch);
  }

  public setZoom(zoom: number): any {
    this.map.setZoom(zoom);
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    (Object.keys(option) as Array<keyof IStatusOptions>).map((status) => {
      switch (status as keyof IStatusOptions) {
        case 'doubleClickZoom':
          this.map.setOptions({ disableDoubleClickZoom: !option.doubleClickZoom });
          break;
        case 'dragEnable':
          this.map.setOptions({
            gestureHandling: option.dragEnable ? 'greedy' : 'none',
          });
          break;
        case 'rotateEnable':
          // Google Map 默认支持旋转，无需额外设置
          break;
        case 'zoomEnable':
          this.map.setOptions({
            scrollwheel: option.zoomEnable,
            zoomControl: option.zoomEnable,
          });
          break;
        case 'keyboardEnable':
          this.map.setOptions({ keyboardShortcuts: option.keyboardEnable });
          break;
        case 'resizeEnable':
        case 'showIndoorMap':
          // Google Map 不支持这些选项
          break;
        default:
      }
    });
  }

  // coordinates methods
  public meterToCoord(
    [centerLon, centerLat]: [number, number],
    [outerLon, outerLat]: [number, number],
  ) {
    // @ts-ignore
    // https://developers.google.com/maps/documentation/javascript/reference/geometry?hl=zh-cn#spherical.computeDistanceBetween
    const metreDistance = google.maps.geometry.spherical.computeDistanceBetween([
      new google.maps.LatLng(centerLat, centerLon),

      new google.maps.LatLng(outerLat, outerLon),
    ]);

    const [x1, y1] = this.lngLatToCoord!([centerLon, centerLat]);
    const [x2, y2] = this.lngLatToCoord!([outerLon, outerLat]);
    const coordDistance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDistance / metreDistance;
  }

  public pixelToLngLat([x, y]: Point): ILngLat {
    const projection = this.map.getProjection();
    if (!projection) {
      return { lng: 0, lat: 0 };
    }
    const point = new google.maps.Point(x, y);
    const latLng = projection.fromPointToLatLng(point);
    if (!latLng) {
      return { lng: 0, lat: 0 };
    }
    return { lng: latLng.lng(), lat: latLng.lat() };
  }

  public lngLatToPixel([lng, lat]: Point): IPoint {
    const latLng = new google.maps.LatLng(lat, lng);
    const point = this.map.getProjection().fromLatLngToPoint(latLng);
    return { x: point.x, y: point.y };
  }

  public containerToLngLat([x, y]: [number, number]): ILngLat {
    // 优先使用 OverlayView 的 MapCanvasProjection（精确，动画期间也正确）
    const overlayProjection = this.getOverlayProjection();
    if (overlayProjection) {
      const point = new google.maps.Point(x, y);
      const latLng = overlayProjection.fromContainerPixelToLatLng(point);
      if (latLng) {
        return { lng: latLng.lng(), lat: latLng.lat() };
      }
    }
    // fallback: 使用 map.getProjection() + bounds 手动计算
    const projection = this.map.getProjection();
    if (!projection) {
      return { lng: 0, lat: 0 };
    }
    const bounds = this.map.getBounds();
    if (!bounds) {
      return { lng: 0, lat: 0 };
    }
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const topRight = projection.fromLatLngToPoint(ne);
    const bottomLeft = projection.fromLatLngToPoint(sw);
    const { width, height } = this.getMapSize();
    let worldWidth = topRight.x - bottomLeft.x;
    if (worldWidth <= 0) worldWidth += 256;
    const worldX = bottomLeft.x + (x / width) * worldWidth;
    const worldY = topRight.y + (y / height) * (bottomLeft.y - topRight.y);
    const latLng = projection.fromPointToLatLng(new google.maps.Point(worldX, worldY));
    return { lng: latLng.lng(), lat: latLng.lat() };
  }

  public lngLatToContainer([lng, lat]: [number, number]): IPoint {
    // 优先使用 OverlayView 的 MapCanvasProjection
    const overlayProjection = this.getOverlayProjection();
    if (overlayProjection) {
      const latLng = new google.maps.LatLng(lat, lng);
      const pixel = overlayProjection.fromLatLngToContainerPixel(latLng);
      if (pixel) {
        return { x: pixel.x, y: pixel.y };
      }
    }
    // fallback
    const projection = this.map.getProjection();
    if (!projection) {
      return { x: 0, y: 0 };
    }
    const latLngObj = new google.maps.LatLng(lat, lng);
    const worldPoint = projection.fromLatLngToPoint(latLngObj);
    const bounds = this.map.getBounds();
    if (!bounds) {
      return { x: 0, y: 0 };
    }
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const topRight = projection.fromLatLngToPoint(ne);
    const bottomLeft = projection.fromLatLngToPoint(sw);
    if (!worldPoint || !topRight || !bottomLeft) {
      return { x: 0, y: 0 };
    }
    const { width, height } = this.getMapSize();
    let worldWidth = topRight.x - bottomLeft.x;
    if (worldWidth <= 0) worldWidth += 256;
    const x = ((worldPoint.x - bottomLeft.x) / worldWidth) * width;
    const y = ((worldPoint.y - topRight.y) / (bottomLeft.y - topRight.y)) * height;
    return { x, y };
  }

  public lngLatToCoord?([lng, lat]: [number, number]): [number, number] {
    const { x, y } = this.lngLatToPixel([lng, lat]);
    return [x, -y];
  }

  public lngLatToCoords?(list: number[][] | number[][][]): any {
    return list.map((item) =>
      Array.isArray(item[0])
        ? this.lngLatToCoords!(item as Array<[number, number]>)
        : this.lngLatToCoord!(item as [number, number]),
    );
  }

  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    // Use built in mercator tools due to Tencent not provided related methods
    const { x = 0, y = 0, z = 0 } = MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
  ): number[] {
    const flat = this.viewport.projectFlat(lnglat);

    const modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(flat[0], flat[1], altitude));
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(scale[0], scale[1], scale[2]));

    mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
    mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);

    return modelMatrix as unknown as number[];
  }

  public getCustomCoordCenter?(): [number, number] {
    const { lng, lat } = this.getCenter();
    return [lng, lat];
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.getMapCanvasContainer() as HTMLCanvasElement;
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  // Method on earth mode — Google Map 不支持地球模式
  public rotateY?(): void {
    // noop: Google Map does not support earth mode rotation
  }

  private hideLogo() {
    const container = this.map.getDiv();
    if (!container) {
      return;
    }
    DOM.addClass(container, 'gmap-container--hide-logo');
  }
}
