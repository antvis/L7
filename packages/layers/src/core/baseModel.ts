import {
  ICameraService,
  IFontService,
  IGlobalConfigService,
  IIconService,
  ILayer,
  ILayerModel,
  IMapService,
  IModel,
  IModelUniform,
  IRendererService,
  IShaderModuleService,
  IStyleAttributeService,
  lazyInject,
  TYPES,
} from '@antv/l7-core';

export default class BaseModel implements ILayerModel {
  protected layer: ILayer;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IIconService)
  protected readonly iconService: IIconService;

  @lazyInject(TYPES.IFontService)
  protected readonly fontService: IFontService;

  @lazyInject(TYPES.IShaderModuleService)
  protected readonly shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;
  protected styleAttributeService: IStyleAttributeService;
  protected mapService: IMapService;
  protected cameraService: ICameraService;

  constructor(layer: ILayer) {
    this.layer = layer;
    this.rendererService = layer
      .getContainer()
      .get<IRendererService>(TYPES.IRendererService);
    this.styleAttributeService = layer
      .getContainer()
      .get<IStyleAttributeService>(TYPES.IStyleAttributeService);
    this.mapService = layer.getContainer().get<IMapService>(TYPES.IMapService);
    this.cameraService = layer
      .getContainer()
      .get<ICameraService>(TYPES.ICameraService);
    this.registerBuiltinAttributes();
  }

  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public buildModels(): IModel[] {
    throw new Error('Method not implemented.');
  }

  public render() {
    throw new Error('Method not implemented.');
  }
  protected registerBuiltinAttributes() {
    throw new Error('Method not implemented.');
  }
}
