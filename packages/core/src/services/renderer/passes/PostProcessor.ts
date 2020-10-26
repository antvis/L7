import { inject, injectable, postConstruct } from 'inversify';
import { TYPES } from '../../../types';
import { ILayer } from '../../layer/ILayerService';
import { gl } from '../gl';
import { IFramebuffer } from '../IFramebuffer';
import { IPostProcessingPass, IPostProcessor } from '../IMultiPassRenderer';
import { IRendererService } from '../IRendererService';

/**
 * ported from Three.js EffectComposer
 * 后处理负责 pingpong read/write framebuffer，最后一个 pass 默认输出到屏幕
 */
@injectable()
export default class PostProcessor implements IPostProcessor {
  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  private passes: Array<IPostProcessingPass<unknown>> = [];
  private readFBO: IFramebuffer;
  private writeFBO: IFramebuffer;

  public getReadFBO() {
    return this.readFBO;
  }

  public getWriteFBO() {
    return this.writeFBO;
  }

  public async render(layer: ILayer) {
    for (let i = 0; i < this.passes.length; i++) {
      const pass = this.passes[i];
      // last pass should render to screen
      pass.setRenderToScreen(this.isLastEnabledPass(i));
      await pass.render(layer);

      // pingpong
      if (i !== this.passes.length - 1) {
        this.swap();
      }
    }
  }

  public resize(width: number, height: number) {
    this.readFBO.resize({
      width,
      height,
    });
    this.writeFBO.resize({
      width,
      height,
    });
  }

  public add<T>(
    pass: IPostProcessingPass<T>,
    layer: ILayer,
    config?: Partial<T>,
  ) {
    pass.init(layer, config);
    this.passes.push(pass);
  }

  public insert<T>(
    pass: IPostProcessingPass<T>,
    index: number,
    layer: ILayer,
    config?: Partial<T>,
  ) {
    pass.init(layer, config);
    this.passes.splice(index, 0, pass);
  }

  public getPostProcessingPassByName(
    name: string,
  ): IPostProcessingPass<unknown> | undefined {
    return this.passes.find((p) => p.getName() === name);
  }

  @postConstruct()
  private init() {
    // const { createFramebuffer, createTexture2D } = this.rendererService;
    // this.readFBO = createFramebuffer({
    //   color: createTexture2D({
    //     width: 1,
    //     height: 1,
    //     wrapS: gl.CLAMP_TO_EDGE,
    //     wrapT: gl.CLAMP_TO_EDGE,
    //   }),
    // });
    // this.writeFBO = createFramebuffer({
    //   color: createTexture2D({
    //     width: 1,
    //     height: 1,
    //     wrapS: gl.CLAMP_TO_EDGE,
    //     wrapT: gl.CLAMP_TO_EDGE,
    //   }),
    // });
  }

  private isLastEnabledPass(index: number): boolean {
    for (let i = index + 1; i < this.passes.length; i++) {
      if (this.passes[i].isEnabled()) {
        return false;
      }
    }
    return true;
  }

  private swap() {
    const tmp = this.readFBO;
    this.readFBO = this.writeFBO;
    this.writeFBO = tmp;
  }
}
