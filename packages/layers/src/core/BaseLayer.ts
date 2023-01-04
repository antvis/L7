import {
  CameraUniform,
  CoordinateUniform,
  ICameraService,
  ICoordinateSystemService,
  IDataState,
  IGlobalConfigService,
  IInteractionService,
  ILayer,
  ILayerConfig,
  ILayerModel,
  ILayerService,
  IMapService,
  IModel,
  IRendererService,
  LayerEventType,
  lazyInject,
  Triangulation,
  TYPES,
} from '@antv/l7-core';

import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';

/**
 * 分配 layer id
 */
let layerIdCounter = 0;

export default class BaseLayer<ChildLayerStyleOptions = {}>
  extends EventEmitter<LayerEventType>
  implements ILayer
{
  public id: string = `${layerIdCounter++}`;
  public name: string = `${layerIdCounter}`;
  public parent: ILayer;
  public coordCenter: number[];
  public type: string;
  public visible: boolean = true;
  public zIndex: number = 0;
  public minZoom: number;
  public maxZoom: number;
  public inited: boolean = false;
  public layerModelNeedUpdate: boolean = false;
  public pickedFeatureID: number | null = null;
  public selectedFeatureID: number | null = null;
  public styleNeedUpdate: boolean = false;
  public rendering: boolean;
  public forceRender: boolean = false;
  public clusterZoom: number = 0; // 聚合等级标记
  public layerType?: string | undefined;
  public triangulation?: Triangulation | undefined;

  public dataState: IDataState = {
    dataSourceNeedUpdate: false,
    dataMappingNeedUpdate: false,
    filterNeedUpdate: false,
    featureScaleNeedUpdate: false,
    StyleAttrNeedUpdate: false,
  };

  // 待渲染 model 列表
  public models: IModel[] = [];

  // 注入插件集

  public startInit: boolean = false;

  public layerModel: ILayerModel;

  public shapeOption: {
    field: any;
    values: any;
  };

  public sceneContainer: Container | undefined;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  protected cameraService: ICameraService;

  protected coordinateService: ICoordinateSystemService;

  protected coordinateSystemService: ICoordinateSystemService;

  protected rendererService: IRendererService;

  protected layerService: ILayerService;

  protected interactionService: IInteractionService;

  protected mapService: IMapService;

  protected container: Container;

  protected rawConfig: Partial<ILayerConfig & ChildLayerStyleOptions>;

  constructor(config: Partial<ILayerConfig & ChildLayerStyleOptions> = {}) {
    super();
    this.name = config.name || this.id;
    this.zIndex = config.zIndex || 0;
    this.rawConfig = config;
  }

  public getLayerConfig<T = any>() {
    return this.configService.getLayerConfig<ChildLayerStyleOptions & T>(
      this.id,
    );
  }

  public setContainer(container: Container, sceneContainer: Container) {
    this.container = container;
    this.sceneContainer = sceneContainer;
  }

  public getContainer() {
    return this.container;
  }

  public async init(): Promise<void> {
    // 设置配置项
    const sceneId = this.container.get<string>(TYPES.SceneID);
    this.startInit = true;

    this.configService.setLayerConfig(sceneId, this.id, this.rawConfig);
    this.layerType = this.rawConfig.layerType;

    this.rendererService = this.container.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = this.container.get<ILayerService>(TYPES.ILayerService);
    this.interactionService = this.container.get<IInteractionService>(
      TYPES.IInteractionService,
    );

    this.mapService = this.container.get<IMapService>(TYPES.IMapService);

    this.cameraService = this.container.get<ICameraService>(
      TYPES.ICameraService,
    );
    this.coordinateService = this.container.get<ICoordinateSystemService>(
      TYPES.ICoordinateSystemService,
    );

    this.coordinateSystemService = this.container.get<ICoordinateSystemService>(
      TYPES.ICoordinateSystemService,
    );

    this.buildModels();
    this.inited = true;
  }

  public render(): ILayer {
    this.updateUniform();

    this.models.forEach((model) => {
      model.draw({ uniforms: {} });
    });
    return this;
  }

  public updateUniform() {
    // 重新计算坐标系参数
    this.coordinateSystemService.refresh();
    const { width: w, height: h } = this.mapService
      .getMapCanvasContainer()
      .getBoundingClientRect();
    const width = w * window.devicePixelRatio;
    const height = h * window.devicePixelRatio;

    this.models.forEach((model) => {
      model.addUniforms({
        // 相机参数，包含 VP 矩阵、缩放等级
        [CameraUniform.ProjectionMatrix]:
          this.cameraService.getProjectionMatrix(),
        [CameraUniform.ViewMatrix]: this.cameraService.getViewMatrix(),
        [CameraUniform.ViewProjectionMatrix]:
          this.cameraService.getViewProjectionMatrix(),
        [CameraUniform.Zoom]: this.cameraService.getZoom(),
        [CameraUniform.ZoomScale]: this.cameraService.getZoomScale(),
        [CoordinateUniform.CoordinateSystem]:
          this.coordinateSystemService.getCoordinateSystem(),
        [CoordinateUniform.ViewportCenter]:
          this.coordinateSystemService.getViewportCenter(),
        [CoordinateUniform.ViewportCenterProjection]:
          this.coordinateSystemService.getViewportCenterProjection(),
        [CoordinateUniform.PixelsPerDegree]:
          this.coordinateSystemService.getPixelsPerDegree(),
        [CoordinateUniform.PixelsPerDegree2]:
          this.coordinateSystemService.getPixelsPerDegree2(),
        [CoordinateUniform.PixelsPerMeter]:
          this.coordinateSystemService.getPixelsPerMeter(),
        u_SceneCenterMKT: [0, 0],
        u_ViewportSize: [width, height],
        u_ModelMatrix: this.cameraService.getModelMatrix(),
      });
    });
  }

  public destroy(refresh = true) {
    // Tip: 清除各个图层自定义的 models 资源
    this.layerModel?.clearModels(refresh);

    this.models = [];

    this.removeAllListeners();
    // 解绑图层容器中的服务
  }
  public clear() {
    // 销毁所有 model
  }
  public clearModels() {
    this.models.forEach((model) => model.destroy());
    this.layerModel?.clearModels();
    this.models = [];
  }

  public getTime() {
    return this.layerService.clock.getDelta();
  }

  public async buildModels() {
    throw new Error('Method not implemented.');
  }

  protected getDefaultConfig() {
    return {};
  }

  protected async initLayerModels() {
    this.models.forEach((model) => model.destroy());
    this.models = [];
    this.models = await this.layerModel.initModels();
  }
}
