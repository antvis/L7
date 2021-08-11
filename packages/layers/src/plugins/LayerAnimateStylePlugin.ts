import {
  CameraUniform,
  CoordinateUniform,
  ICameraService,
  ICoordinateSystemService,
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
      // 重新计算坐标系参数
      layer.models.forEach((model: IModel) => {
        model.addUniforms({
          ...layer.layerModel.getAnimateUniforms(),
        });
      });
    });
  }
}
