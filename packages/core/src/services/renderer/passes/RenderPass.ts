import { inject, injectable } from 'inversify';
import { ILayer, ILayerService } from '../../layer/ILayerService';
import { IPass, PassType } from '../IMultiPassRenderer';

/**
 * RenderPass，负责输出到后续 PostProcessor 的 readFBO 中
 */
@injectable()
export default class RenderPass implements IPass {
  public getType() {
    return PassType.Normal;
  }

  public init(layer: ILayer) {
    //
  }

  public render(layer: ILayer) {
    layer.multiPassRenderer.getPostProcessor().renderToPostProcessor(() => {
      // render to post processor
      layer.multiPassRenderer.setRenderFlag(false);
      layer.render();
      layer.multiPassRenderer.setRenderFlag(true);
    });
  }
}
