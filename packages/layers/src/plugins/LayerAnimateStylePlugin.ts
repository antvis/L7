import {
  ICameraService,
  ILayer,
  ILayerPlugin,
  IModel,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class LayerAnimateStylePlugin implements ILayerPlugin {
  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  public apply(layer: ILayer) {
    // layer.hooks.beforeRender.tap('LayerAnimateStylePlugin', () => {

    // })
    layer.hooks.beforeRender.tap('LayerAnimateStylePlugin', () => {
      // @ts-ignore
      const aniamateStatus = layer.aniamateStatus;
      aniamateStatus &&
        layer.models.forEach((model: IModel) => {
          model.addUniforms({
            ...layer.layerModel.getAnimateUniforms(),
          });
        });
    });
  }
}
