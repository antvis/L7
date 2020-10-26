import { injectable } from 'inversify';
import { ILayer } from '../../layer/ILayerService';
import { PassType } from '../IMultiPassRenderer';
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
    const { useFramebuffer, clear } = this.rendererService;
    // const readFBO = layer.multiPassRenderer.getPostProcessor().getReadFBO();
    useFramebuffer(null, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        // framebuffer: readFBO,
      });

      // render to post processor
      layer.multiPassRenderer.setRenderFlag(false);
      layer.render();
      layer.multiPassRenderer.setRenderFlag(true);
    });
  }
}
