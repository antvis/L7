import type {
  IGlobalConfigService,
  IMapConfig,
  IMapService,
  IMapWrapper,
  L7Container,
} from '@antv/l7-core';
export default class BaseMapWrapper<RawMap> implements IMapWrapper {
  protected configService: IGlobalConfigService;

  protected config: Partial<IMapConfig>;

  constructor(config: Partial<IMapConfig>) {
    this.config = config;
  }

  public setContainer(
    sceneContainer: L7Container,
    id: string | HTMLDivElement,
    canvas?: HTMLCanvasElement,
  ) {
    this.configService = sceneContainer.globalConfigService;
    sceneContainer.mapConfig = {
      ...this.config,
      id,
      canvas,
    };
    // @ts-ignore
    sceneContainer.mapService = new (this.getServiceConstructor())(sceneContainer);
  }

  protected getServiceConstructor(): new (...args: any[]) => IMapService<RawMap> {
    throw new Error('Method not implemented.');
  }
}
