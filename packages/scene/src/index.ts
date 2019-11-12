import {
  Bounds,
  container,
  createSceneContainer,
  IControl,
  IControlService,
  IIconService,
  IImage,
  ILayer,
  ILngLat,
  IMapConfig,
  IMapService,
  IMarker,
  IPoint,
  IRenderConfig,
  IRendererService,
  ISceneService,
  MapType,
  Point,
  SceneEventList,
  TYPES,
} from '@l7/core';
import { AMapService, MapboxService } from '@l7/maps';
import { ReglRendererService } from '@l7/renderer';
import { Map } from 'mapbox-gl';

/**
 * 暴露 Scene API
 *
 * @example
 * import { Scene } from 'l7/scene';
 * import { PointLayer } from 'l7/layers';
 *
 * const scene = new Scene();
 * const pointLayer = new PointLayer();
 * scene.addLayer(pointLayer);
 * scene.render();
 *
 */
class Scene {
  public map: AMap.Map | Map;
  private sceneService: ISceneService;
  private mapService: IMapService;
  private controlService: IControlService;

  private iconService: IIconService;

  public constructor(config: IMapConfig & IRenderConfig) {
    const { type = MapType.amap } = config;

    // 创建场景容器
    const sceneContainer = createSceneContainer();

    // 绑定渲染引擎服务
    sceneContainer
      .bind<IRendererService>(TYPES.IRendererService)
      .to(ReglRendererService)
      .inRequestScope();

    // 根据用户传入参数绑定地图服务
    let mapServiceImpl: new (...args: any[]) => IMapService;
    if (type === MapType.mapbox) {
      mapServiceImpl = MapboxService;
    } else if (type === MapType.amap) {
      mapServiceImpl = AMapService;
    } else {
      throw new Error('不支持的地图服务');
    }
    sceneContainer
      .bind<IMapService>(TYPES.IMapService)
      .to(mapServiceImpl)
      .inRequestScope();

    // 依赖注入
    this.sceneService = sceneContainer.get<ISceneService>(TYPES.ISceneService);
    this.sceneService.init(config);
    this.mapService = sceneContainer.get<IMapService>(TYPES.IMapService);
    this.iconService = sceneContainer.get<IIconService>(TYPES.IIconService);
    this.controlService = sceneContainer.get<IControlService>(
      TYPES.IControlService,
    );
    this.map = this.mapService.map; // 暴露原生map方法
  }

  public getMapService(): IMapService {
    return this.mapService;
    //
  }

  public addLayer(layer: ILayer): void {
    this.sceneService.addLayer(layer);
  }

  public render(): void {
    this.sceneService.render();
  }

  // asset method
  public addImage(id: string, img: IImage) {
    this.iconService.addImage(id, img);
  }

  public hasImage(id: string) {
    this.iconService.hasImage(id);
  }

  public removeImage(id: string) {
    this.iconService.removeImage(id);
  }

  // map control method
  public addControl(ctr: IControl) {
    this.controlService.addControl(ctr, this.mapService);
  }

  public removeControl(ctr: IControl) {
    this.controlService.removeControl(ctr);
  }

  // marker
  public addMarker(marker: IMarker) {
    marker.addTo(this);
  }

  public on(type: string, handle: (...args: any[]) => void): void {
    SceneEventList.indexOf(type) === -1
      ? this.mapService.on(type, handle)
      : this.sceneService.on(type, handle);
  }

  public off(type: string, handle: (...args: any[]) => void): void {
    SceneEventList.indexOf(type) === -1
      ? this.mapService.off(type, handle)
      : this.sceneService.off(type, handle);
  }

  // map method

  public getZoom(): number {
    return this.mapService.getZoom();
  }

  public getCenter(): ILngLat {
    return this.mapService.getCenter();
  }

  public getPitch(): number {
    return this.mapService.getPitch();
  }

  public getRotation(): number {
    return this.mapService.getRotation();
  }

  public getBounds(): Bounds {
    return this.mapService.getBounds();
  }

  // set Map status

  public setRotation(rotation: number): void {
    this.mapService.setRotation(rotation);
  }
  public zoomIn(): void {
    this.mapService.zoomIn();
  }

  public zoomOut(): void {
    this.mapService.zoomOut();
  }

  public panTo(p: Point): void {
    this.mapService.panTo(p);
  }

  public panBy(pixel: Point): void {
    this.mapService.panTo(pixel);
  }

  public fitBounds(bound: Bounds): void {
    this.mapService.fitBounds(bound);
  }

  public setZoomAndCenter(zoom: number, center: Point): void {
    this.mapService.setZoomAndCenter(zoom, center);
  }

  public setMapStyle(style: string): void {
    this.mapService.setMapStyle(style);
  }

  // conversion Method
  public pixelToLngLat(pixel: Point): ILngLat {
    return this.mapService.pixelToLngLat(pixel);
  }

  public lngLatToPixel(lnglat: Point): IPoint {
    return this.mapService.lngLatToPixel(lnglat);
  }

  public containerToLngLat(pixel: Point): ILngLat {
    return this.mapService.containerToLngLat(pixel);
  }

  public lngLatToContainer(lnglat: Point): IPoint {
    return this.mapService.lngLatToContainer(lnglat);
  }

  public destroy() {
    this.sceneService.destroy();
    // TODO: 清理其他 Service 例如 IconService
  }

  // 资源管理
}

export { Scene };
