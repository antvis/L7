import {
  gl,
  IFramebuffer,
  ILayer,
  IPostProcessingPass,
  IPostProcessor,
} from '@l7/core';
import regl from 'regl';
import ReglFramebuffer from './ReglFramebuffer';
import ReglTexture2D from './ReglTexture2D';

/**
 * ported from Three.js EffectComposer
 */
export default class ReglPostProcessor implements IPostProcessor {
  private passes: IPostProcessingPass[] = [];
  private readFBO: IFramebuffer;
  private writeFBO: IFramebuffer;

  private screenRenderTarget: regl.DrawCommand;
  private offscreenRenderTarget: regl.DrawCommand;
  private inputRenderTarget: regl.DrawCommand;

  private reGl: regl.Regl;

  constructor(reGl: regl.Regl) {
    this.reGl = reGl;
    this.readFBO = new ReglFramebuffer(reGl, {
      color: new ReglTexture2D(reGl, {
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });

    this.writeFBO = new ReglFramebuffer(reGl, {
      color: new ReglTexture2D(reGl, {
        width: 1,
        height: 1,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      }),
    });

    this.screenRenderTarget = reGl({
      framebuffer: null,
    });

    this.offscreenRenderTarget = reGl({
      // since post-processor will swap read/write fbos, we must retrieve it dynamically
      framebuffer: () => (this.writeFBO as ReglFramebuffer).get(),
    });

    this.inputRenderTarget = reGl({
      framebuffer: () => (this.readFBO as ReglFramebuffer).get(),
    });
  }

  public getReadFBO() {
    return this.readFBO;
  }

  public getWriteFBO() {
    return this.writeFBO;
  }

  public renderToPostProcessor(renderCommand: () => void) {
    this.inputRenderTarget(() => {
      this.reGl.clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: (this.getReadFBO() as ReglFramebuffer).get(),
      });
      renderCommand();
    });
  }

  public useScreenRenderTarget(callback: () => void) {
    this.screenRenderTarget({}, callback);
  }

  public useOffscreenRenderTarget(callback: () => void) {
    this.offscreenRenderTarget({}, callback);
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

  public add(pass: IPostProcessingPass, layer: ILayer) {
    pass.init(layer);
    this.passes.push(pass);
  }

  public insert(pass: IPostProcessingPass, index: number, layer: ILayer) {
    pass.init(layer);
    this.passes.splice(index, 0, pass);
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
