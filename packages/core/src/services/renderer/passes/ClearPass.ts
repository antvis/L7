import type { ILayer } from '../../layer/ILayerService';
import BaseNormalPass from './BaseNormalPass';

/**
 * ClearPass
 */
export default class ClearPass<
  InitializationOptions = {},
> extends BaseNormalPass<InitializationOptions> {
  public getName() {
    return 'clear';
  }

  public init(layer: ILayer, config?: Partial<InitializationOptions>) {
    super.init(layer, config);
  }

  public render() {
    this.rendererService.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      framebuffer: null,
    });
  }
}
