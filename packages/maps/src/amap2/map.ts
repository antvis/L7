/**
 * AMapService
 */
import AMapLoader from '@amap/amap-jsapi-loader';
import {
  Bounds,
  CoordinateSystem,
  ICameraOptions,
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
  Point,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IAMapEvent, IAMapInstance } from '../../typings/index';
import { ISimpleMapCoord, SimpleMapCoord } from '../simpleMapCoord';
import { toPaddingOptions } from '../utils';
import { Version } from '../version';
import './logo.css';
import { MapTheme } from './theme';
import Viewport from './Viewport';

let mapdivCount = 0;
// @ts-ignore
window.forceWebGL = true;

// const AMAP_API_KEY: string = '15cd8a57710d40c9b7c0e3cc120f1200';
const AMAP_API_KEY: string = 'ff533602d57df6f8ab3b0fea226ae52f';
// const AMAP_VERSION: string = '1.4.15';
const AMAP_VERSION: string = '2.0';
/**
 * 确保多个场景只引入一个高德地图脚本
 */
const AMAP_SCRIPT_ID: string = 'amap-script';
/**
 * 高德地图脚本是否加载完毕
 */
let amapLoaded = false;
/**
 * 高德地图脚本加载成功等待队列，成功之后依次触发
 */
let pendingResolveQueue: Array<() => void> = [];

/**
 * AMapService
 */
@injectable()
export default class AMapService
  implements IMapService<AMap.Map & IAMapInstance> {
  public version: string = Version['GAODE2.x'];
  public simpleMapCoord: SimpleMapCoord = new SimpleMapCoord();
  /**
   * 原始地图实例
   */
  public map: AMap.Map & IAMapInstance;

  /**
   * 用于 customCooords 数据的计算
   */
  public sceneCenter!: [number, number]; // 一般使用用户数据的第一个
  public sceneCenterMKT!: [number, number]; // 莫卡托

  // 背景色
  public bgColor: string = 'rgba(0, 0, 0, 0)';

  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.MapConfig)
  private readonly config: Partial<IMapConfig>;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IEventEmitter)
  private eventEmitter: any;

  private markerContainer: HTMLElement;
  private $mapContainer: HTMLElement | null;

  private viewport: Viewport;

  private cameraChangedCallback: (viewport: IViewport) => void;
  public setBgColor(color: string) {
    this.bgColor = color;
  }

  /**
   *   设置数据的绘制中心 高德2.0
   */
  public setCustomCoordCenter(center: [number, number]) {
    this.sceneCenter = center;
    // @ts-ignore
    this.sceneCenterMKT = this.map
      // @ts-ignore
      .getProjection()
      .project(...this.sceneCenter);
  }

  public getCustomCoordCenter(): [number, number] {
    return this.sceneCenterMKT;
  }
  /**
   * 根据数据的绘制中心转换经纬度数据 高德2.0
   */
  public lngLatToCoord(lnglat: [number, number]) {
    // @ts-ignore
    const proj = this.map.getProjection();
    const project = proj.project;
    // 单点
    if (!this.sceneCenter) {
      // @ts-ignore
      this.map.customCoords.setCenter(lnglat);
      this.setCustomCoordCenter(lnglat);
    }
    return this._sub(project(lnglat[0], lnglat[1]), this.sceneCenterMKT);
  }

  /**
   * 转化线、面类型的点位数据
   */
  public lngLatToCoords(
    lnglatArray: number[][][] | number[][],
  ): number[][][] | number[][] {
    // @ts-ignore
    return lnglatArray.map((lnglats) => {
      if (typeof lnglats[0] === 'number') {
        return this.lngLatToCoord(lnglats as [number, number]);
      } else {
        // @ts-ignore
        return lnglats.map((lnglat) => {
          return this.lngLatToCoord(lnglat as [number, number]);
        });
      }
    });
  }

  public addMarkerContainer(): void {
    if (!this.map) {
      return;
    }
    const mapContainer = this.map.getContainer();
    if (mapContainer !== null) {
      const amap = mapContainer.getElementsByClassName(
        'amap-maps',
      )[0] as HTMLElement;
      // TODO: amap2 的 amap-maps 新增 z-index=0; 样式，让 marker 中 zIndex 失效
      amap.style.zIndex = 'auto';
      this.markerContainer = DOM.create('div', 'l7-marker-container2', amap);
      // this.markerContainer = DOM.create(
      //   'div',
      //   'l7-marker-container2',
      //   mapContainer,
      // );
      // this.markerContainer = mapContainer;
    }
  }
  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  //  map event
  public on(type: string, handler: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handler);
    } else {
      this.map.on(type, handler);
    }
  }
  public off(type: string, handler: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handler);
    } else {
      this.map.off(type, handler);
    }
  }

  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map
      .getContainer()
      ?.getElementsByClassName('amap-maps')[0] as HTMLElement;
  }

  public getSize(): [number, number] {
    const size = this.map.getSize();
    return [size.getWidth(), size.getHeight()];
  }

  public getType() {
    return 'amap2';
  }
  public getZoom(): number {
    // 统一返回 Mapbox 缩放等级
    return this.map.getZoom() - 1;
  }

  public setZoom(zoom: number): void {
    // 统一设置 Mapbox 缩放等级
    return this.map.setZoom(zoom + 1);
  }

  public getCenter(options?: ICameraOptions): ILngLat {
    if (options?.padding) {
      const originCenter = this.getCenter();
      const [w, h] = this.getSize();
      const padding = toPaddingOptions(options.padding);
      const px = this.lngLatToPixel([originCenter.lng, originCenter.lat]);
      const offsetPx = [
        (padding.right - padding.left) / 2,
        (padding.bottom - padding.top) / 2,
      ];

      const newCenter = this.pixelToLngLat([
        px.x - offsetPx[0],
        px.y - offsetPx[1],
      ]);
      return newCenter;
    }
    const center = this.map.getCenter();
    return {
      lng: center.getLng(),
      lat: center.getLat(),
    };
  }
  public setCenter(lnglat: [number, number], options?: ICameraOptions): void {
    if (options?.padding) {
      const padding = toPaddingOptions(options.padding);
      const px = this.lngLatToPixel(lnglat);
      const offsetPx = [
        (padding.right - padding.left) / 2,
        (padding.bottom - padding.top) / 2,
      ];
      const newCenter = this.pixelToLngLat([
        px.x + offsetPx[0],
        px.y + offsetPx[1],
      ]);
      this.map.setCenter([newCenter.lng, newCenter.lat]);
    } else {
      this.map.setCenter(lnglat);
    }
  }
  public getPitch(): number {
    return this.map.getPitch();
  }

  public getRotation(): number {
    // 统一返回逆时针旋转角度
    return 360 - this.map.getRotation();
  }

  public getBounds(): Bounds {
    // @ts-ignore
    // const amapBound = this.map.getBounds().toBounds();
    // const NE = amapBound.getNorthEast();
    // const SW = amapBound.getSouthWest();
    const bounds = this.map.getBounds();

    // @ts-ignore
    const NE = bounds.getNorthEast();
    // @ts-ignore
    const SW = bounds.getSouthWest();
    const center = this.getCenter();
    const maxlng =
      center.lng > NE.getLng() || center.lng < SW.getLng()
        ? 180 - NE.getLng()
        : NE.getLng();
    const minlng = center.lng < SW.getLng() ? SW.getLng() - 180 : SW.getLng();
    // 兼容 Mapbox，统一返回西南、东北
    return [
      [minlng, SW.getLat()],
      [maxlng, NE.getLat()],
    ];
  }

  public getMinZoom(): number {
    // const zooms = this.map.get('zooms') as [number, number];
    // @ts-ignore
    const zooms = this.map.getZooms() as [number, number];
    return zooms[0] - 1;
  }
  public getMaxZoom(): number {
    // const zooms = this.map.get('zooms') as [number, number];
    // @ts-ignore
    const zooms = this.map.getZooms() as [number, number];
    return zooms[1] - 1;
  }
  public setRotation(rotation: number): void {
    return this.map.setRotation(rotation);
  }

  public setPitch(pitch: number) {
    return this.map.setPitch(pitch);
  }
  public zoomIn(): void {
    this.map.zoomIn();
  }

  public zoomOut(): void {
    this.map.zoomOut();
  }

  public panTo(p: [number, number]): void {
    this.map.panTo(p);
  }
  public panBy(x: number = 0, y: number = 0): void {
    this.map.panBy(x, y);
  }
  public fitBounds(extent: Bounds): void {
    this.map.setBounds(
      new AMap.Bounds([extent[0][0], extent[0][1], extent[1][0], extent[1][1]]),
    );
  }
  public setZoomAndCenter(zoom: number, center: [number, number]): void {
    this.map.setZoomAndCenter(zoom + 1, center);
  }
  public setMapStyle(style: string): void {
    this.map.setMapStyle(this.getMapStyle(style));
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    this.map.setStatus(option);
  }
  public pixelToLngLat(pixel: [number, number]): ILngLat {
    const lngLat = this.map.pixelToLngLat(new AMap.Pixel(pixel[0], pixel[1]));
    return { lng: lngLat.getLng(), lat: lngLat.getLat() };
  }
  public lngLatToPixel(lnglat: [number, number]): IPoint {
    const p = this.map.lnglatToPixel(new AMap.LngLat(lnglat[0], lnglat[1]));
    return {
      x: p.getX(),
      y: p.getY(),
    };
  }
  public containerToLngLat(pixel: [number, number]): ILngLat {
    const ll = new AMap.Pixel(pixel[0], pixel[1]);
    const lngLat = this.map.containerToLngLat(ll);
    return {
      lng: lngLat?.getLng(),
      lat: lngLat?.getLat(),
    };
  }
  public lngLatToContainer(lnglat: [number, number]): IPoint {
    const ll = new AMap.LngLat(lnglat[0], lnglat[1]);
    const pixel = this.map.lngLatToContainer(ll);
    return {
      x: pixel.getX(),
      y: pixel.getY(),
    };
  }

  public lngLatToMercator(
    lnglat: [number, number],
    altitude: number,
  ): IMercator {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  public getModelMatrix(
    lnglat: [number, number],
    altitude: number,
    rotate: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    origin: IMercator = { x: 0, y: 0, z: 0 },
  ): number[] {
    // const flat = this.viewport.projectFlat(lnglat);
    // @ts-ignore
    const flat = this.map.customCoords.lngLatToCoord(lnglat);
    // @ts-ignore
    const modelMatrix = mat4.create();

    mat4.translate(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(flat[0], flat[1], altitude),
    );

    mat4.scale(
      modelMatrix,
      modelMatrix,
      vec3.fromValues(scale[0], scale[1], scale[2]),
    );

    mat4.rotateX(modelMatrix, modelMatrix, rotate[0]);
    mat4.rotateY(modelMatrix, modelMatrix, rotate[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, rotate[2]);

    return (modelMatrix as unknown) as number[];
  }
  public async init(): Promise<void> {
    const {
      id,
      style = 'light',
      minZoom = 0,
      maxZoom = 18,
      token = AMAP_API_KEY,
      mapInstance,
      plugin = [],
      version = AMAP_VERSION,
      ...rest
    } = this.config;
    // 高德地图创建独立的container；
    // tslint:disable-next-line:typedef
    await new Promise<void>((resolve) => {
      const resolveMap = () => {
        if (mapInstance) {
          this.map = mapInstance as AMap.Map & IAMapInstance;
          this.$mapContainer = this.map.getContainer();

          // 在使用 map.customCoords 的时候必须使用
          const mapInitCenter = this.map.getCenter();
          // @ts-ignore
          this.map.customCoords?.setCenter([
            // @ts-ignore
            mapInitCenter.lng,
            // @ts-ignore
            mapInitCenter.lat,
          ]);
          // @ts-ignore
          this.setCustomCoordCenter([mapInitCenter.lng, mapInitCenter.lat]);

          setTimeout(() => {
            this.map.on('viewchange', this.handleViewChanged);
            resolve();
          }, 30);
        } else {
          this.$mapContainer = this.creatAmapContainer(
            id as string | HTMLDivElement,
          );
          const mapConstructorOptions = {
            mapStyle: this.getMapStyle(style as string),
            zooms: [minZoom, maxZoom],
            viewMode: '3D',
            ...rest,
          };
          if (mapConstructorOptions.zoom) {
            // TODO: 高德地图在相同大小下需要比 MapBox 多一个 zoom 层级
            mapConstructorOptions.zoom += 1;
          }
          // @ts-ignore
          const map = new AMap.Map(this.$mapContainer, mapConstructorOptions);
          // @ts-ignore
          this.map = map;
          // 在使用 map.customCoords 的时候必须使用
          const mapInitCenter = map.getCenter();
          // @ts-ignore
          map.customCoords.setCenter([mapInitCenter.lng, mapInitCenter.lat]);
          // @ts-ignore
          this.setCustomCoordCenter([mapInitCenter.lng, mapInitCenter.lat]);
          // 监听地图相机事件
          map.on('viewchange', this.handleViewChanged);

          setTimeout(() => {
            resolve();
          }, 10);
        }
      };
      this.viewport = new Viewport();
      if (!amapLoaded && !mapInstance) {
        if (token === AMAP_API_KEY) {
          console.warn(this.configService.getSceneWarninfo('MapToken'));
        }
        amapLoaded = true;
        plugin.push('Map3D');
        AMapLoader.load({
          key: token, // 申请好的Web端开发者Key，首次调用 load 时必填
          version, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: plugin, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
          .then((AMap) => {
            resolveMap();
            if (pendingResolveQueue.length) {
              pendingResolveQueue.forEach((r) => r());
              pendingResolveQueue = [];
            }
          })
          .catch((e) => {
            throw new Error(e);
          });
      } else {
        if ((amapLoaded && window.AMap) || mapInstance) {
          resolveMap();
        } else {
          pendingResolveQueue.push(resolveMap);
        }
      }
    });
  }

  public meterToCoord(center: [number, number], outer: [number, number]) {
    // 统一根据经纬度来转化
    // Tip: 实际米距离 unit meter
    const meterDis = AMap.GeometryUtil.distance(
      new AMap.LngLat(...center),
      new AMap.LngLat(...outer),
    );

    // Tip: 三维世界坐标距离
    const [x1, y1] = this.lngLatToCoord(center);
    const [x2, y2] = this.lngLatToCoord(outer);
    const coordDis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDis / meterDis;
  }

  public exportMap(type: 'jpg' | 'png'): string {
    const renderCanvas = this.getContainer()?.getElementsByClassName(
      'amap-layer',
    )[0] as HTMLCanvasElement;
    const layersPng =
      type === 'jpg'
        ? (renderCanvas?.toDataURL('image/jpeg') as string)
        : (renderCanvas?.toDataURL('image/png') as string);
    return layersPng;
  }

  public emit(name: string, ...args: any[]) {
    this.eventEmitter.emit(name, ...args);
  }

  public once(name: string, ...args: any[]) {
    this.eventEmitter.once(name, ...args);
  }

  public destroy() {
    this.map.destroy();

    // TODO: 销毁地图可视化层的容器
    this.$mapContainer?.parentNode?.removeChild(this.$mapContainer);

    // @ts-ignore
    delete window.initAMap;
    const $jsapi = document.getElementById(AMAP_SCRIPT_ID);
    if ($jsapi) {
      document.head.removeChild($jsapi);
    }
  }

  public getMapContainer() {
    return this.$mapContainer;
  }

  public onCameraChanged(callback: (viewport: IViewport) => void): void {
    this.cameraChangedCallback = callback;
  }

  public initViewPort() {
    // @ts-ignore
    const {
      // @ts-ignore
      fov,
      // @ts-ignore
      near,
      // @ts-ignore
      far,
      // @ts-ignore
      aspect,
      // @ts-ignore
      position,
      // @ts-ignore
      lookAt,
      // @ts-ignore
      up,
      // @ts-ignore
      // left, right, bottom, top
      // @ts-ignore
    } = this.map.customCoords?.getCameraParams();
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');
    // // @ts-ignore
    // console.log('this.map.customCoords.getCameraParams()', this.map.customCoords.getCameraParams())
    // const { left, right, bottom, top, near, far, position } = this.map.customCoords.getCameraParams();

    // @ts-ignore
    const center = this.map.customCoords.getCenter() as [number, number];
    const zoom = this.map.getZoom();
    // @ts-ignore
    if (this.cameraChangedCallback) {
      this.viewport.syncWithMapCamera({
        aspect,
        far,
        fov,
        cameraPosition: position,
        lookAt,
        near,
        up,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: zoom - 1, // 与amap1.x对比相差一个级别
        center,
        offsetOrigin: [position[0], position[1]],

        // @ts-ignore
        // left, right, bottom, top
      });
      // set coordinate system
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20_2);
      this.cameraChangedCallback(this.viewport);
    }
  }

  private _sub(a: number[] | vec3 | vec2, b: number[]): [number, number] {
    const r: [number, number] = [0, 0];
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
  }

  /**
   *
   * @param e
   */
  private handleViewChanged = (e: any): void => {
    const {
      // @ts-ignore
      fov,
      // @ts-ignore
      near,
      // @ts-ignore
      far,
      // @ts-ignore
      aspect,
      // @ts-ignore
      position,
      // @ts-ignore
      lookAt,
      // @ts-ignore
      up,
      // @ts-ignore
      // left, right, bottom, top
      // @ts-ignore
    } = this.map.customCoords.getCameraParams();
    // Tip: 统一触发地图变化事件
    this.emit('mapchange');

    const { zoom } = e;
    // @ts-ignore
    const center = this.map.customCoords.getCenter() as [number, number];
    if (this.cameraChangedCallback) {
      // resync viewport
      this.viewport.syncWithMapCamera({
        aspect,
        far,
        fov,
        cameraPosition: position,
        lookAt,
        up,
        near,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: zoom - 1, // 与amap1.x对比相差一个级别
        center,
        offsetOrigin: [position[0], position[1]],

        // @ts-ignore
        // left, right, bottom, top
      });
      // set coordinate system
      this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20_2);
      this.cameraChangedCallback(this.viewport);
    }
  };

  private getMapStyle(name: string): string {
    return MapTheme[name] ? MapTheme[name] : name;
  }

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
    $amapdiv.id = 'l7_amap_div' + mapdivCount++;
    $wrapper.appendChild($amapdiv);
    return $amapdiv;
  }
}
