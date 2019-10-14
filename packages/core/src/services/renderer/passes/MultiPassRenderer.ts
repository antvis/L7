import { injectable } from 'inversify';
import { ILayer } from '../../layer/ILayerService';
import {
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
  IPostProcessor,
  PassType,
} from '../IMultiPassRenderer';
import PostProcessor from './PostProcessor';

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
@injectable()
export default class MultiPassRenderer implements IMultiPassRenderer {
  private passes: IPass[] = [];
  private postProcessor: IPostProcessor;

  private layer: ILayer;
  private renderFlag: boolean;

  constructor(layer: ILayer) {
    this.layer = layer;
    this.postProcessor = new PostProcessor();
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
    await this.postProcessor.render(this.layer);
  }

  public resize(width: number, height: number) {
    this.postProcessor.resize(width, height);
  }

  public add(pass: IPass) {
    if (pass.getType() === PassType.PostProcessing) {
      this.postProcessor.add(pass as IPostProcessingPass, this.layer);
    } else {
      pass.init(this.layer);
      this.passes.push(pass);
    }
  }

  public insert(pass: IPass, index: number) {
    pass.init(this.layer);
    this.passes.splice(index, 0, pass);
  }
}
