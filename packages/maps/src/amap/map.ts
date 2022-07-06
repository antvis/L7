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

const AMAP_API_KEY: string = '15cd8a57710d40c9b7c0e3cc120f1200';
const AMAP_VERSION: string = '1.4.15';
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
const LNGLAT_OFFSET_ZOOM_THRESHOLD = 12; // 暂时关闭 fix 统一不同坐标系，不同底图的高度位置

/**
 * AMapService
 */
@injectable()
export default class AMapService
  implements IMapService<AMap.Map & IAMapInstance> {
  public version: string = Version['GAODE1.x'];
  public simpleMapCoord: ISimpleMapCoord = new SimpleMapCoord();
  /**
   * 原始地图实例
   */
  public map: AMap.Map & IAMapInstance;

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

  public addMarkerContainer(): void {
    const mapContainer = this.map.getContainer();
    if (mapContainer !== null) {
      const amap = mapContainer.getElementsByClassName(
        'amap-maps',
      )[0] as HTMLElement;
      this.markerContainer = DOM.create('div', 'l7-marker-container', amap);
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
    return 'amap';
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
    const amapBound = this.map.getBounds().toBounds();
    const NE = amapBound.getNorthEast();
    const SW = amapBound.getSouthWest();
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
    const zooms = this.map.get('zooms') as [number, number];
    return zooms[0] - 1;
  }
  public getMaxZoom(): number {
    const zooms = this.map.get('zooms') as [number, number];
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

  public lngLatToCoord(lnglat: [number, number]): any {
    // @ts-ignore
    const { x, y } = this.map.lngLatToGeodeticCoord(lnglat);
    return [x, -y];
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
    const flat = this.viewport.projectFlat(lnglat);
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
      ...rest
    } = this.config;
    // 高德地图创建独立的container；
    // tslint:disable-next-line:typedef
    await new Promise<void>((resolve) => {
      const resolveMap = () => {
        if (mapInstance) {
          this.map = mapInstance as AMap.Map & IAMapInstance;
          this.$mapContainer = this.map.getContainer();
          setTimeout(() => {
            this.map.on('camerachange', this.handleCameraChanged);
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
          // 监听地图相机事件
          map.on('camerachange', this.handleCameraChanged);
          // Tip: 为了兼容开启 MultiPassRender 的情况
          // 修复 MultiPassRender 在高德地图 1.x 的情况下，缩放地图改变 zoom 时存在可视化层和底图不同步的现象
          map.on('camerachange', () => {
            setTimeout(() => this.handleAfterMapChange());
          });

          // @ts-ignore
          this.map = map;
          setTimeout(() => {
            resolve();
          }, 10);
        }
      };
      if (!amapLoaded && !mapInstance) {
        if (token === AMAP_API_KEY) {
          console.warn(this.configService.getSceneWarninfo('MapToken'));
        }
        amapLoaded = true;
        plugin.push('Map3D');
        AMapLoader.load({
          key: token, // 申请好的Web端开发者Key，首次调用 load 时必填
          version: AMAP_VERSION, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
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

    this.viewport = new Viewport();
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

  private handleAfterMapChange() {
    this.emit('mapAfterFrameChange');
  }

  private handleCameraChanged = (e: IAMapEvent): void => {
    const {
      fov,
      near,
      far,
      height,
      pitch,
      rotation,
      aspect,
      position,
    } = e.camera;
    const { lng, lat } = this.getCenter();
    // Tip: 触发地图变化事件
    this.emit('mapchange');

    if (this.cameraChangedCallback) {
      // resync viewport
      // console.log('cameraHeight', height)
      // console.log('pitch', pitch)
      // console.log('rotation', rotation)
      // console.log('zoom', this.map.getZoom())
      this.viewport.syncWithMapCamera({
        aspect,
        // AMap 定义 rotation 为顺时针方向，而 Mapbox 为逆时针
        // @see https://docs.mapbox.com/mapbox-gl-js/api/#map#getbearing
        bearing: 360 - rotation,
        far,
        fov,
        cameraHeight: height,
        near,
        pitch,
        // AMap 定义的缩放等级 与 Mapbox 相差 1
        zoom: this.map.getZoom() - 1,
        center: [lng, lat],
        offsetOrigin: [position.x, position.y],
      });
      const { offsetZoom = LNGLAT_OFFSET_ZOOM_THRESHOLD } = this.config;
      // console.log('this.viewport', this.viewport)
      // set coordinate system
      if (this.viewport.getZoom() > offsetZoom) {
        this.coordinateSystemService.setCoordinateSystem(
          CoordinateSystem.P20_OFFSET,
        );
      } else {
        this.coordinateSystemService.setCoordinateSystem(CoordinateSystem.P20);
      }
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
