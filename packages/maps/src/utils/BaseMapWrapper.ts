import type {
  IGlobalConfigService,
  IMapConfig,
  IMapService,
  IMapWrapper} from '@antv/l7-core';
import {
  lazyInject,
  TYPES,
} from '@antv/l7-core';
import type { Container } from 'inversify';
export default class BaseMapWrapper<RawMap> implements IMapWrapper {
  @lazyInject(TYPES.IGlobalConfigService)
  protected readonly configService: IGlobalConfigService;

  protected config: Partial<IMapConfig>;

  constructor(config: Partial<IMapConfig>) {
    this.config = config;
  }

  public setContainer(
    sceneContainer: Container,
    id: string | HTMLDivElement,
    canvas?: HTMLCanvasElement,
  ) {
    // 绑定用户传入的原始地图参数
    sceneContainer.bind<Partial<IMapConfig>>(TYPES.MapConfig).toConstantValue({
      ...this.config,
      id,
      canvas,
    });
    sceneContainer
      .bind<IMapService<RawMap>>(TYPES.IMapService)
      .to(this.getServiceConstructor())
      .inSingletonScope();
  }

  protected getServiceConstructor(): new (
    ...args: any[]
  ) => IMapService<RawMap> {
    throw new Error('Method not implemented.');
  }
}
