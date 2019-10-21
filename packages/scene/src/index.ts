import {
  Bounds,
  container,
  IconService,
  IIconService,
  IImage,
  ILayer,
  ILngLat,
  IMapConfig,
  IMapService,
  IPoint,
  IRenderConfig,
  IRendererService,
  ISceneService,
  MapType,
  Point,
  SceneService,
  TYPES,
} from '@l7/core';
import { AMapService, MapboxService } from '@l7/maps';
import { ReglRendererService } from '@l7/renderer';
import { inject, injectable } from 'inversify';

// 绑定渲染引擎服务
container
  .bind<IRendererService>(TYPES.IRendererService)
  .to(ReglRendererService)
  .inSingletonScope();
/**
 * 暴露 Scene API
 *
 * @example
 * import { Scene } from '@l7/scene';
 * import { PointLayer } from '@l7/layers';
 *
 * const scene = new Scene();
 * const pointLayer = new PointLayer();
 * scene.addLayer(pointLayer);
 * scene.render();
 */
class Scene {
  @inject(TYPES.IIconService)
  protected readonly iconService: IIconService;
  private sceneService: ISceneService;
  private mapService: IMapService;
  public constructor(config: IMapConfig & IRenderConfig) {
    const { type = MapType.amap } = config;

    // 根据用户传入参数绑定地图服务
    let mapService: new (...args: any[]) => IMapService;
    if (type === MapType.mapbox) {
      mapService = MapboxService;
    } else if (type === MapType.amap) {
      mapService = AMapService;
    } else {
      throw new Error('不支持的地图服务');
    }
    // this.mapService = mapService;
    // DEMO 中切换底图实现时，需要重新绑定底图服务
    // @see https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#containerrebindserviceidentifier-serviceidentifier
    if (container.isBound(TYPES.IMapService)) {
      container
        .rebind<IMapService>(TYPES.IMapService)
        .to(mapService)
        .inSingletonScope();
    } else {
      container
        .bind<IMapService>(TYPES.IMapService)
        .to(mapService)
        .inSingletonScope();
    }

    // 依赖注入
    this.sceneService = container.resolve(SceneService);
    this.sceneService.init(config);
    this.mapService = container.get<IMapService>(TYPES.IMapService);
    this.iconService = container.get<IIconService>(TYPES.IIconService);
  }

  public addLayer(layer: ILayer): void {
    this.sceneService.addLayer(layer);
  }

  public render(): void {
    this.sceneService.render();
  }
  // asset method
  public addImage(id: string, img: IImage) {
    // this.sceneService.
    this.iconService.addImage(id, img);
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
  }

  // 资源管理
}

export { Scene };
