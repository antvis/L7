import { Logo } from '@antv/l7-component';
import {
  Bounds,
  createLayerContainer,
  createSceneContainer,
  IControl,
  IControlService,
  IIconService,
  IImage,
  ILayer,
  ILayerService,
  ILngLat,
  IMapService,
  IMarker,
  IPoint,
  IPostProcessingPass,
  IRendererService,
  ISceneConfig,
  ISceneService,
  Point,
  SceneEventList,
  TYPES,
} from '@antv/l7-core';
import { ReglRendererService } from '@antv/l7-renderer';
import { Container } from 'inversify';
import ILayerManager from './ILayerManager';
import IMapController from './IMapController';
import IPostProcessingPassPluggable from './IPostProcessingPassPluggable';

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
 *
 */
class Scene
  implements IPostProcessingPassPluggable, IMapController, ILayerManager {
  private sceneService: ISceneService;
  private mapService: IMapService<unknown>;
  private controlService: IControlService;
  private layerService: ILayerService;
  private iconService: IIconService;

  private container: Container;

  public constructor(config: ISceneConfig) {
    const { id, map } = config;

    // 创建场景容器
    const sceneContainer = createSceneContainer();
    this.container = sceneContainer;

    // 绑定地图服务
    map.setContainer(sceneContainer, id);

    // 绑定渲染引擎服务
    sceneContainer
      .bind<IRendererService>(TYPES.IRendererService)
      .to(ReglRendererService)
      .inSingletonScope();

    // 依赖注入
    this.sceneService = sceneContainer.get<ISceneService>(TYPES.ISceneService);
    this.mapService = sceneContainer.get<IMapService<unknown>>(
      TYPES.IMapService,
    );
    this.iconService = sceneContainer.get<IIconService>(TYPES.IIconService);
    this.controlService = sceneContainer.get<IControlService>(
      TYPES.IControlService,
    );
    this.layerService = sceneContainer.get<ILayerService>(TYPES.ILayerService);

    // 初始化 scene
    this.sceneService.init(config);
    // TODO: 初始化组件
    this.addControl(new Logo());
  }

  public getMapService(): IMapService<unknown> {
    return this.mapService;
  }

  public get map() {
    return this.mapService.map;
  }

  public addLayer(layer: ILayer): void {
    // 为当前图层创建一个容器
    const layerContainer = createLayerContainer(this.container);
    layer.setContainer(layerContainer);
    this.sceneService.addLayer(layer);
  }

  public getLayers(): ILayer[] {
    return this.layerService.getLayers();
  }

  public getLayer(id: string): ILayer | undefined {
    return this.layerService.getLayer(id);
  }

  public removeLayer(layer: ILayer): void {
    this.layerService.remove(layer);
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
    this.controlService.addControl(ctr, this.container);
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

  // implements IMapController

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

  public registerPostProcessingPass(
    constructor: new (...args: any[]) => IPostProcessingPass<unknown>,
    name: string,
  ) {
    this.container
      .bind<IPostProcessingPass<unknown>>(TYPES.IPostProcessingPass)
      .to(constructor)
      .whenTargetNamed(name);
  }

  // 资源管理
}

export { Scene };
