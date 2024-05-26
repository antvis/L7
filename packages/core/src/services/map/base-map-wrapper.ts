import type { L7Container } from '../../inversify.config';
import type { IGlobalConfigService } from '../config/IConfigService';
import type { IMapConfig, IMapWrapper } from './IMapService';
import type { BaseMapService } from './base-map';

/**
 * BaseMapWrapper
 */
export class BaseMapWrapper<RawMap> implements IMapWrapper {
  protected configService: IGlobalConfigService;

  protected config: Partial<IMapConfig>;

  constructor(config: Partial<IMapConfig>) {
    this.config = config;
  }

  public setContainer(sceneContainer: L7Container, id: string | HTMLDivElement) {
    this.configService = sceneContainer.globalConfigService;
    sceneContainer.mapConfig = {
      ...this.config,
      id,
    };
    // @ts-ignore
    sceneContainer.mapService = new (this.getServiceConstructor())(sceneContainer);
  }

  protected getServiceConstructor(): new (...args: any[]) => BaseMapService<RawMap> {
    throw new Error('Method not implemented.');
  }
}
