/**
 * MapboxService
 */
import {
  Bounds,
  CoordinateSystem,
  ICoordinateSystemService,
  IEarthService,
  IGlobalConfigService,
  ILngLat,
  IMapConfig,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapServiceEvent,
  MapStyle,
  TYPES,
} from '@antv/l7-core';
import { EarthMap, Map } from '@antv/l7-map';
import { DOM } from '@antv/l7-utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
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
import { ISimpleMapCoord, SimpleMapCoord } from '../simpleMapCoord';
import { MapTheme } from './theme';

const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12;
/**
 * EarthService
 */
@injectable()
export default class L7EarthService implements IEarthService<Map> {
  public version: string = Version.GLOBEL;
  public map: Map;
  public simpleMapCoord: ISimpleMapCoord = new SimpleMapCoord();

  // TODO: 判断地图是否正在拖拽
  public dragging: boolean = false;

  // 背景色
  public bgColor: string = '#000';

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
  // T: 用于记录鼠标对相机的控制
  private handleCameraChanging: boolean;
  private handleCameraTimer: any;
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
  // TODO: 计算像素坐标
  public pixelToLngLat(pixel: [number, number]): ILngLat {
    return this.map.unproject(pixel);
  }

  public meterToCoord(center: [number, number], outer: [number, number]) {
    return 1.0;
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
      ...rest
    } = this.config;

    this.viewport = new Viewport();

    this.$mapContainer = this.creatAmapContainer(id);
    // @ts-ignore
    this.map = new EarthMap({
      container: this.$mapContainer,
      style: this.getMapStyle(style),
      bearing: rotation,
      ...rest,
    });

    this.map.on('load', this.handleCameraChanged);
    this.map.on('move', this.handleCameraChanged);

    // 不同于高德地图，需要手动触发首次渲染
    this.handleCameraChanged({});
  }

  public destroy() {
    // TODO: 销毁地图可视化层的容器
    this.$mapContainer?.parentNode?.removeChild(this.$mapContainer);

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

  /**
   * 地球模式向外暴露的 Y 轴旋转方法
   * @returns
   */
  public rotateY(option: { force: boolean; reg: number }) {
    const { force = false, reg = 0.01 } = option || {};
    // TODO: 让旋转方法与
    if (this.handleCameraChanging && !force) {
      return;
    }

    if (this.viewport) {
      this.viewport.rotateY(reg);

      this.viewport.syncWithMapCamera({
        viewportHeight: this.map.transform.height,
        viewportWidth: this.map.transform.width,
      });

      this.cameraChangedCallback(this.viewport);
    }
  }

  private handleCameraChanged = (e: any) => {
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    const DELAY_TIME = 2000;
    this.handleCameraChanging = true;
    if (this.handleCameraTimer) {
      clearTimeout(this.handleCameraTimer);
    }
    this.handleCameraTimer = setTimeout(() => {
      this.handleCameraChanging = false;
    }, DELAY_TIME);
    // 定义鼠标相机控制
    const rotateStep = 0.02;
    if (e.type && e.originalEvent) {
      if (e.originalEvent.type === 'wheel') {
        this.viewport.scaleZoom(
          0.01 * Math.sign(e.originalEvent.wheelDelta) * -1,
        );
      }

      if (
        Math.abs(e.originalEvent.movementX) >
        Math.abs(e.originalEvent.movementY)
      ) {
        if (e.originalEvent.movementX > 0) {
          this.viewport.rotateY(rotateStep);
        } else if (e.originalEvent.movementX < 0) {
          this.viewport.rotateY(-rotateStep);
        }
      } else {
        if (e.originalEvent.movementY > 0) {
          this.viewport.rotateX(rotateStep);
        } else if (e.originalEvent.movementY < 0) {
          this.viewport.rotateX(-rotateStep);
        }
      }
    }

    const { offsetCoordinate = true } = this.config;

    // resync
    this.viewport.syncWithMapCamera({
      viewportHeight: this.map.transform.height,
      viewportWidth: this.map.transform.width,
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
