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

@injectable()
export default class LayerAnimateStylePlugin implements ILayerPlugin {
  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('ShaderUniformPlugin', () => {
      // 重新计算坐标系参数

      layer.models.forEach((model: IModel) => {
        model.addUniforms({
          // 相机参数，包含 VP 矩阵、缩放等级
        });
      });
    });
  }
}
