import type {
  Bounds,
  ILngLat,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapStyleConfig,
} from '@antv/l7-core';
import { BaseMapService, MapServiceEvent, WebMercatorViewport } from '@antv/l7-core';
import { Map, MercatorCoordinate } from '@antv/l7-map';
import { DOM } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
import { MapType } from '../types';
import type { ISimpleMapCoord } from './simple-coord';
import { SimpleMapCoord } from './simple-coord';

const MapEvent: Record<string, string> = {
  mapmove: 'move',
  camerachange: 'move',
  zoomchange: 'zoom',
  dragging: 'drag',
};

export default class MapService extends BaseMapService<Map> {
  protected viewport: IViewport;

  public type: string = MapType.MAP;

  public version: 'DEFAULT' | 'SIMPLE';

  public simpleMapCoord: ISimpleMapCoord = new SimpleMapCoord();

  public async init(): Promise<void> {
    const {
      id = 'map',
      style = 'light',
      rotation = 0,
      mapInstance,
      version = 'DEFAULT',
      mapSize = 10000,
      interactive = true,
      ...rest
    } = this.config;

    this.viewport = new WebMercatorViewport();
    this.version = version;
    this.simpleMapCoord.setSize(mapSize);
    if (version === 'SIMPLE' && rest.center) {
      rest.center = this.simpleMapCoord.unproject(rest.center as [number, number]);
    }
    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.mapContainer = this.map.getContainer();
    } else {
      this.mapContainer = this.creatMapContainer(id);
      this.map = new Map({
        container: this.mapContainer,
        style: this.getMapStyleValue(style),
        bearing: rotation,
        ...rest,
      });
    }

    this.map.on('load', () => {
      this.handleCameraChanged();
    });
    if (interactive) {
      // L7 作为第三方地图插件时关闭重绘
      this.map.on('move', this.handleCameraChanged);
    }

    setTimeout(() => {
      this.handleCameraChanged();
    }, 100);
    this.handleCameraChanged();
  }

  protected creatMapContainer(id: string | HTMLDivElement) {
    const wrapper = super.creatMapContainer(id);
    const mapContainer = document.createElement('div');
    mapContainer.style.cssText += `
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    `;
    wrapper.appendChild(mapContainer);
    return mapContainer;
  }

  protected handleCameraChanged = () => {
    const { lat, lng } = this.map.getCenter();
    const center: [number, number] = [lng, lat];
    const option = {
      center,
      viewportWidth: this.map.transform.width,
      viewportHeight: this.map.transform.height,
      bearing: this.map.getBearing(),
      pitch: this.map.getPitch(),
      zoom: this.map.getZoom(),
      // mapbox 中固定相机高度为 viewport 高度的 1.5 倍
      cameraHeight: 0,
    };

    this.updateView(option);
  };

  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getCanvasContainer() as HTMLElement;
  }

  public addMarkerContainer(): void {
    const container = this.map.getCanvasContainer();
    this.markerContainer = DOM.create('div', 'l7-marker-container', container);
    this.markerContainer.setAttribute('tabindex', '-1');
  }

  public getCanvasOverlays() {
    return this.getContainer();
  }

  // MapEvent，定义事件类型
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
    } else {
      // 统一事件名称
      this.map.on(MapEvent[type] || type, handle);
    }
  }

  public once(type: string, handle: (...args: any[]) => void) {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.once(type, handle);
    } else {
      // 统一事件名称
      this.map.once(MapEvent[type] || type, handle);
    }
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    this.map.off(MapEvent[type] || type, handle);
    this.eventEmitter.off(type, handle);
  }

  public getSize(): [number, number] {
    if (this.version === 'SIMPLE') {
      return this.simpleMapCoord.getSize();
    }
    const size = this.map.transform;

    return [size.width, size.height];
  }

  public getMinZoom(): number {
    return this.map.getMinZoom();
  }

  public getMaxZoom(): number {
    return this.map.getMaxZoom();
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

  public getMapStyleConfig(): MapStyleConfig {
    return {};
  }

  public getMapStyleValue(name: string) {
    return this.getMapStyleConfig()[name] || name;
  }

  public getMapStyle(): string {
    return '';
  }

  public setMapStyle(style: any): void {
    this.map.setStyle(this.getMapStyleValue(style));
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

  public panTo(p: [number, number]): void {
    this.map.panTo(p);
  }

  public panBy(x: number = 0, y: number = 0): void {
    // @ts-ignore
    this.map.panBy([x, y]);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: any): void {
    this.map.fitBounds(bound, fitBoundsOptions);
  }

  public setZoomAndCenter(zoom: number, center: [number, number]): void {
    this.map.flyTo({
      zoom,
      center,
    });
  }

  public setCenter(lnglat: [number, number]): void {
    this.map.setCenter(lnglat);
  }

  public setPitch(pitch: number) {
    return this.map.setPitch(pitch);
  }

  public setZoom(zoom: number) {
    return this.map.setZoom(zoom);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public meterToCoord(center: [number, number], outer: [number, number]) {
    return 1.0;
  }

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

  /**
   * 将经纬度转成墨卡托坐标
   */
  public lngLatToMercator(lnglat: [number, number], altitude: number): IMercator {
    const { x = 0, y = 0, z = 0 } = MercatorCoordinate.fromLngLat(lnglat, altitude);
    return { x, y, z };
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(lnglat, altitude);
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

    return modelMatrix as unknown as number[];
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.map.getCanvas();
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  public destroy(): void {
    super.destroy();
    if (this.map) {
      this.map.remove();
      this.mapContainer = null;
    }
  }
}
