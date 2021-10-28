import {
  IGlobalConfigService,
  IMapConfig,
  IMapService,
  IMapWrapper,
  lazyInject,
  TYPES,
} from '@antv/l7-core';
import { Container } from 'inversify';
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
    hasBaseMap?: boolean,
  ) {
    // // 首先使用全局配置服务校验地图参数
    // const { valid, errorText } = this.configService.validateMapConfig(
    //   this.config,
    // );

    // if (!valid) {
    //   this.logger.error(errorText || '');
    //   return;
    // }
    // 绑定用户传入的原始地图参数
    sceneContainer.bind<Partial<IMapConfig>>(TYPES.MapConfig).toConstantValue({
      ...this.config,
      id,
      canvas,
      hasBaseMap,
    });
    sceneContainer
      .bind<IMapService<RawMap>>(TYPES.IMapService)
      .to(this.getServiceConstructor())
      .inSingletonScope();
  }

  protected getServiceConstructor(): new (...args: any[]) => IMapService<
    RawMap
  > {
    throw new Error('Method not implemented.');
  }
}
