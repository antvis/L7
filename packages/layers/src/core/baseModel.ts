import {
  AttributeType,
  gl,
  IEncodeFeature,
  IFontService,
  IGlobalConfigService,
  IIconService,
  ILayer,
  ILayerModel,
  ILayerPlugin,
  ILogService,
  IMapService,
  IModel,
  IModelUniform,
  IRendererService,
  IStyleAttributeService,
  lazyInject,
  TYPES,
} from '@l7/core';

export default class BaseModel implements ILayerModel {
  protected layer: ILayer;

  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.IIconService)
  protected readonly iconService: IIconService;

  @lazyInject(TYPES.IFontService)
  protected readonly fontService: IFontService;

  @lazyInject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  @lazyInject(TYPES.IMapService)
  protected readonly map: IMapService;

  constructor(layer: ILayer) {
    this.layer = layer;
    this.registerBuiltinAttributes();
  }

  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public buildModels(): IModel[] {
    throw new Error('Method not implemented.');
  }

  protected registerBuiltinAttributes() {
    throw new Error('Method not implemented.');
  }
}
