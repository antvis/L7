import { inject, injectable } from 'inversify';
import { lazyInject } from '../../../index';
import { TYPES } from '../../../types';
import { ILayer, ILayerService } from '../../layer/ILayerService';
import { gl } from '../gl';
import { IFramebuffer } from '../IFramebuffer';
import { IPass, PassType } from '../IMultiPassRenderer';
import { IRendererService } from '../IRendererService';

/**
 * PixelPickingPass based on
 */
@injectable()
export default class PixelPickingPass implements IPass {
  @lazyInject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  private pickingFBO: IFramebuffer;

  public getType() {
    return PassType.Normal;
  }

  public init(layer: ILayer) {
    const { createTexture2D, createFramebuffer } = this.rendererService;
    this.pickingFBO = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });
  }

  public render(layer: ILayer) {
    const { getViewportSize, renderToFramebuffer } = this.rendererService;
    this.pickingFBO.resize(getViewportSize());

    renderToFramebuffer(this.pickingFBO, () => {
      layer.multiPassRenderer.setRenderFlag(false);
      layer.render();
      layer.multiPassRenderer.setRenderFlag(true);
    });
  }
}
