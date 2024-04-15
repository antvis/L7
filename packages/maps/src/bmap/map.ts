import type {
  Bounds,
  ICameraOptions,
  ILngLat,
  IMapConfig,
  IMercator,
  IPoint,
  IStatusOptions,
  IViewport,
  MapStyleConfig,
  Point,
} from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
import Viewport from '../lib/web-mercator-viewport';
import BaseMapService from '../utils/BaseMapService';
import { toPaddingOptions } from '../utils/utils';
import BMapGLLoader from './bmapglloader';
import './logo.css';

const EventMap: {
  [key: string]: any;
} = {
  mapmove: 'moving',
  contextmenu: 'rightclick',
  camerachange: 'update',
  zoomchange: 'zoomend',
};

const BMAP_API_KEY: string = 'zLhopYPPERGtpGOgimcdKcCimGRyyIsh';
const BMAP_VERSION: string = '1.0';

// TODO: 基于抽象类 BaseMap 实现，补全缺失方法，解决类型问题
export default class BMapService extends BaseMapService<BMapGL.Map> {
  protected viewport: IViewport;
  protected styleConfig: Record<string, any> = {
    normal: [],
  };
  protected currentStyle: any = 'normal';
  // 事件回调代理
  protected evtCbProxyMap: Map<string, Map<(...args: any) => any, (...args: any) => any>> =
    new Map();

  public getMap() {
    return this.map as any as BMapGL.Map & {
      destroy: () => void;
      getTilt: () => number;
      enableRotate: () => void;
      enableRotateGestures: () => void;
      disableRotate: () => void;
      disableRotateGestures: () => void;
      lnglatToMercator: (lng: number, lat: number) => [number, number];
      _webglPainter: {
        _canvas: HTMLCanvasElement;
      };
      getHeading: () => number;
      setDisplayOptions: (options: { indoor?: boolean }) => void;
    };
  }

  public handleCameraChanged = () => {
    this.emit('mapchange');
    const map = this.getMap();
    const { lng, lat } = map.getCenter();
    const option = {
      center: [lng, lat],
      viewportHeight: map.getContainer().clientHeight,
      viewportWidth: map.getContainer().clientWidth,
      bearing: 360 - map.getHeading(),
      pitch: map.getTilt(),
      zoom: map.getZoom() - 1.75,
    };
    this.viewport.syncWithMapCamera(option as any);
    this.updateCoordinateSystemService();
    this.cameraChangedCallback(this.viewport);
  };

  public setBgColor(color: string): void {
    this.bgColor = color;
  }

  public async init() {
    this.viewport = new Viewport();
    const {
      id,
      center = [121.30654632240122, 31.25744185633306],
      zoom = 12,
      token = BMAP_API_KEY,
      mapInstance,
      version = BMAP_VERSION,
      mapSize = 10000,
      minZoom = 0,
      maxZoom = 21,
      ...rest
    } = this.config;
    this.viewport = new Viewport();
    this.version = version;
    this.simpleMapCoord.setSize(mapSize);

    if (!(window.BMapGL || mapInstance)) {
      await BMapGLLoader.load({
        key: token, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: BMAP_VERSION, // 指定要加载的 JSAPI 的gl版本，缺省时默认为 1.0
      });
    }

    if (mapInstance) {
      // @ts-ignore
      this.map = mapInstance;
      this.$mapContainer = this.map.getContainer();
      const point = new BMapGL.Point(center[0], center[1]);
      // false，表示用户未执行centerAndZoom进行地图初始渲染
      // @ts-ignore
      if (!this.map.isLoaded()) {
        this.map.centerAndZoom(point, zoom);
      }
      this.initMapByConfig(this.config);
      this.map.on('update', this.handleCameraChanged);
    } else {
      const mapConstructorOptions = {
        enableWheelZoom: true,
        minZoom,
        maxZoom,
        ...rest,
      };

      if (token === BMAP_API_KEY) {
        console.warn(
          `%c${this.configService.getSceneWarninfo('MapToken')}!`,
          'color: #873bf4;font-weigh:900;font-size: 16px;',
        );
      }

      if (!id) {
        throw Error('No container id specified');
      }

      const mapContainer = DOM.getContainer(id);

      // 存储控件等容器，百度地图实例会被卸载掉，所以实例化后需要重新挂载
      // @ts-ignore
      let mapChildNodes = [...mapContainer.childNodes];
      // @ts-ignore
      const map = new BMapGL.Map(mapContainer, mapConstructorOptions);
      this.$mapContainer = map.getContainer();

      mapChildNodes.forEach((child) => {
        this.$mapContainer!.appendChild(child);
      });
      // @ts-ignore
      mapChildNodes = null;

      // @ts-ignore
      this.map = map;
      const point = new BMapGL.Point(center[0], center[1]);
      this.map.centerAndZoom(point, zoom);
      this.initMapByConfig(this.config);
      // 监听地图相机事件
      // @ts-ignore
      map.on('update', this.handleCameraChanged);
    }
  }

  public destroy(): void {
    this.getMap().destroy();
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  // tslint:disable-next-line:no-empty
  public addMarkerContainer(): void {}

  public getMarkerContainer(): HTMLElement {
    return this.map.getPanes().markerPane!;
  }

  public getCanvasOverlays() {
    return this.getMap().getContainer().querySelector('#platform')?.lastChild as HTMLElement;
  }

  // MapEvent // 定义事件类型
  public on(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handle);
      return;
    }

    let cbProxyMap = this.evtCbProxyMap.get(type);
    if (!cbProxyMap) {
      this.evtCbProxyMap.set(type, (cbProxyMap = new Map()));
    }

    // 忽略重复监听回调
    if (cbProxyMap.get(handle)) {
      return;
    }

    // 对事件对象的经纬度进行统一处理l7需要的
    const handleProxy = (...args: any[]) => {
      if (args[0] && typeof args[0] === 'object' && !args[0].lngLat && !args[0].lnglat) {
        args[0].lngLat = args[0].latlng || args[0].latLng;
      }
      handle(...args);
    };

    cbProxyMap.set(handle, handleProxy);
    this.map.on(EventMap[type] || type, handleProxy);
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handle);
      return;
    }

    const handleProxy = this.evtCbProxyMap.get(type)?.get(handle);
    if (!handleProxy) {
      return;
    }
    this.evtCbProxyMap.get(type)?.delete(handle);
    this.map.off(EventMap[type] || type, handleProxy);
  }

  public once(type: string, handler: (...args: any[]) => void): void {
    this.eventEmitter.once(type, handler);
  }

  public getContainer(): HTMLElement | null {
    return this.getMap().getContainer();
  }

  public getSize(): [number, number] {
    const size = this.getMap().getSize();
    return [size.width, size.height];
  }
  // 百度地图缩放等级
  public getMinZoom(): number {
    return this.map.getMinZoom();
  }
  public getMaxZoom(): number {
    return this.map.getMaxZoom();
  }

  // get map params
  public getType() {
    return 'bmap';
  }

  public getZoom(): number {
    return this.getMap().getZoom();
  }

  public getCenter(options?: ICameraOptions): ILngLat {
    if (options?.padding) {
      const originCenter = this.getCenter();
      const padding = toPaddingOptions(options.padding);
      const px = this.lngLatToPixel([originCenter.lng, originCenter.lat]);
      const offsetPx = [(padding.right - padding.left) / 2, (padding.bottom - padding.top) / 2];

      const newCenter = this.pixelToLngLat([px.x - offsetPx[0], px.y - offsetPx[1]]);
      return newCenter;
    }
    const center = this.map.getCenter();
    return {
      lng: center.lng,
      lat: center.lat,
    };
  }

  public getPitch(): number {
    return this.getMap().getTilt();
  }

  public getRotation(): number {
    return 360 - this.getMap().getHeading();
  }

  public getBounds(): Bounds {
    const bounds = this.getMap().getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return [
      [sw.lng, sw.lat],
      [ne.lng, ne.lat],
    ];
  }

  public getMapContainer(): HTMLElement {
    return this.getMap().getContainer();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.getMap().getContainer();
  }

  public getMapStyleConfig(): MapStyleConfig {
    return this.styleConfig;
  }

  public getMapStyleValue(name: string) {
    return this.styleConfig[name];
  }

  public setMapStyle(style: any): void {
    if (this.currentStyle === style) {
      return;
    }

    const styleVal = Array.isArray(style) ? style : this.styleConfig[style] || style;

    if (Array.isArray(styleVal)) {
      this.map.setMapStyleV2({
        styleJson: styleVal,
      });
      this.currentStyle = style;
      return;
    }

    if (typeof styleVal === 'string') {
      this.map.setMapStyleV2({
        styleId: styleVal,
      });
      this.currentStyle = style;
      return;
    }
  }

  public setRotation(rotation: number): void {
    this.getMap().setHeading(rotation);
  }

  public zoomIn(): void {
    this.getMap().zoomIn();
  }

  public zoomOut(): void {
    this.getMap().zoomOut();
  }

  public panTo(p: Point): void {
    this.getMap().panTo(new BMapGL.Point(p[0], p[1]));
  }

  public panBy(x: number, y: number): void {
    this.getMap().panBy(x, y);
  }

  public fitBounds(bound: Bounds, fitBoundsOptions?: unknown): void {
    this.map.setViewport(
      bound.map((item) => new BMapGL.Point(item[0], item[1])),
      fitBoundsOptions as any,
    );
  }

  public setZoomAndCenter(zoom: number, [lng, lat]: Point): void {
    this.getMap().centerAndZoom(new BMapGL.Point(lng, lat), zoom + 1.75);
  }

  public setCenter([lng, lat]: [number, number], options?: ICameraOptions): void {
    let newCenter = { lng, lat };
    if (options?.padding) {
      const padding = toPaddingOptions(options.padding);
      const px = this.lngLatToPixel([lng, lat]);
      const offsetPx = [(padding.right - padding.left) / 2, (padding.bottom - padding.top) / 2];
      newCenter = this.pixelToLngLat([px.x + offsetPx[0], px.y + offsetPx[1]]);
    }
    this.getMap().setCenter(new BMapGL.Point(newCenter.lng, newCenter.lat));
  }

  public setPitch(pitch: number): any {
    this.getMap().setTilt(pitch);
  }

  public setZoom(zoom: number): any {
    this.getMap().setZoom(zoom);
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    const map = this.getMap();
    (Object.keys(option) as Array<keyof IStatusOptions>).map((status) => {
      switch (status) {
        case 'doubleClickZoom':
          option.doubleClickZoom ? map.enableDoubleClickZoom() : map.disableDoubleClickZoom();
          break;
        case 'dragEnable':
          option.dragEnable ? map.enableDragging() : map.disableDragging();
          break;
        case 'keyboardEnable':
          option.keyboardEnable ? map.enableKeyboard() : map.disableKeyboard();
          break;
        case 'resizeEnable':
          option.resizeEnable ? map.enableAutoResize() : map.disableAutoResize();
          break;
        case 'rotateEnable':
          if (option.rotateEnable) {
            map.enableRotate();
            map.enableRotateGestures();
          } else {
            map.disableRotate();
            map.disableRotateGestures();
          }
          break;
        case 'zoomEnable':
          if (option.zoomEnable) {
            this.map.enableDoubleClickZoom();
            this.map.enableScrollWheelZoom();
            this.map.enablePinchToZoom();
          } else {
            this.map.disableDoubleClickZoom();
            this.map.disableScrollWheelZoom();
            this.map.disablePinchToZoom();
          }
          break;
        case 'showIndoorMap':
          map.setDisplayOptions({
            indoor: !!option.showIndoorMap,
          });
          break;
        default:
      }
    });
  }

  // coordinates methods
  public meterToCoord(center: [number, number], outer: [number, number]) {
    const metreDistance = this.getMap().getDistance(
      new BMapGL.Point(...center),
      new BMapGL.Point(...outer),
    );

    const [x1, y1] = this.lngLatToCoord(center);
    const [x2, y2] = this.lngLatToCoord(outer);
    const coordDistance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDistance / metreDistance;
  }

  public pixelToLngLat([x, y]: Point): ILngLat {
    const lngLat = this.getMap().pixelToPoint(new BMapGL.Pixel(x, y));
    return { lng: lngLat.lng, lat: lngLat.lat };
  }

  public lngLatToPixel([lng, lat]: Point): IPoint {
    const pixel = this.getMap().pointToPixel(new BMapGL.Point(lng, lat));
    return {
      x: pixel.x,
      y: pixel.y,
    };
  }

  public containerToLngLat([x, y]: [number, number]): ILngLat {
    const point = this.getMap().overlayPixelToPoint(new BMapGL.Pixel(x, y));
    return {
      lng: point.lng,
      lat: point.lat,
    };
  }

  public lngLatToContainer([lng, lat]: [number, number]): IPoint {
    const overlayPixel = this.getMap().pointToOverlayPixel(new BMapGL.Point(lng, lat));
    return {
      x: overlayPixel.x,
      y: overlayPixel.y,
    };
  }

  public lngLatToCoord([lng, lat]: [number, number]): [number, number] {
    const { x, y } = this.getMap().pointToPixel(new BMapGL.Point(lng, lat));
    return [x, -y];
  }

  public lngLatToCoords(list: number[][] | number[][][]): any {
    return list.map((item) =>
      Array.isArray(item[0])
        ? this.lngLatToCoords(item as Array<[number, number]>)
        : this.lngLatToCoord(item as [number, number]),
    );
  }

  public lngLatToMercator([lng, lat]: [number, number], altitude: number): IMercator {
    const [McLng, McLat] = this.getMap().lnglatToMercator(lng, lat);
    return {
      x: McLng,
      y: McLat,
      z: altitude,
    };
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
    throw new Error('Method not implemented.');
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.getMap()._webglPainter._canvas;
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  private hideLogo() {
    const container = this.map.getContainer();
    if (!container) {
      return;
    }
    DOM.addClass(container, 'bmap-contianer--hide-logo');
  }

  private initMapByConfig(config: Partial<IMapConfig<{}>>) {
    const { style, pitch = 0, rotation = 0, logoVisible = true } = config;
    if (style) {
      this.setMapStyle(style);
    }
    if (pitch) {
      this.setPitch(pitch);
    }
    if (rotation) {
      this.setRotation(rotation);
    }
    if (logoVisible === false) {
      this.hideLogo();
    }
  }
}
