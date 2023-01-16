import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILayer } from '../../layer/ILayerService';
import BaseNormalPass from './BaseNormalPass';

/**
 * RenderPass，负责输出到后续 PostProcessor 的 readFBO 中
 */
@injectable()
export default class RenderPass<
  InitializationOptions = {}
> extends BaseNormalPass<InitializationOptions> {
  public getType() {
    return PassType.Normal;
  }

  public getName() {
    return 'render';
  }

  public init(layer: ILayer, config?: Partial<InitializationOptions>) {
    super.init(layer, config);
  }

  public render(layer: ILayer) {
  
  }
}
