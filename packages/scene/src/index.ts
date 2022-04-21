import { Logo } from '@antv/l7-component';
import {
  Bounds,
  createLayerContainer,
  createSceneContainer,
  ICameraOptions,
  IControl,
  IControlService,
  IFontService,
  IIconFontGlyph,
  IIconService,
  IImage,
  IInteractionService,
  ILayer,
  ILayerService,
  ILngLat,
  IMapService,
  IMarker,
  IMarkerLayer,
  IMarkerService,
  IPoint,
  IPopup,
  IPopupService,
  IPostProcessingPass,
  IRendererService,
  ISceneConfig,
  ISceneService,
  IStatusOptions,
  Point,
  SceneEventList,
  TYPES,
} from '@antv/l7-core';
import { MaskLayer } from '@antv/l7-layers';
import { ReglRendererService } from '@antv/l7-renderer';
import { DOM, isMini } from '@antv/l7-utils';
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
  private markerService: IMarkerService;
  private popupService: IPopupService;
  private fontService: IFontService;
  private interactionService: IInteractionService;
  private container: Container;

  public constructor(config: ISceneConfig) {
    const { id, map, canvas, hasBaseMap } = config;
    // 创建场景容器
    const sceneContainer = createSceneContainer();
    this.container = sceneContainer;
    // 绑定地图服务
    map.setContainer(sceneContainer, id, canvas, hasBaseMap);

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
    this.fontService = sceneContainer.get<IFontService>(TYPES.IFontService);
    this.controlService = sceneContainer.get<IControlService>(
      TYPES.IControlService,
    );
    this.layerService = sceneContainer.get<ILayerService>(TYPES.ILayerService);

    this.markerService = sceneContainer.get<IMarkerService>(
      TYPES.IMarkerService,
    );
    this.interactionService = sceneContainer.get<IInteractionService>(
      TYPES.IInteractionService,
    );
    this.popupService = sceneContainer.get<IPopupService>(TYPES.IPopupService);

    if (isMini) {
      this.sceneService.initMiniScene(config);
    } else {
      this.initComponent(id);

      // 初始化 scene
      this.sceneService.init(config);
      // TODO: 初始化组件

      this.initControl();
    }
  }

  public get map() {
    return this.mapService.map;
  }

  public get loaded() {
    return this.sceneService.loaded;
  }

  public getServiceContainer(): Container {
    return this.container;
  }
  public getSize(): [number, number] {
    return this.mapService.getSize();
  }
  public getMinZoom(): number {
    return this.mapService.getMinZoom();
  }
  public getMaxZoom(): number {
    return this.mapService.getMaxZoom();
  }
  public getType(): string {
    return this.mapService.getType();
  }
  public getMapContainer(): HTMLElement | null {
    return this.mapService.getMapContainer();
  }
  public getMapCanvasContainer(): HTMLElement {
    return this.mapService.getMapCanvasContainer() as HTMLElement;
  }

  public getMapService(): IMapService<unknown> {
    return this.mapService;
  }
  public exportPng(type?: 'png' | 'jpg'): string {
    return this.sceneService.exportPng(type);
  }

  public exportMap(type?: 'png' | 'jpg'): string {
    return this.sceneService.exportPng(type);
  }

  public registerRenderService(render: any) {
    if (this.sceneService.loaded) {
      const renderSerivce = new render(this);
      renderSerivce.init();
    } else {
      this.on('loaded', () => {
        const renderSerivce = new render(this);
        renderSerivce.init();
      });
    }
  }

  public setBgColor(color: string) {
    this.mapService.setBgColor(color);
  }

  // layer 管理
  public addLayer(layer: ILayer): void {
    // 为当前图层创建一个容器
    // TODO: 初始化的时候设置 容器
    const layerContainer = createLayerContainer(this.container);
    layer.setContainer(layerContainer, this.container);
    this.sceneService.addLayer(layer);

    const layerConfig = layer.getLayerConfig();
    if (layerConfig) {
      // 若 layer 未初始化成功，则 layerConfig 为 undefined （scene loaded 尚未执行完成）
      const {
        mask,
        maskfence,
        maskColor = '#000',
        maskOpacity = 0,
      } = layerConfig;
      if (mask && maskfence) {
        const maskInstance = new MaskLayer()
          .source(maskfence)
          .shape('fill')
          .color(maskColor)
          .style({
            opacity: maskOpacity,
          });

        this.addMask(maskInstance, layer.id);
      }
    } else {
      console.warn('addLayer should run after scene loaded!');
    }
  }

  public addMask(mask: ILayer, layerId: string) {
    const parent = this.getLayer(layerId);
    if (parent) {
      const layerContainer = createLayerContainer(this.container);
      mask.setContainer(layerContainer, this.container);
      parent.addMaskLayer(mask);
      this.sceneService.addLayer(mask);
    } else {
      console.warn('parent layer not find!');
    }
  }

  public getPickedLayer() {
    return this.layerService.pickedLayerId;
  }

  public getLayers(): ILayer[] {
    return this.layerService.getLayers();
  }

  public getLayer(id: string): ILayer | undefined {
    return this.layerService.getLayer(id);
  }

  public getLayerByName(name: string): ILayer | undefined {
    return this.layerService.getLayerByName(name);
  }

  public removeLayer(layer: ILayer, parentLayer?: ILayer): void {
    this.layerService.remove(layer, parentLayer);
  }

  public removeAllLayer(): void {
    this.layerService.removeAllLayers();
  }

  public render(): void {
    this.sceneService.render();
  }

  public setEnableRender(flag: boolean) {
    this.layerService.setEnableRender(flag);
  }

  // asset method
  /**
   * 为 layer/point/text 支持 iconfont 模式支持
   * @param fontUnicode
   * @param name
   */
  public addIconFont(name: string, fontUnicode: string): void {
    this.fontService.addIconFont(name, fontUnicode);
  }

  public addIconFonts(options: string[][]): void {
    options.forEach(([name, fontUnicode]) => {
      this.fontService.addIconFont(name, fontUnicode);
    });
  }
  /**
   * 用户自定义添加第三方字体
   * @param fontFamily
   * @param fontPath
   */
  public addFontFace(fontFamily: string, fontPath: string): void {
    this.sceneService.addFontFace(fontFamily, fontPath);
  }

  public addImage(id: string, img: IImage) {
    if (!isMini) {
      this.iconService.addImage(id, img);
    } else {
      this.iconService.addImageMini(id, img, this.sceneService);
    }
    // this.iconService.addImage(id, img);
  }

  public hasImage(id: string) {
    return this.iconService.hasImage(id);
  }

  public removeImage(id: string) {
    this.iconService.removeImage(id);
  }

  public addIconFontGlyphs(fontFamily: string, glyphs: IIconFontGlyph[]) {
    this.fontService.addIconGlyphs(glyphs);
  }

  // map control method
  public addControl(ctr: IControl) {
    this.controlService.addControl(ctr, this.container);
  }

  public removeControl(ctr: IControl) {
    this.controlService.removeControl(ctr);
  }

  public getControlByName(name: string) {
    return this.controlService.getControlByName(name);
  }

  // marker
  public addMarker(marker: IMarker) {
    this.markerService.addMarker(marker);
  }

  public addMarkerLayer(layer: IMarkerLayer) {
    this.markerService.addMarkerLayer(layer);
  }

  public removeMarkerLayer(layer: IMarkerLayer) {
    this.markerService.removeMarkerLayer(layer);
  }

  public removeAllMakers() {
    this.markerService.removeAllMarkers();
  }

  public addPopup(popup: IPopup) {
    this.popupService.addPopup(popup);
  }

  public on(type: string, handle: (...args: any[]) => void): void {
    SceneEventList.indexOf(type) === -1
      ? this.mapService.on(type, handle)
      : this.sceneService.on(type, handle);
  }

  public once(type: string, handle: (...args: any[]) => void): void {
    SceneEventList.indexOf(type) === -1
      ? this.mapService.once(type, handle)
      : this.sceneService.once(type, handle);
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

  public getCenter(options?: ICameraOptions): ILngLat {
    return this.mapService.getCenter(options);
  }

  public setCenter(center: [number, number], options?: ICameraOptions) {
    return this.mapService.setCenter(center, options);
  }

  public getPitch(): number {
    return this.mapService.getPitch();
  }

  public setPitch(pitch: number) {
    return this.mapService.setPitch(pitch);
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

  public panBy(x: number, y: number): void {
    this.mapService.panBy(x, y);
  }

  public getContainer() {
    return this.mapService.getContainer();
  }
  public setZoom(zoom: number): void {
    this.mapService.setZoom(zoom);
  }
  public fitBounds(bound: Bounds, options?: unknown): void {
    const { fitBoundsOptions, animate } = this.sceneService.getSceneConfig();
    this.mapService.fitBounds(
      bound,
      // 选项优先级：用户传入，覆盖animate直接配置，覆盖Scene配置项传入
      options || {
        ...(fitBoundsOptions as object),
        animate,
      },
    );
  }

  public setZoomAndCenter(zoom: number, center: Point): void {
    this.mapService.setZoomAndCenter(zoom, center);
  }

  public setMapStyle(style: any): void {
    this.mapService.setMapStyle(style);
  }

  public setMapStatus(options: Partial<IStatusOptions>) {
    this.mapService.setMapStatus(options);
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

  // 控制 shader pick 计算
  public enableShaderPick() {
    this.layerService.enableShaderPick();
  }

  public diasbleShaderPick() {
    this.layerService.disableShaderPick();
  }

  // get current point size info
  public getPointSizeRange() {
    return this.sceneService.getPointSizeRange();
  }

  private initComponent(id: string | HTMLDivElement) {
    this.controlService.init(
      {
        container: DOM.getContainer(id),
      },
      this.container,
    );
    this.markerService.init(this.container);
    this.popupService.init(this.container);
  }

  private initControl() {
    const { logoVisible, logoPosition } = this.sceneService.getSceneConfig();
    if (logoVisible) {
      this.addControl(new Logo({ position: logoPosition }));
    }
  }
}

export { Scene };
