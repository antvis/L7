import {
  CameraUniform,
  CoordinateUniform,
  ICameraService,
  ICoordinateSystemService,
  ILayer,
  ILayerPlugin,
  IMapService,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

/**
 * 在渲染之前需要获取当前 Shader 所需 Uniform，例如：
 * 1. 从相机服务中获取 View & ProjectionMatrix，当前缩放等级等等
 * 2. 从坐标系服务中获取当前坐标系，例如是否是偏移坐标系
 *    @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/doml91
 * 3. 当前 Layer 本身的样式属性
 */
@injectable()
export default class ShaderUniformPlugin implements ILayerPlugin {
  @inject(TYPES.ICameraService)
  private readonly cameraService: ICameraService;

  @inject(TYPES.ICoordinateSystemService)
  private readonly coordinateSystemService: ICoordinateSystemService;

  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('ShaderUniformPlugin', () => {});
  }
}
