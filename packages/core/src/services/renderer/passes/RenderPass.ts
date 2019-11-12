import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { ILayer } from '../../layer/ILayerService';
import { IPass, PassType } from '../IMultiPassRenderer';
import { IRendererService } from '../IRendererService';

/**
 * RenderPass，负责输出到后续 PostProcessor 的 readFBO 中
 */
@injectable()
export default class RenderPass<InitializationOptions = {}>
  implements IPass<InitializationOptions> {
  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  public getType() {
    return PassType.Normal;
  }

  public getName() {
    return 'render';
  }

  public init(layer: ILayer) {
    //
  }

  public render(layer: ILayer) {
    const { useFramebuffer, clear } = this.rendererService;
    const readFBO = layer.multiPassRenderer.getPostProcessor().getReadFBO();
    useFramebuffer(readFBO, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: readFBO,
      });

      // render to post processor
      layer.multiPassRenderer.setRenderFlag(false);
      layer.render();
      layer.multiPassRenderer.setRenderFlag(true);
    });
  }
}
