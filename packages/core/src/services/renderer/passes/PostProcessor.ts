import type { ILayer } from '../../layer/ILayerService';
import type { IFramebuffer } from '../IFramebuffer';
import type { IPostProcessingPass, IPostProcessor } from '../IMultiPassRenderer';
import type { IRendererService } from '../IRendererService';
import type { ITexture2D } from '../ITexture2D';
import { TextureUsage } from '../ITexture2D';
import { gl } from '../gl';

/**
 * ported from Three.js EffectComposer
 * 后处理负责 pingpong read/write framebuffer，最后一个 pass 默认输出到屏幕
 */
export default class PostProcessor implements IPostProcessor {
  constructor(protected readonly rendererService: IRendererService) {
    this.init();
  }

  private passes: Array<IPostProcessingPass<unknown>> = [];
  private readFBO: IFramebuffer;
  private writeFBO: IFramebuffer;

  public getReadFBO() {
    return this.readFBO;
  }

  public getWriteFBO() {
    return this.writeFBO;
  }

  /**
   * 从当前的 framebuffer 中获取贴图
   * @returns
   */
  public getCurrentFBOTex() {
    const { getViewportSize, createTexture2D } = this.rendererService;
    const { width, height } = getViewportSize();
    return createTexture2D({
      x: 0,
      y: 0,
      width,
      height,
      copy: true,
    });
  }

  /**
   * 从 readFBO 中获取贴图
   * @returns
   */
  public getReadFBOTex() {
    const { useFramebuffer } = this.rendererService;
    return new Promise((resolve) => {
      useFramebuffer(this.readFBO, async () => {
        resolve(this.getCurrentFBOTex());
      });
    });
  }

  public async renderBloomPass(layer: ILayer, pass: IPostProcessingPass<unknown>) {
    const tex = (await this.getReadFBOTex()) as ITexture2D;
    // count 定义 bloom 交替绘制的次数
    let count = 0;
    while (count < 4) {
      await pass.render(layer, tex);
      this.swap();
      count++;
    }
  }

  public async render(layer: ILayer) {
    for (let i = 0; i < this.passes.length; i++) {
      const pass = this.passes[i];
      // last pass should render to screen
      pass.setRenderToScreen(this.isLastEnabledPass(i));

      // await pass.render(layer);
      // // pingpong
      // if (i !== this.passes.length - 1) {
      //   this.swap();
      // }
      if (pass.getName() === 'bloom') {
        await this.renderBloomPass(layer, pass);
      } else {
        await pass.render(layer);
        // pingpong
        if (i !== this.passes.length - 1) {
          this.swap();
        }
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

  public add<T>(pass: IPostProcessingPass<T>, layer: ILayer, config?: Partial<T>) {
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

  public getPostProcessingPassByName(name: string): IPostProcessingPass<unknown> | undefined {
    return this.passes.find((p) => p.getName() === name);
  }

  private init() {
    const { createFramebuffer, createTexture2D } = this.rendererService;
    this.readFBO = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        usage: TextureUsage.RENDER_TARGET,
      }),
    });
    this.writeFBO = createFramebuffer({
      color: createTexture2D({
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        usage: TextureUsage.RENDER_TARGET,
      }),
    });
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
