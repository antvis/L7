import AMapLoader from '@amap/amap-jsapi-loader';
import type {
  Bounds,
  ICameraOptions,
  ILngLat,
  IMercator,
  IPoint,
  IStatusOptions,
  MapStyleConfig,
  MapStyleName,
} from '@antv/l7-core';
import { MapServiceEvent } from '@antv/l7-core';
import { DOM, amap2Project, lodashUtil } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
import BaseMap from '../lib/base-map';
import Viewport from '../lib/web-mercator-viewport';
import { MapType } from '../types';
import { toPaddingOptions } from '../utils/utils';
import './logo.css';
import { MapTheme } from './theme';

const AMAP_VERSION = '2.0';
const AMAP_API_KEY = 'f59bcf249433f8b05caaee19f349b3d7';
const ZOOM_OFFSET = 1;

const AMapEventMapV2: Record<string, string> = {
  contextmenu: 'rightclick',
  camerachange: 'viewchange',
};

export default class BMapService extends BaseMap<AMap.Map> {
  protected viewport = new Viewport();

  public version = MapType.GAODE;

  public getType() {
    return 'amap';
  }

  public async init() {
    const {
      id,
      style = 'light',
      minZoom = 0,
      maxZoom = 24,
      token = AMAP_API_KEY,
      mapInstance,
      plugin = [],
      ...rest
    } = this.config;

    if (!(window.AMap || mapInstance)) {
      plugin.push('Map3D');
      await AMapLoader.load({
        key: token, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: AMAP_VERSION, // 指定要加载的 JSAPI 的版本
        plugins: plugin, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      });
    }

    if (mapInstance) {
      this.map = mapInstance;
      this.mapContainer = this.map.getContainer();

      this.map.on('viewchange', this.handleCameraChanged);
    } else {
      const mapConstructorOptions: AMap.Map.Options = {
        mapStyle: this.getMapStyleValue(style as string),
        // 默认取值范围 [2, 20]
        zooms: [minZoom, maxZoom],
        viewMode: '3D',
        ...rest,
        // 地图平移过程中是否使用动画（如调用 panBy、panTo、setCenter、setZoomAndCenter 等函数, 将对地图产生平移操作, 是否使用动画平移的效果）, 默认为 true , 即使用动画
        // animateEnable: false,
        // 地图使用缓动效果
        // jogEnable: false,
      };

      if (mapConstructorOptions.zoom) {
        // 高德地图在相同大小下需要比 MapBox 多一个 zoom 层级
        mapConstructorOptions.zoom += ZOOM_OFFSET;
      }

      if (token === AMAP_API_KEY) {
        (window as any)._AMapSecurityConfig = {
          securityJsCode: '2653011adeb04230b3a26cc9a780a800',
        };
        console.warn(
          `%c${this.configService.getSceneWarninfo('MapToken')}!`,
          'color: #873bf4;font-weigh:900;font-size: 16px;',
        );
      }

      if (!id) {
        throw Error('No container id specified');
      }

      // https://lbs.amap.com/faq/other-product/1000080679/1000080682/1060894069
      (window as any).forceWebGL = true;

      this.mapContainer = this.creatMapContainer(id);

      const map = new AMap.Map(this.mapContainer, mapConstructorOptions);

      this.map = map;

      // 监听地图相机事件
      map.on('viewchange', this.handleCameraChanged);
    }

    this.syncInitViewPort();
  }

  private syncInitViewPort() {
    const option = this.getViewState();
    this.updateView(option);
  }

  protected handleCameraChanged = () => {
    const option = this.getViewState();
    this.updateView(option);
  };

  private getViewState() {
    const { center, zoom } = getMapHighPrecisionState(this.map);
    const option = {
      center: center,
      viewportWidth: this.map.getContainer()!.clientWidth,
      viewportHeight: this.map.getContainer()!.clientHeight,
      bearing: -this.map.getRotation(),
      pitch: this.map.getPitch(),
      zoom: zoom - ZOOM_OFFSET,
    };

    return option;
  }

  protected creatMapContainer(id: string | HTMLDivElement) {
    const wrapper = super.creatMapContainer(id);
    const amapdiv = document.createElement('div');
    amapdiv.style.cssText += `
       position: absolute;
       top: 0;
       height: 100%;
       width: 100%;
     `;
    amapdiv.id = lodashUtil.uniqueId('l7_amap_div');
    wrapper.appendChild(amapdiv);
    return amapdiv;
  }

  public getContainer(): HTMLElement | null {
    return this.map.getContainer();
  }

  public addMarkerContainer(): void {
    if (!this.map) return;

    const mapContainer = this.map.getContainer();
    if (mapContainer !== null) {
      const amap = mapContainer.getElementsByClassName('amap-maps')[0] as HTMLElement;
      // amap2 的 amap-maps 新增 z-index=0; 样式，让 marker 中 zIndex 失效
      amap.style.zIndex = 'auto';
      this.markerContainer = DOM.create('div', 'l7-marker-container2', amap);
    }
  }

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }

  public getCanvasOverlays() {
    return this.mapContainer?.querySelector('.amap-overlays') as HTMLElement;
  }

  // MapEvent // 定义事件类型
  public on(type: string, handler: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.on(type, handler);
    } else {
      this.map.on(AMapEventMapV2[type] || type, handler);
    }
  }

  public off(type: string, handler: (...args: any[]) => void): void {
    if (MapServiceEvent.indexOf(type) !== -1) {
      this.eventEmitter.off(type, handler);
    } else {
      this.map.off(AMapEventMapV2[type] || type, handler);
    }
  }

  public getSize(): [number, number] {
    const size = this.map.getSize();
    return [size.getWidth(), size.getHeight()];
  }

  public getMinZoom(): number {
    // @ts-ignore
    const zooms: [number, number] = this.map.getZooms();
    return zooms[0] - ZOOM_OFFSET;
  }
  public getMaxZoom(): number {
    // @ts-ignore
    const zooms: [number, number] = this.map.getZooms();
    return zooms[1] - ZOOM_OFFSET;
  }

  public getZoom(): number {
    // 统一返回 Mapbox 缩放等级
    return this.map.getZoom() - ZOOM_OFFSET;
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
      lng: center.getLng(),
      lat: center.getLat(),
    };
  }

  public getPitch(): number {
    return this.map.getPitch();
  }

  public getRotation(): number {
    // 统一返回逆时针旋转角度
    return 360 - this.map.getRotation();
  }

  public getBounds(): Bounds {
    const bounds = this.map.getBounds();
    const NE = bounds.getNorthEast();
    const SW = bounds.getSouthWest();
    const center = this.getCenter();
    const maxlng =
      center.lng > NE.getLng() || center.lng < SW.getLng() ? 180 - NE.getLng() : NE.getLng();
    const minlng = center.lng < SW.getLng() ? SW.getLng() - 180 : SW.getLng();
    // 兼容 Mapbox，统一返回西南、东北
    return [
      [minlng, SW.getLat()],
      [maxlng, NE.getLat()],
    ];
  }

  public getMapContainer() {
    return this.mapContainer;
  }

  public getMapCanvasContainer(): HTMLElement {
    return this.map.getContainer()?.getElementsByClassName('amap-maps')[0] as HTMLElement;
  }

  public getMapStyleConfig(): MapStyleConfig {
    return MapTheme;
  }

  public getMapStyleValue(name: string) {
    return this.getMapStyleConfig()[name] || name;
  }

  public getMapStyle(): string {
    return this.map.getMapStyle();
  }

  public setMapStyle(style: MapStyleName): void {
    this.map.setMapStyle(this.getMapStyleValue(style));
  }

  public setRotation(rotation: number): void {
    return this.map.setRotation(rotation);
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
      // @ts-expect-error 立即缩放到指定位置
      true,
    );
  }

  public setZoomAndCenter(zoom: number, center: [number, number]): void {
    this.map.setZoomAndCenter(zoom + ZOOM_OFFSET, center);
  }

  public setCenter(lnglat: [number, number], options?: ICameraOptions): void {
    if (options?.padding) {
      const padding = toPaddingOptions(options.padding);
      const px = this.lngLatToPixel(lnglat);
      const offsetPx = [(padding.right - padding.left) / 2, (padding.bottom - padding.top) / 2];
      const newCenter = this.pixelToLngLat([px.x + offsetPx[0], px.y + offsetPx[1]]);
      this.map.setCenter([newCenter.lng, newCenter.lat]);
    } else {
      this.map.setCenter(lnglat);
    }
  }

  public setPitch(pitch: number) {
    return this.map.setPitch(pitch);
  }

  public setZoom(zoom: number): void {
    // 统一设置 Mapbox 缩放等级
    return this.map.setZoom(zoom + ZOOM_OFFSET);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setMaxZoom(max: number): void {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setMinZoom(min: number): void {
    throw new Error('Method not implemented.');
  }

  public setMapStatus(option: Partial<IStatusOptions>): void {
    this.map.setStatus(option);
  }

  public meterToCoord(center: [number, number], outer: [number, number]) {
    // Tip: 实际米距离 unit meter
    const meterDis = AMap.GeometryUtil.distance(
      new AMap.LngLat(...center),
      new AMap.LngLat(...outer),
    );

    // Tip: 三维世界坐标距离
    const [x1, y1] = amap2Project(...center);
    const [x2, y2] = amap2Project(...outer);
    const coordDis = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    return coordDis / meterDis;
  }

  public pixelToLngLat(pixel: [number, number]): ILngLat {
    const lngLat = this.map.pixelToLngLat(new AMap.Pixel(pixel[0], pixel[1]));
    return { lng: lngLat.getLng(), lat: lngLat.getLat() };
  }

  public lngLatToPixel(lnglat: [number, number]): IPoint {
    const p = this.map.lnglatToPixel(lnglat);
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
    const pixel = this.map.lngLatToContainer(lnglat);
    return {
      x: pixel.getX(),
      y: pixel.getY(),
    };
  }

  /**
   * 将经纬度转成墨卡托坐标
   */
  public lngLatToMercator([lng, lat]: [number, number], altitude: number): IMercator {
    const [x, y] = amap2Project(lng, lat);
    return {
      x: x,
      y: y,
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

  public destroy(): void {
    super.destroy();
    // 销毁地图可视化层的容器
    this.mapContainer?.parentNode?.removeChild(this.mapContainer);

    // @ts-ignore
    delete window.initAMap;

    const $jsapi = document.getElementById('amap-script');
    if ($jsapi) {
      document.head.removeChild($jsapi);
    }
    this.map.destroy();
  }
}

/**
 * 访问高精度的地图状态（临时解决方案）
 * - 解决 map.getCenter() 方法只返回小数点五位有效数据
 * - 解决 map.getZoom() 方法只返回小数点两位有效数据
 */
function getMapHighPrecisionState(map: AMap.Map) {
  // @ts-expect-error 访问未暴露的内部属性
  const viewStatus = map._view.getOptions();

  const center: [number, number] = viewStatus.center;
  const zoom: number = viewStatus.zoom;

  return { center, zoom };
}
