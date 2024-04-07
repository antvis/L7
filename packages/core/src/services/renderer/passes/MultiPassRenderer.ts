import type { ILayer } from '../../layer/ILayerService';
import type {
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
  IPostProcessor,
} from '../IMultiPassRenderer';
import { PassType } from '../IMultiPassRenderer';

/**
 * ported from Three.js EffectComposer
 * @example
 * const renderer = new MultiPassRenderer([
 *   new ClearPass(),
 *   new RenderPass({
 *     models: [
 *       new Model(),
 *       new Model(),
 *     ],
 *   }),
 *   new CopyPass({
 *     renderToScreen: true,
 *   }),
 *   new TAAPass(),
 * ]);
 * renderer.render();
 * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/apuvbf#dRM8W
 */
export default class MultiPassRenderer implements IMultiPassRenderer {
  private passes: Array<IPass<unknown>> = [];

  private layer: ILayer;
  private renderFlag: boolean;

  private width: number = 0;

  private height: number = 0;

  constructor(private postProcessor: IPostProcessor) {}

  public setLayer(layer: ILayer) {
    this.layer = layer;
  }

  public setRenderFlag(renderFlag: boolean) {
    this.renderFlag = renderFlag;
  }

  public getRenderFlag() {
    return this.renderFlag;
  }

  public getPostProcessor() {
    return this.postProcessor;
  }

  public async render() {
    for (const pass of this.passes) {
      await pass.render(this.layer);
    }
    // this.layer.renderModels();
    await this.postProcessor.render(this.layer);
  }

  public resize(width: number, height: number) {
    if (this.width !== width || this.height !== height) {
      this.postProcessor.resize(width, height);
      this.width = width;
      this.height = height;
    }
  }

  public add<T>(pass: IPass<T>, config?: Partial<T>) {
    if (pass.getType() === PassType.PostProcessing) {
      this.postProcessor.add<T>(pass as IPostProcessingPass<T>, this.layer, config);
    } else {
      pass.init(this.layer, config);
      this.passes.push(pass);
    }
  }

  public insert<T>(pass: IPass<T>, config: Partial<T>, index: number) {
    pass.init(this.layer, config);
    this.passes.splice(index, 0, pass);
  }

  public destroy() {
    this.passes.length = 0;
  }
}
